import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ProductsService } from './products.service'
import { CreateProductDto, UpdateProductDto } from './dto/'
import { PaginationDto } from 'src/common/dtos/pagination.dto'
import { Auth, GetUser } from '../auth/decorator'
import { User, ValidRoles } from '../auth/entities'
import { Product } from './entities/product.entity'

@ApiTags('Products')
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiResponse({
  status: 400,
  description: 'Bad Request',
})
@Controller('products')
@Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Product,
  })
  @Auth(ValidRoles.USER)
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user)
  }

  @ApiResponse({
    status: 200,
    description: 'The list Product from database',
    type: [Product],
  })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto)
  }

  @ApiResponse({
    status: 200,
    description: 'The Product was created',
    type: Product,
  })
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term)
  }

  @ApiResponse({
    status: 200,
    description: 'The Product was updated',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'The Product no found',
  })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user)
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'delete succesfull !',
  })
  @ApiResponse({
    status: 404,
    description: 'The Product no found',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id)
  }
}
