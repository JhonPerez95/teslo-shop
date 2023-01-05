import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { validate as isUUID } from 'uuid'
import { PaginationDto } from 'src/common/dtos/pagination.dto'
import { DataSource, Repository } from 'typeorm'
import { CreateProductDto, UpdateProductDto } from './dto/'
import { ProductImage, Product } from './entities'
import { User } from '../auth/entities/user.entity'

@Injectable()
export class ProductsService {
  private logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSourse: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const { images = [], ...productRest } = createProductDto

    try {
      const productDB = this.productsRepository.create({
        ...productRest,
        images: images.map((item) =>
          this.productImageRepository.create({ url: item }),
        ),
        user,
      })
      await this.productsRepository.save(productDB)

      return { ...productDB, images }
    } catch (error) {
      this.handlerExceptionsDB(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    const products = await this.productsRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true },
    })

    return products.map((item) => ({
      ...item,
      images: item.images.map((item) => item.url),
    }))
  }

  async findOne(term: string) {
    let product: Product
    if (isUUID(term)) {
      // product = await this.productsRepository.findOne({
      //   where: { id: term },
      //   relations: { images: true },
      // });
      product = await this.productsRepository.findOneBy({ id: term })
    } else {
      const queryBuilder = this.productsRepository.createQueryBuilder('prod')
      product = await queryBuilder
        .where('UPPER(title)=:title or slug=:slug', { title: term, slug: term })
        .leftJoinAndSelect('prod.images', 'productImages')
        .getOne()
    }
    if (!product) {
      throw new NotFoundException(`Product ${term} not found!`)
    }
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images = [], ...restProduct } = updateProductDto
    const product = await this.productsRepository.preload({
      id,
      ...restProduct,
    })

    if (!product) {
      throw new NotFoundException(`Product ${id} not found!`)
    }

    const queryRunner = this.dataSourse.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } })
        product.images = images.map((item) =>
          this.productImageRepository.create({ url: item }),
        )
      }

      product.user = user
      await queryRunner.manager.save(product)
      await queryRunner.commitTransaction()
      await queryRunner.release()
      // await this.productsRepository.save(product);
      return await this.findOnePlain(id)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      this.handlerExceptionsDB(error)
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    this.productsRepository.remove(product)
    return { statusCode: 200, msg: 'delete succesfull !' }
  }

  // Methos common
  handlerExceptionsDB(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }

    this.logger.error(error)
    throw new InternalServerErrorException(
      'Error server, check your server logs !',
    )
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term)
    return {
      ...rest,
      images: images.map((item) => item.url),
    }
  }

  async deleteAllProducts() {
    const query = this.productsRepository.createQueryBuilder('product')
    try {
      return await query.delete().where({}).execute()
    } catch (error) {
      this.handlerExceptionsDB(error)
    }
  }
}
