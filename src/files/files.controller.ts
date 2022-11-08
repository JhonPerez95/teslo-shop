import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,

    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  getInfoImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getInfoImage(imageName);
    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      //       limits: { fileSize: 1000 },
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    const image = await this.filesService.uploadProductImage(file);

    const secureUrl = `${this.configService.get('HOST_API')}/static/products/${
      image.filename
    }`;
    return { secureUrl };
  }
}
