import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    description: 'The unique identifier for a product',
    example: '284688b9-4a54-481f-95da-d5adcf0166b8',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The title of the product',
    example: 'Men’s Chill Crew Neck Sweatshirt',
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 29.99,
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    description: 'The description of the product',
    default: null,
    example:
      'Introducing the Tesla Chill Collection. The Men’s Chill Crew Neck Sweatshirt has a premium, heavyweight exterior and soft fleece interior for comfort in any season.',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: 'The slug of the product',
    example: 'mens_chill_crew_neck_sweatshirt',
    uniqueItems: true,
  })
  @Column({
    unique: true,
    type: 'text',
  })
  slug: string;

  @ApiProperty({
    description: 'The stock of the product',
    example: 10,
    default: 0,
  })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({
    description: 'The sizes of the product',
    example: ['S', 'M', 'L', 'XL', 'XXL'],
  })
  @Column({ type: 'text', array: true })
  sizes: string[];

  @ApiProperty({
    description: 'The gender of the product',
    example: 'men',
  })
  @Column({ type: 'text' })
  gender: string;

  @ApiProperty({
    description: 'The tags of the product',
    example: ['sweatshirt', 'crew neck', 'chill'],
    default: [],
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty({
    description: 'The images of the product',
    example: ['1740176-00-A_0_2000.jpg', '1740176-00-A_1.jpg'],
    default: [],
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  // Validations
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug.toLowerCase().replace(' ', '_').replace("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug.toLowerCase().replace(' ', '_').replace("'", '');
    this.title = this.title.toLowerCase().replace(' ', '_').replace("'", '');
  }
}
