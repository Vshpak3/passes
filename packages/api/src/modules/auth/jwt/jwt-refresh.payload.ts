import { JwtAuthPayload } from './jwt-auth.payload'

export type JwtRefreshPayload = Omit<
  JwtAuthPayload,
  'isVerified' | 'isCreator' | 'isEmailVerified'
>
