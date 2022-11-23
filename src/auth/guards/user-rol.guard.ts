import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserRolGuard implements CanActivate {
  constructor(private readonly refelector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {


    const validRoles: string[] = this.refelector.get('roles', context.getHandler())
    console.log({ validRoles });
    return false;
  }
}
