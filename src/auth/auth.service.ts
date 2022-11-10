import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    private _jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateUserDto) {
    try {
      const { password, ...resUserDto } = createAuthDto;

      const userDb = this._userRepository.create({
        ...resUserDto,
        password: bcrypt.hashSync(password, 10),
      });
      await this._userRepository.save(userDb);

      // TODO: retornar JWT access token
      return userDb;
    } catch (error) {
      this._handleDbErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const userDb = await this._userRepository.findOne({
      where: {
        email,
      },
      select: {
        email: true,
        password: true,
        roles: true,
      },
    });

    if (!userDb)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, userDb.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    const token = this._jwtService.sign({
      user: userDb.email,
      rol: userDb.roles,
    });
    // TODO: retornar JWT access token
    return { token };
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
  private _handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);
    throw new InternalServerErrorException('Comunication with the admin!');
  }
}
