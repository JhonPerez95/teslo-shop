import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ValidRoles } from '../entities'
import { RoleProtecter } from './role-protecter.decorator'
import { UserRolGuard } from '../guards/user-rol.guard'

export const Auth = (...roles: ValidRoles[]) => {
  return applyDecorators(
    RoleProtecter(...roles),
    UseGuards(AuthGuard(), UserRolGuard),
  )
}
