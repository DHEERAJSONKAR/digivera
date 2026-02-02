/**
 * Check if a free user can perform a scan this month
 * @param {Object} user - User object with plan and lastManualScanAt
 * @returns {Object} - { canScan: boolean, message: string, nextScanDate: Date }
 */
const checkScanLimit = (user) => {
  // Pro users have unlimited scans
  if (user.plan === 'pro') {
    return {
      canScan: true,
      message: 'Pro plan - unlimited scans',
      remainingScans: 'unlimited',
    };
  }

  // Free users - 1 scan per month
  if (!user.lastManualScanAt) {
    return {
      canScan: true,
      message: 'First scan of the month available',
      remainingScans: 1,
    };
  }

  const lastScanDate = new Date(user.lastManualScanAt);
  const currentDate = new Date();

  // Check if last scan was in the current month
  const isSameMonth =
    lastScanDate.getMonth() === currentDate.getMonth() &&
    lastScanDate.getFullYear() === currentDate.getFullYear();

  if (isSameMonth) {
    const nextScanDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );

    return {
      canScan: false,
      message: 'Monthly scan limit reached. Upgrade to Pro for unlimited scans.',
      remainingScans: 0,
      nextScanDate,
    };
  }

  return {
    canScan: true,
    message: 'New month - scan available',
    remainingScans: 1,
  };
};

module.exports = { checkScanLimit };
