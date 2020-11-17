import {
  Controller,
  Get,
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
import { AppService } from './app.service';
import { ApiMultiFilesAndFile, ApiFile } from './decorators/ApiMultiFiles';
import { compareDocxListVsDocx } from './utils/compare-docx/comparepdf.js';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @ApiMultiFilesAndFile()
  @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FilesInterceptor('files'), FileInterceptor('actualFile'))
  // @UseInterceptors()
  @UseInterceptors(AnyFilesInterceptor())
  uploadFile(@UploadedFiles() files) {
    // console.log(files);
    const thiSinhFiles = files
      .filter((fileObj) => fileObj.fieldname === 'files')
      .map((element) => element.path);
    const ketQuaFile = files
      .filter((fileObj) => fileObj.fieldname !== 'files')
      .map((element) => element.path);
    console.log('thiSinhFiles, ketQuaFile :>> ', thiSinhFiles, ketQuaFile);
    compareDocxListVsDocx(thiSinhFiles, ketQuaFile);
  }
}
