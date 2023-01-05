import { Injectable, NotFoundException } from '@nestjs/common'
import { Socket } from 'socket.io'
import { User } from '../auth/entities/user.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

interface ConnectedClient {
  [id: string]: {
    user: User
    socket: Socket
  }
}
@Injectable()
export class MessagesWsService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  private connectedClients: ConnectedClient = {}

  async registerClient(client: Socket, userId: string) {
    try {
      const user = await this._userRepository.findOneBy({ id: userId })
      if (!user) throw new Error('User not found')
      if (!user.isActive) throw new Error('User not active')

      this.connectedClients[client.id] = { user, socket: client }
    } catch (error) {
      throw new NotFoundException('User not found')
    }
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId]
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients)
  }

  getFullNameUser(clientId: string): string {
    return this.connectedClients[clientId].user.fullName
  }
}
