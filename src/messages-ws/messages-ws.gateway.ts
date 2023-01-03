import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { MessagesWsService } from './messages-ws.service'
import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: any) {
    // console.log('handleConnection', client.id)
    const token = client.handshake.headers.authorization
    try {
      const payload = await this.jwtService.verify(token)
      console.log(payload)
    } catch (error) {
      client.disconnect()
      return
    }
    this.messagesWsService.registerClient(client)

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    )
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id)

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    )
  }

  @SubscribeMessage('message-client')
  handleMessageClient(client: Socket, payload: any): void {
    //! Emite el mensaje unicamente al cliente que lo envia
    // client.emit('message-server', {
    //   message: payload.message + ' (from server)',
    //   fullName: 'Soy yo',
    // })

    // ! Emite el mensaje a todos los clientes menos al cliente inicial
    // client.broadcast.emit('message-server', {
    //   message: payload.message + ' (from server)',
    //   fullName: 'Soy yo a todos',
    // })

    // ! Emite el mensaje a todos los clientess
    this.wss.emit('message-server', {
      message: payload.message + ' (from server)',
      fullName: client.id,
    })
  }
}
