import { SetMetadata } from '@nestjs/common'

export const ROLE_KEY = 'role'

export enum RoleEnum {
  NO_AUTH = 'noAuth',
  UNVERIFIED = 'unverified',
  GENERAL = 'general',
  CREATOR_ONLY = 'creatorOnly',
  REFRESH = 'refresh',
}

export const Role = (role: RoleEnum) => SetMetadata(ROLE_KEY, role)
