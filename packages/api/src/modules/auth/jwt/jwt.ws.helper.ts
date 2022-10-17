import jwt from 'jsonwebtoken'
import { Socket } from 'socket.io'

import { JWT_VERIFY_OPTIONS } from './jwt.strategy'

export function getUserFromSocket(
  socket: Socket,
  secret: string,
): string | undefined {
  try {
    const token = socket.handshake.auth.Authorization?.split(' ')[1]
    const decoded = jwt.verify(token, secret, JWT_VERIFY_OPTIONS) as any
    return decoded.sub
  } catch {
    return undefined
  }
}
