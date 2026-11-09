import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OnThisDayItem, OnThisDayResponse } from '../../types';

@Injectable()
export class MemoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getOnThisDay(
    coupleId: string,
    targetDateStr?: string,
  ): Promise<OnThisDayResponse> {
    const today = targetDateStr ? new Date(targetDateStr) : new Date();
    const targetMonth = today.getMonth() + 1;
    const targetDay = today.getDate();
    const currentYear = today.getFullYear();
    const formattedDate = today.toISOString().split('T')[0];

    // Query pencocokan tanggal dilakukan berdasarkan kesamaan EXTRACT(MONTH) dan EXTRACT(DAY) dengan tahun < EXTRACT(YEAR FROM CURRENT_DATE)
    const receipts = await this.prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        event_date: Date;
        category: string;
        thumb_url: string | null;
        image_url: string;
        notes: string | null;
      }>
    >`
      SELECT 
        id::text,
        title,
        event_date,
        category::text,
        thumb_url,
        image_url,
        notes
      FROM receipts
      WHERE couple_id = ${coupleId}::uuid
        AND EXTRACT(MONTH FROM event_date) = ${targetMonth}
        AND EXTRACT(DAY FROM event_date) = ${targetDay}
        AND EXTRACT(YEAR FROM event_date) < ${currentYear}
      ORDER BY event_date DESC
    `;

    const scrapbooks = await this.prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        event_date: Date;
        thumbnail_url: string | null;
      }>
    >`
      SELECT 
        id::text,
        title,
        event_date,
        thumbnail_url
      FROM scrapbooks
      WHERE couple_id = ${coupleId}::uuid
        AND EXTRACT(MONTH FROM event_date) = ${targetMonth}
        AND EXTRACT(DAY FROM event_date) = ${targetDay}
        AND EXTRACT(YEAR FROM event_date) < ${currentYear}
      ORDER BY event_date DESC
    `;

    const items: OnThisDayItem[] = [];

    for (const r of receipts) {
      const eventYear = new Date(r.event_date).getFullYear();
      items.push({
        type: 'receipt',
        id: r.id,
        title: r.title,
        event_date: new Date(r.event_date).toISOString().split('T')[0],
        years_ago: currentYear - eventYear,
        thumbnail_url: r.thumb_url || r.image_url,
        category: r.category as OnThisDayItem['category'],
        notes: r.notes,
      });
    }

    for (const s of scrapbooks) {
      const eventYear = new Date(s.event_date).getFullYear();
      items.push({
        type: 'scrapbook',
        id: s.id,
        title: s.title,
        event_date: new Date(s.event_date).toISOString().split('T')[0],
        years_ago: currentYear - eventYear,
        thumbnail_url: s.thumbnail_url,
      });
    }

    // Sort by years_ago descending (oldest memories first or reverse)
    items.sort((a, b) => b.years_ago - a.years_ago);

    return {
      date: formattedDate,
      items,
    };
  }
}
