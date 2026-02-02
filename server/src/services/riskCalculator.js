/**
 * Calculate risk score based on findings
 * @param {Object} findings - Object containing breachCount and publicMentions
 * @returns {Object} - Object with finalScore and severity
 */
const calculateRiskScore = (findings) => {
  const { breachCount = 0, publicMentions = 0 } = findings;

  // Start with perfect score
  let score = 100;

  // Deduct points
  const breachDeduction = breachCount * 20;
  const mentionDeduction = publicMentions * 10;

  const totalDeduction = breachDeduction + mentionDeduction;

  // Apply max deduction limit of 80 points
  const actualDeduction = Math.min(totalDeduction, 80);

  score = score - actualDeduction;

  // Ensure minimum score of 20
  const finalScore = Math.max(score, 20);

  // Determine severity
  let severity;
  if (finalScore >= 80) {
    severity = 'low';
  } else if (finalScore >= 50) {
    severity = 'medium';
  } else {
    severity = 'high';
  }

  return {
    finalScore,
    severity,
  };
};

module.exports = { calculateRiskScore };
