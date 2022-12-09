import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'Id of the user',
    example: 'e5ea1e8a-d07f-4342-84ac-49180c7e2c4d',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Email of the user',
    uniqueItems: true,
    example: 'test@gmail.com',
  })
  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: '123456',
    nullable: true,
  })
  @Column({
    type: 'text',
    select: false,
  })
  password: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @Column({
    type: 'text',
  })
  fullName: string;

  @ApiProperty({
    description: 'Is active of the user',
    example: true,
    required: false,
    default: true,
  })
  @Column({
    type: 'bool',
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Roles of the user',
    example: ['user'],
    default: ['user'],
    required: false,
  })
  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  roles: string[];

  // create relation whith products
  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLocaleLowerCase();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
