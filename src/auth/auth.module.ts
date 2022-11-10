import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  controllers: [AuthController],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, AuthService],
})
export class AuthModule {}
