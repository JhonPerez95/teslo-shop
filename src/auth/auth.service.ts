import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  async create(createAuthDto: CreateUserDto) {
    try {
      const userDb = this._userRepository.create(createAuthDto);
      await this._userRepository.save(userDb);
      return userDb;
    } catch (error) {
      this._handleDbErrors(error);
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  // Private
  private _handleDbErrors(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);
    throw new InternalServerErrorException('Comunication with the admin!');
  }
}
