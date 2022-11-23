import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRolGuard implements CanActivate {
  constructor(private readonly refelector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.refelector.get(
      'roles',
      context.getHandler(),
    );


    if(!validRoles) return true
    if (!validRoles.length) return true;
    const { user } = context.switchToHttp().getRequest();

    for (const rol of user.roles) {
      if (validRoles.includes(rol)) return true;
    }
    throw new ForbiddenException(
      `User ${user.fullName} need a valid roles, example: ${validRoles}`,
    );
  }
}
