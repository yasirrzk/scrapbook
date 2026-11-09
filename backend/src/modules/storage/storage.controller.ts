import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { CoupleTenantGuard } from '../../common/guards/couple-tenant.guard';

@ApiTags('storage')
@ApiHeader({
  name: 'x-couple-id',
  description: 'UUID identifier of the couple tenant',
  required: true,
})
@UseGuards(CoupleTenantGuard)
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload an image file (compressed client-side first)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({
    name: 'folder',
    required: false,
    enum: ['receipts', 'scrapbooks', 'general'],
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.storageService.saveFile(file, folder || 'general');
  }
}
