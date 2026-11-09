import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { ReceiptCategory } from '@prisma/client';

export class QueryReceiptDto {
  @ApiPropertyOptional({
    enum: ReceiptCategory,
    description: 'Filter by category',
  })
  @IsEnum(ReceiptCategory)
  @IsOptional()
  category?: ReceiptCategory;

  @ApiPropertyOptional({
    description: 'Filter from date (YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'from_date must be in YYYY-MM-DD format',
  })
  @IsOptional()
  from_date?: string;

  @ApiPropertyOptional({
    description: 'Filter to date (YYYY-MM-DD)',
    example: '2025-12-31',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'to_date must be in YYYY-MM-DD format',
  })
  @IsOptional()
  to_date?: string;

  @ApiPropertyOptional({
    description: 'Search by title or notes',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
