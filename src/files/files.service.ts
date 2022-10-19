import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  async uploadProductImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not found');
    }
    return {
      statusCode: 200,
      message: 'Route uploaded successfully',
      data: file,
    };
  }
}
