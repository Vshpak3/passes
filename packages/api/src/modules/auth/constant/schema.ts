// Current FB User ID is 26 in length, so 64 should be more than safe
export const AUTH_FACEBOOK_USER_ID_LENGTH = 64

// Minimum eight characters, at least one letter and one number
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-zA-Z])(?=\S+$).{8,}$/
