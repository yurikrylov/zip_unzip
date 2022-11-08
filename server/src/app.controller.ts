import {Body, Controller, Post, Get, UploadedFile, UseInterceptors, Response, Query, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthBody, Token } from "./dto/dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "./file.service";
import path = require('path');
import {JwtAuthGuard} from "./auth/jwt-auth.guard";
const contentDisposition = require('content-disposition');

var mime = require('mime-types')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService, private readonly fileService: FileService) { }

	@ApiOperation({ summary: 'Авторизация в CaseOne' })
	@ApiResponse({ status: 200, type: Token })
	@ApiResponse({ status: 400, description: 'Неверные данные для авторизации' })
	@Post('/с1auth')
	async auth(@Body() body: AuthBody) {
		return await this.appService.c1Auth(body);
	}

	@Post('xlsxUpload')
	@UseInterceptors(FileInterceptor('file'))
	uploadFile(@UploadedFile() file) {
		console.log(file);
	}

	@Post('zipUpload')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	async uploadZipFile(@UploadedFile() file: Express.Multer.File) {
		//console.log(file)
		/* не понимает зип архивы из c1 TODO: добавить все возможные mimetype
		if (!(file.mimetype == 'application/x-zip-compressed' || file.mimetype == 'application/zip')) {
			return new BadRequestException(new Error('НЕ ЗИП Файл'), 'не зип файл');
		}
		*/
		return await this.fileService.uploadZipFile(file)
	}

	@Get('download')
	@UseGuards(JwtAuthGuard)
	async getFile(@Response({ passthrough: true }) res, @Query('fileId') fileId: string,) {
		try {
			let { file, fileName } =  await this.fileService.downloadUnzipedFiles(fileId);
			const baseName = path.basename(decodeURI(fileName))
			const mimeType = mime.contentType(baseName)
			const cd = contentDisposition(baseName)
			res.set({
				'Content-Type': mimeType,
				'Content-Disposition': cd,
			});
			return file
		} catch(e) {
			return e;
		}

	}
}
