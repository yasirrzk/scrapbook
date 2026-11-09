import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class OnThisDayQueryDto {
  @ApiPropertyOptional({
    description: 'Specific reference date in YYYY-MM-DD format (defaults to current server date)',
    example: '2026-11-09',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  @IsOptional()
  date?: string;
}
