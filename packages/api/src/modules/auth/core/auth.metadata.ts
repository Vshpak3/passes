import { SetMetadata } from '@nestjs/common'

export const ROLE_KEY = 'role'

export enum RoleEnum {
  NO_AUTH = 'noAuth',
  UNVERIFIED = 'unverified',
  GENERAL = 'general',
  CREATOR_ONLY = 'creatorOnly',
  REFRESH = 'refresh',
}

// If one of these roles is set then skip normal auth
export const SKIP_AUTH_FOR_ROLES = new Set([
  RoleEnum.NO_AUTH,
  RoleEnum.UNVERIFIED,
  RoleEnum.REFRESH,
])

export const Role = (role: RoleEnum) => SetMetadata(ROLE_KEY, role)
