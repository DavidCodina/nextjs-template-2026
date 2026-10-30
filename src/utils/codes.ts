/** Custom error codes */
export const codes = {
  OK: 'OK',

  CREATED: 'CREATED',

  UPDATED: 'UPDATED',

  DELETED: 'DELETED',

  BAD_REQUEST: 'BAD_REQUEST',

  UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE',

  NOT_FOUND: 'NOT_FOUND',

  CONFLICT: 'CONFLICT',

  FORM_ERRORS: 'FORM_ERRORS',

  /** Use this as an opaque error code for all failed login attempts. */
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS', // ! Possibly remove.

  // Previously I was using: INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  // However, it would be better to use "INVALID_EMAIL_OR_PASSWORD"
  // because that's actually a listed BetterAuthErrorCode (see types directory).
  // In any case, I prefer LOGIN_FAILED and REGISTRATION_FAILED.
  LOGIN_FAILED: 'LOGIN_FAILED',

  REGISTRATION_FAILED: 'REGISTRATION_FAILED',

  VALIDATION_ERROR: 'VALIDATION_ERROR',

  /** Use this when authentication fails. */
  UNAUTHORIZED: 'UNAUTHORIZED',

  /** Use this when authorization fails. This may be used for RBAC or when a
   * reources associated user id does not match the current user's id.
   */
  FORBIDDEN: 'FORBIDDEN',

  /** Use this when the user is ALREADY archived, not on succesfful update to arching the user. */
  USER_ARCHIVED: 'USER_ARCHIVED',

  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',

  EMAIL_UNVERIFIED: 'EMAIL_UNVERIFIED',

  EMAIL_BLACKLISTED: 'EMAIL_BLACKLISTED',

  INVALID_PASSWORD: 'INVALID_PASSWORD'
} as const
