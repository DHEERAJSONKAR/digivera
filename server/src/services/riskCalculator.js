/**
 * Calculate risk score based on findings
 * FREE VERSION: Uses GitHub public exposure data only
 * 
 * @param {Object} findings - Object containing publicExposure and publicMentions
 * @returns {Object} - Object with finalScore, severity, and explanation
 */
const calculateRiskScore = (findings) => {
  const { publicExposure = 0, publicMentions = 0 } = findings;

  // Start with perfect score
  let score = 100;

  // Calculate deductions
  // Public exposure: -5 points per occurrence (max deduction: 30 points)
  const exposureDeduction = Math.min(publicExposure * 5, 30);
  
  // Public mentions: -10 points per mention (supplementary signal)
  const mentionDeduction = publicMentions * 10;

  const totalDeduction = exposureDeduction + mentionDeduction;

  // Apply max total deduction limit of 80 points
  const actualDeduction = Math.min(totalDeduction, 80);

  score = score - actualDeduction;

  // Ensure minimum score of 20
  const finalScore = Math.max(score, 20);

  // Determine severity level
  let severity;
  if (finalScore >= 80) {
    severity = 'low';
  } else if (finalScore >= 50) {
    severity = 'medium';
  } else {
    severity = 'high';
  }

  // Generate human-readable explanation
  let explanation = '';
  
  if (publicExposure === 0 && publicMentions === 0) {
    explanation = 'No public exposure detected. Your information appears secure.';
  } else if (publicExposure > 0) {
    explanation = `Your email was found in ${publicExposure} publicly accessible code ${publicExposure === 1 ? 'repository' : 'repositories'}. `;
    
    if (publicExposure >= 5) {
      explanation += 'This is a significant security concern. Consider changing passwords and enabling 2FA.';
    } else {
      explanation += 'Review these occurrences and consider rotating credentials.';
    }
  } else if (publicMentions > 0) {
    explanation = `Your information appeared in ${publicMentions} public ${publicMentions === 1 ? 'mention' : 'mentions'}. Monitor for unusual activity.`;
  }

  return {
    finalScore,
    severity,
    explanation,
  };
};

module.exports = { calculateRiskScore };
