import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const productDB = this.productsRepository.create(createProductDto);
      await this.productsRepository.save(productDB);

      return productDB;
    } catch (error) {
      this.handlerExceptionsDB(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.productsRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productsRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productsRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title)=:title or slug=:slug', { title: term, slug: term })
        .getOne();
    }
    if (!product) {
      throw new NotFoundException(`Product ${term} not found!`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found!`);
    }

    try {
      await this.productsRepository.save(product);
      return product;
    } catch (error) {
      this.handlerExceptionsDB(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    this.productsRepository.remove(product);
  }

  handlerExceptionsDB(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Error server, check your server logs !',
    );
  }
}
