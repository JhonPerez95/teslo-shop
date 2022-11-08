import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  async uploadProductImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not found adas');
    }

    return file;
  }

  getInfoImage(imageName: string) {
    const path = join(__dirname, '../../static/products/', imageName);
    if (!existsSync(path)) {
      throw new BadRequestException('No product image found');
    }
    return path;
  }
}
