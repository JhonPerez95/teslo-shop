import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/';
import { User } from './entities/user.entity';
import { UserRolGuard } from './guards/user-rol.guard';
import { ValidRoles } from './entities';
import { GetRawHeaders, GetUser, RoleProtecter, Auth } from './decorator';

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
  // @SetMetadata('roles', ['admin', 'super-user', ''])
  @RoleProtecter(ValidRoles.SUPER_USER, ValidRoles.ADMIN)
  @UseGuards(AuthGuard(), UserRolGuard)
  testing2(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Route private2',
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.SUPER_USER)
  testing3(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Route private2',
      user,
    };
  }
}
