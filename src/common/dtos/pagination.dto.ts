import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsPositive, Min } from 'class-validator'

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'The number of items to return',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number

  @ApiProperty({
    default: 0,
    description: 'The number of items to skip',
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset?: number
}
