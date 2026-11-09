import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class StorageService {
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = path.resolve(
      this.configService.get<string>('UPLOAD_DIR', './uploads'),
    );

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File, folder = 'general'): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const targetFolder = path.join(this.uploadDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const extension = path.extname(file.originalname) || '.jpg';
    const filename = `${uuidv4()}${extension}`;
    const filePath = path.join(targetFolder, filename);

    await fs.promises.writeFile(filePath, file.buffer);

    const publicUrl = `/uploads/${folder}/${filename}`;

    return {
      url: publicUrl,
      filename,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
