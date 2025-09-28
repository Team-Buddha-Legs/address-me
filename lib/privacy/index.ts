/**
 * Privacy module exports
 */

export {
  anonymizeUserProfile,
  anonymizePersonalizedSummary,
  sanitizeForLogging,
  createPrivacyHash,
  shouldExpireData,
  validatePrivacyCompliance,
  generateAnalyticsData,
  DATA_RETENTION,
} from './data-handler';

export {
  PrivacyLogger,
  LogLevel,
  logger,
} from './logger';