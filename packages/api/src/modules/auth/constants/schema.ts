// Current FB User ID is 26 in length, so 64 should be more than safe
export const AUTH_FACEBOOK_USER_ID_LENGTH = 64

// Minimum eight characters, at least one letter and one number
export const PASSWORD_MIN_LENGTH = 8 // @share-with-frontend auth
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-zA-Z])(?=\S+$).{8,}$/ // @share-with-frontend auth

export const AUTH_PASSWORD_HASH_LENGTH = 100
export const AUTH_OAUTH_ID_LENGTH = 255
export const AUTH_OAUTH_PROVIDER_LENGTH = 20
