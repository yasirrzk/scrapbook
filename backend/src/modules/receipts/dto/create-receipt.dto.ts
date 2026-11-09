import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ReceiptCategory } from '@prisma/client';

export class CreateReceiptDto {
  @ApiProperty({
    description: 'Name or identifier of the partner who created this receipt',
    example: 'yaseru',
  })
  @IsString()
  @IsNotEmpty()
  created_by: string;

  @ApiProperty({
    description: 'Receipt or ticket title',
    example: 'Tiket Nonton La La Land',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Event date in YYYY-MM-DD format',
    example: '2025-11-09',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'event_date must be in YYYY-MM-DD format',
  })
  event_date: string;

  @ApiProperty({
    enum: ReceiptCategory,
    description: 'Receipt category',
    example: ReceiptCategory.movie,
  })
  @IsEnum(ReceiptCategory)
  category: ReceiptCategory;

  @ApiProperty({
    description: 'Receipt image URL or storage key',
    example: 'https://storage.scrapbook.app/receipts/1.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image_url: string;

  @ApiPropertyOptional({
    description: 'Thumbnail image URL',
    example: 'https://storage.scrapbook.app/receipts/1-thumb.jpg',
  })
  @IsString()
  @IsOptional()
  thumb_url?: string;

  @ApiPropertyOptional({
    description: 'Transaction amount (IDR or relevant currency)',
    example: 110000,
  })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({
    description: 'Personal memory notes or comments',
    example: 'Kencan pertama kita! Romantis banget.',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
