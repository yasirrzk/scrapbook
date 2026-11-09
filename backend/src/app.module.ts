import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { ReceiptsModule } from './modules/receipts/receipts.module';
import { ScrapbooksModule } from './modules/scrapbooks/scrapbooks.module';
import { MemoriesModule } from './modules/memories/memories.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    ReceiptsModule,
    ScrapbooksModule,
    MemoriesModule,
    StorageModule,
  ],
})
export class AppModule {}
