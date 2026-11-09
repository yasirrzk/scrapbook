import { Module } from '@nestjs/common';
import { ScrapbooksService } from './scrapbooks.service';
import { ScrapbooksController } from './scrapbooks.controller';

@Module({
  controllers: [ScrapbooksController],
  providers: [ScrapbooksService],
  exports: [ScrapbooksService],
})
export class ScrapbooksModule {}
