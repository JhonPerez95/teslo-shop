import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Header,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { GetRawHeaders } from './decorator/get-rawHeaders.decorator';
import { GetUser } from './decorator/get-user.decorator';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/';
import { User } from './entities/user.entity';
import { UserRolGuard } from './guards/user-rol.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testing(
    @Req() request: Request,
    @GetUser() user: User,
    @GetUser(['email', 'fullName']) userEmail: User,
    @GetRawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Route private',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  @Get('private2')
  @SetMetadata('roles', [])
  @UseGuards(AuthGuard(), UserRolGuard)
  testing2(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Route private2',
      user,
    };
  }
}
