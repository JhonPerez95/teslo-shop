import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
//       limits: { fileSize: 1000 },
      storage: diskStorage({ destination: './static/uploads', filename: fileNamer}),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadProductImage(file);
  }
}
