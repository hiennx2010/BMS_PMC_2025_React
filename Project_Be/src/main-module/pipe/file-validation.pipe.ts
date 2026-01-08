import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import { GeneralResponse } from 'src/common-module/dto/general-response.dto';
import { SocialAdminErrorDetail } from '../exception/social-admin-error-detail';

@Injectable()
export class FileValidationPipe implements PipeTransform {
    private readonly allowedExtensions = ['.xlsx'];
    private readonly allowedMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    private readonly maxSize = 1024 * 1024 * parseInt(process.env['bad-word-file.size'] ?? '5');

    transform(file: Express.Multer.File): Express.Multer.File | GeneralResponse {
        if (!this.isValidExtension(file.originalname) || !this.isValidMimeType(file.mimetype)) {
            return GeneralResponse.getInstance(SocialAdminErrorDetail.FILE_TYPE_INVALID)
        }

        if (!this.isValidSize(file.size)) {
            return GeneralResponse.getInstance(SocialAdminErrorDetail.FILE_SIZE_INVALID)
        }
        return file;
    }

    private isValidExtension(filename: string): boolean {
        const fileExtension = path.extname(filename).toLowerCase();
        return this.allowedExtensions.includes(fileExtension);
    }

    private isValidMimeType(mimeType: string): boolean {
        return mimeType === this.allowedMimeType;
    }

    private isValidSize(fileSize: number): boolean {
        return fileSize <= this.maxSize;
    }
}
