/**
 * GitHub Public Exposure Service
 * 
 * Checks if a user's email appears in public GitHub code repositories
 * Uses GitHub Search Code API with rate limiting and caching
 * 
 * Security: Never logs emails, never exposes GitHub token
 */

const axios = require('axios');
const crypto = require('crypto');

// In-memory cache for GitHub search results
// Key: SHA256 hash of email
// Value: { found, count, timestamp }
const searchCache = new Map();

// Cache TTL: 24 hours (in milliseconds)
const CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Hash email for cache key (privacy protection)
 * @param {string} email - Email to hash
 * @returns {string} - SHA256 hash
 */
const hashEmail = (email) => {
  return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
};

/**
 * Get cached result for email
 * @param {string} email - Email to check
 * @returns {Object|null} - Cached result or null
 */
const getCachedResult = (email) => {
  const cacheKey = hashEmail(email);
  const cached = searchCache.get(cacheKey);
  
  if (!cached) return null;
  
  // Check if cache is still valid
  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    // Cache expired, remove it
    searchCache.delete(cacheKey);
    return null;
  }
  
  return {
    found: cached.found,
    count: cached.count,
    cached: true,
  };
};

/**
 * Save result to cache
 * @param {string} email - Email
 * @param {Object} result - Result to cache
 */
const cacheResult = (email, result) => {
  const cacheKey = hashEmail(email);
  searchCache.set(cacheKey, {
    found: result.found,
    count: result.count,
    timestamp: Date.now(),
  });
};

/**
 * Check if user can perform GitHub scan (rate limiting)
 * Free users: 1 scan per 24 hours per email
 * Pro users: Unlimited
 * 
 * @param {Object} user - User object with plan info
 * @param {Date} lastScanTime - Last manual scan timestamp
 * @returns {Object} - { allowed: boolean, reason: string }
 */
const canPerformScan = (user, lastScanTime) => {
  // Pro users have unlimited scans
  if (user.plan === 'pro') {
    return { allowed: true };
  }
  
  // Free users: check 24-hour limit
  if (lastScanTime) {
    const hoursSinceLastScan = (Date.now() - new Date(lastScanTime).getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLastScan < 24) {
      return {
        allowed: false,
        reason: `Rate limit: Free users can scan once per 24 hours. Try again in ${Math.ceil(24 - hoursSinceLastScan)} hours.`,
      };
    }
  }
  
  return { allowed: true };
};

/**
 * Search GitHub for email exposure
 * 
 * @param {string} email - Email address to search for
 * @returns {Promise<Object>} - { found: boolean, count: number, error?: string }
 */
const checkEmailExposure = async (email) => {
  // Input validation
  if (!email || typeof email !== 'string') {
    return { found: false, count: 0, error: 'Invalid email provided' };
  }
  
  // Check cache first
  const cachedResult = getCachedResult(email);
  if (cachedResult) {
    console.log('[GitHub] Using cached result');
    return cachedResult;
  }
  
  // Check if GitHub token is configured
  if (!process.env.GITHUB_TOKEN) {
    console.warn('[GitHub] GITHUB_TOKEN not configured - skipping public exposure check');
    return {
      found: false,
      count: 0,
      error: 'GitHub integration not configured',
    };
  }
  
  try {
    // Build GitHub API request
    const searchQuery = `"${email}"`;
    const apiUrl = 'https://api.github.com/search/code';
    
    console.log('[GitHub] Searching for public exposure...');
    
    // Make API call with timeout
    const response = await axios.get(apiUrl, {
      params: {
        q: searchQuery,
        per_page: 1, // We only need the count
      },
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'DIGIVERA',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      timeout: 5000, // 5 second timeout
    });
    
    const totalCount = response.data.total_count || 0;
    const found = totalCount > 0;
    
    console.log(`[GitHub] Search complete - Found: ${found}, Count: ${totalCount}`);
    
    // Prepare result
    const result = {
      found,
      count: totalCount,
      cached: false,
    };
    
    // Cache the result
    cacheResult(email, result);
    
    return result;
    
  } catch (error) {
    // Handle GitHub API errors gracefully
    if (error.response) {
      const status = error.response.status;
      
      // Rate limit exceeded (GitHub allows 10 requests/minute for authenticated users)
      if (status === 403 || status === 429) {
        console.warn('[GitHub] Rate limit exceeded');
        return {
          found: false,
          count: 0,
          error: 'GitHub rate limit exceeded. Please try again later.',
        };
      }
      
      // Validation failed (422) - invalid search query
      if (status === 422) {
        console.warn('[GitHub] Invalid search query');
        return {
          found: false,
          count: 0,
          error: 'Invalid search query',
        };
      }
      
      console.error(`[GitHub] API error: ${status}`, error.response.data?.message);
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      console.warn('[GitHub] Request timeout');
      return {
        found: false,
        count: 0,
        error: 'Request timeout',
      };
    } else {
      // Network or other errors
      console.error('[GitHub] Network error:', error.message);
    }
    
    // Return safe fallback (scan continues without GitHub data)
    return {
      found: false,
      count: 0,
      error: 'GitHub service temporarily unavailable',
    };
  }
};

/**
 * Clear cache (for testing or maintenance)
 */
const clearCache = () => {
  searchCache.clear();
  console.log('[GitHub] Cache cleared');
};

/**
 * Get cache statistics (for monitoring)
 */
const getCacheStats = () => {
  return {
    size: searchCache.size,
    ttl: CACHE_TTL,
  };
};

module.exports = {
  checkEmailExposure,
  canPerformScan,
  clearCache,
  getCacheStats,
};
