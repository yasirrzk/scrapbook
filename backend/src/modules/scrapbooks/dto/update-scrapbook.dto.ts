import { PartialType } from '@nestjs/swagger';
import { CreateScrapbookDto } from './create-scrapbook.dto';

export class UpdateScrapbookDto extends PartialType(CreateScrapbookDto) {}
