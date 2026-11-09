import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { QueryReceiptDto } from './dto/query-receipt.dto';
import { Prisma, Receipt } from '@prisma/client';

@Injectable()
export class ReceiptsService {
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
    createReceiptDto: CreateReceiptDto,
  ): Promise<Receipt> {
    await this.ensureCoupleExists(coupleId);

    return this.prisma.receipt.create({
      data: {
        couple_id: coupleId,
        created_by: createReceiptDto.created_by,
        title: createReceiptDto.title,
        event_date: new Date(createReceiptDto.event_date),
        category: createReceiptDto.category,
        image_url: createReceiptDto.image_url,
        thumb_url: createReceiptDto.thumb_url,
        amount: createReceiptDto.amount !== undefined ? createReceiptDto.amount : null,
        notes: createReceiptDto.notes,
      },
    });
  }

  async findAll(
    coupleId: string,
    query: QueryReceiptDto,
  ): Promise<Receipt[]> {
    const where: Prisma.ReceiptWhereInput = {
      couple_id: coupleId,
    };

    if (query.category) {
      where.category = query.category;
    }

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
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { notes: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.receipt.findMany({
      where,
      orderBy: { event_date: 'desc' },
    });
  }

  async findOne(coupleId: string, id: string): Promise<Receipt> {
    const receipt = await this.prisma.receipt.findFirst({
      where: { id, couple_id: coupleId },
    });

    if (!receipt) {
      throw new NotFoundException(`Receipt with id "${id}" not found`);
    }

    return receipt;
  }

  async update(
    coupleId: string,
    id: string,
    updateReceiptDto: UpdateReceiptDto,
  ): Promise<Receipt> {
    // Verify ownership
    await this.findOne(coupleId, id);

    const updateData: Prisma.ReceiptUpdateInput = {};

    if (updateReceiptDto.created_by !== undefined) {
      updateData.created_by = updateReceiptDto.created_by;
    }
    if (updateReceiptDto.title !== undefined) {
      updateData.title = updateReceiptDto.title;
    }
    if (updateReceiptDto.event_date !== undefined) {
      updateData.event_date = new Date(updateReceiptDto.event_date);
    }
    if (updateReceiptDto.category !== undefined) {
      updateData.category = updateReceiptDto.category;
    }
    if (updateReceiptDto.image_url !== undefined) {
      updateData.image_url = updateReceiptDto.image_url;
    }
    if (updateReceiptDto.thumb_url !== undefined) {
      updateData.thumb_url = updateReceiptDto.thumb_url;
    }
    if (updateReceiptDto.amount !== undefined) {
      updateData.amount = updateReceiptDto.amount;
    }
    if (updateReceiptDto.notes !== undefined) {
      updateData.notes = updateReceiptDto.notes;
    }

    return this.prisma.receipt.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(coupleId: string, id: string): Promise<{ success: boolean }> {
    // Verify ownership
    await this.findOne(coupleId, id);

    await this.prisma.receipt.delete({
      where: { id },
    });

    return { success: true };
  }
}
