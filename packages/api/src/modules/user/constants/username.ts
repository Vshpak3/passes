// Alphanumeric: A-Z, a-z, 0-9
// Special characters: _
export const VALID_USERNAME_REGEX = '^[a-zA-Z0-9_]+$'

export const MAX_USERNAME_RESET_COUNT_PER_TIMEFRAME = 5
export const USERNAME_RESET_TIME_SPAN_MS = 1000 * 60 * 60 * 24 // 1 day
