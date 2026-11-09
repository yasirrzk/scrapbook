export type ReceiptCategoryType =
  | 'food'
  | 'transport'
  | 'movie'
  | 'shopping'
  | 'travel'
  | 'other';

export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface CoupleEntity extends BaseEntity {
  name: string | null;
}

export interface ReceiptEntity extends BaseEntity {
  couple_id: string;
  created_by: string;
  title: string;
  event_date: Date;
  category: ReceiptCategoryType;
  image_url: string;
  thumb_url: string | null;
  amount: number | null;
  notes: string | null;
}

export interface ScrapbookEntity extends BaseEntity {
  couple_id: string;
  title: string;
  event_date: Date;
  bg_color: string;
  canvas_json: Record<string, unknown>;
  thumbnail_url: string | null;
}

export interface OnThisDayItem {
  type: 'receipt' | 'scrapbook';
  id: string;
  title: string;
  event_date: string; // YYYY-MM-DD
  years_ago: number;
  thumbnail_url: string | null;
  category?: ReceiptCategoryType;
  notes?: string | null;
}

export interface OnThisDayResponse {
  date: string;
  items: OnThisDayItem[];
}
