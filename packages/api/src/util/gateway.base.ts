import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { getUserFromSocket } from '../modules/auth/jwt/jwt.ws.helper'

export class GatewayBase implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server
  connections: Record<string, Set<Socket>> = {}
  secret: string

  async handleConnection(socket: Socket) {
    const userId = getUserFromSocket(socket, this.secret)
    if (!userId) {
      socket.disconnect()
      return
    }
    if (!this.connections[userId]) {
      this.connections[userId] = new Set()
    }
    this.connections[userId].add(socket)
  }

  async handleDisconnect(socket: Socket) {
    const userId = getUserFromSocket(socket, this.secret)
    if (!userId) {
      return
    }
    this.connections[userId].delete(socket)
  }

  send(userId: string, event: string, data: any) {
    if (this.connections[userId]) {
      this.connections[userId].forEach((socket) => {
        socket.emit(event, data)
      })
    }
  }
}
