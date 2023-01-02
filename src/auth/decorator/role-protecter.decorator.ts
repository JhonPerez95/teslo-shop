import { SetMetadata } from '@nestjs/common'
import { ValidRoles } from '../entities'

export const META_ROLES = 'roles'
export const RoleProtecter = (...args: ValidRoles[]) => {
  return SetMetadata(META_ROLES, args)
}
