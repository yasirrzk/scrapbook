import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateScrapbookDto {
  @ApiProperty({
    description: 'Scrapbook collage title',
    example: 'Liburan Romantis di Jogja',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Associated event date (YYYY-MM-DD)',
    example: '2025-11-09',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'event_date must be in YYYY-MM-DD format',
  })
  event_date: string;

  @ApiPropertyOptional({
    description: 'Canvas background hex color',
    example: '#FFFDF5',
    default: '#FFFDF5',
  })
  @IsString()
  @IsOptional()
  bg_color?: string;

  @ApiProperty({
    description:
      'Fabric.js canvas state serialized as JSON (via canvas.toJSON()). Never store raw binary blobs.',
    example: {
      version: '6.0.0',
      objects: [],
      background: '#FFFDF5',
    },
  })
  @IsObject()
  @IsNotEmpty()
  canvas_json: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Generated preview / thumbnail image URL for gallery display',
    example: 'https://storage.scrapbook.app/scrapbooks/thumb-1.png',
  })
  @IsString()
  @IsOptional()
  thumbnail_url?: string;
}
