import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { extname } from 'path';
import { AppService } from './app.service';
import { ApiMultiFilesAndFile, ApiFile } from './decorators/ApiMultiFiles';
import { compareDocxListVsDocx } from './utils/compare-docx/comparepdf.js';
import { diskStorage } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FilesInterceptor('files'), FileInterceptor('actualFile'))
  // @UseInterceptors()
  @ApiMultiFilesAndFile()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads',
        fileSize: 5e7,
        files: 20,
        filename: (req, file, cb) => {
          try {
            // const fileName = '123456789';
            // console.log('file :>> ', file);
            return cb(null, `${file.originalname}`);
          } catch (err) {
            return cb(
              new HttpException('Errored at upload', HttpStatus.BAD_REQUEST),
            );
          }
        },
      }),
    }),
  )
  async uploadFile(@UploadedFiles() files) {
    // console.log(files);
    const thiSinhFiles = files
      .filter((fileObj) => fileObj.fieldname === 'files')
      .map((element) => element.path);
    const ketQuaFile = files
      .filter((fileObj) => fileObj.fieldname !== 'files')
      .map((element) => element.path);
    // console.log('thiSinhFiles, ketQuaFile :>> ', thiSinhFiles, ketQuaFile);

    return await compareDocxListVsDocx(thiSinhFiles, ketQuaFile);
  }
}
