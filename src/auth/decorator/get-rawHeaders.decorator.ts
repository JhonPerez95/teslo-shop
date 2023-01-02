import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetRawHeaders = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().rawHeaders

    return headers
  },
)
