import Request from 'express'

const AUTH_HEADER = 'authorization'
const AUTH_HEADER_REGEX = /(\S+)\s+(\S+)/
const BEARER_AUTH_SCHEME = 'bearer'

export function ExtractJwtFromBodyField(field_name: string) {
  return function (request: Request): string | null {
    if (!request.body) {
      return null
    }
    if (!Object.prototype.hasOwnProperty.call(request.body, field_name)) {
      return null
    }
    return request.body[field_name]
  }
}

export function ExtractJwtFromAuthHeaderWithScheme() {
  return function (request: Request): string | null {
    if (!request.headers[AUTH_HEADER]) {
      return null
    }
    const match = request.headers[AUTH_HEADER].match(AUTH_HEADER_REGEX)
    if (!match) {
      return null
    }
    const { 1: scheme, 2: value } = match
    if (BEARER_AUTH_SCHEME !== scheme.toLowerCase()) {
      return null
    }
    return value
  }
}
