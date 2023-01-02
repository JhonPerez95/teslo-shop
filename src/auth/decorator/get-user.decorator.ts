import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  const user = req.user

  if (!user) throw new InternalServerErrorException('User no found in request!')

  if (Array.isArray(data)) {
    const userDat = {}
    data.forEach((item) => {
      userDat[item] = user[item]
    })
    return userDat
  }

  if (data) {
    return user[data]
  }

  return user
})
