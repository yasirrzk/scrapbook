import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateScrapbookDto } from './dto/create-scrapbook.dto';
import { UpdateScrapbookDto } from './dto/update-scrapbook.dto';
import { QueryScrapbookDto } from './dto/query-scrapbook.dto';
import { Prisma, Scrapbook } from '@prisma/client';

@Injectable()
export class ScrapbooksService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureCoupleExists(coupleId: string): Promise<void> {
    await this.prisma.couple.upsert({
      where: { id: coupleId },
      update: {},
      create: { id: coupleId, name: 'Our Scrapbook' },
    });
  }

  async create(
    coupleId: string,
    createScrapbookDto: CreateScrapbookDto,
  ): Promise<Scrapbook> {
    await this.ensureCoupleExists(coupleId);

    return this.prisma.scrapbook.create({
      data: {
        couple_id: coupleId,
        title: createScrapbookDto.title,
        event_date: new Date(createScrapbookDto.event_date),
        bg_color: createScrapbookDto.bg_color || '#FFFDF5',
        canvas_json: createScrapbookDto.canvas_json as Prisma.InputJsonValue,
        thumbnail_url: createScrapbookDto.thumbnail_url,
      },
    });
  }

  async findAll(
    coupleId: string,
    query: QueryScrapbookDto,
  ): Promise<Scrapbook[]> {
    const where: Prisma.ScrapbookWhereInput = {
      couple_id: coupleId,
    };

    if (query.from_date || query.to_date) {
      where.event_date = {};
      if (query.from_date) {
        where.event_date.gte = new Date(query.from_date);
      }
      if (query.to_date) {
        where.event_date.lte = new Date(query.to_date);
      }
    }

    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }

    return this.prisma.scrapbook.findMany({
      where,
      orderBy: { event_date: 'desc' },
    });
  }

  async findOne(coupleId: string, id: string): Promise<Scrapbook> {
    const scrapbook = await this.prisma.scrapbook.findFirst({
      where: { id, couple_id: coupleId },
    });

    if (!scrapbook) {
      throw new NotFoundException(`Scrapbook with id "${id}" not found`);
    }

    return scrapbook;
  }

  async update(
    coupleId: string,
    id: string,
    updateScrapbookDto: UpdateScrapbookDto,
  ): Promise<Scrapbook> {
    await this.findOne(coupleId, id);

    const updateData: Prisma.ScrapbookUpdateInput = {};

    if (updateScrapbookDto.title !== undefined) {
      updateData.title = updateScrapbookDto.title;
    }
    if (updateScrapbookDto.event_date !== undefined) {
      updateData.event_date = new Date(updateScrapbookDto.event_date);
    }
    if (updateScrapbookDto.bg_color !== undefined) {
      updateData.bg_color = updateScrapbookDto.bg_color;
    }
    if (updateScrapbookDto.canvas_json !== undefined) {
      updateData.canvas_json = updateScrapbookDto.canvas_json as Prisma.InputJsonValue;
    }
    if (updateScrapbookDto.thumbnail_url !== undefined) {
      updateData.thumbnail_url = updateScrapbookDto.thumbnail_url;
    }

    return this.prisma.scrapbook.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(coupleId: string, id: string): Promise<{ success: boolean }> {
    await this.findOne(coupleId, id);

    await this.prisma.scrapbook.delete({
      where: { id },
    });

    return { success: true };
  }
}
