export type ReceiptCategory = 'Kuliner' | 'Transport' | 'Bioskop' | 'Liburan' | 'Lainnya';

export interface Receipt {
  id?: number;
  title: string;
  category: ReceiptCategory;
  date: string; // YYYY-MM-DD
  amount?: number;
  location?: string;
  notes?: string;
  imageUrl: string; // base64 or object URL
  favorite?: boolean;
  createdAt: number;
}

export interface ScrapbookCollage {
  id?: number;
  title: string;
  canvasJSON: string; // Fabric canvas serialized JSON
  previewUrl: string; // Data URL for gallery thumbnail
  date: string; // Associated date (YYYY-MM-DD)
  createdAt: number;
  updatedAt: number;
}

export interface StickerItem {
  id: string;
  name: string;
  category: 'tape' | 'stamp' | 'doodle' | 'badge';
  url: string;
  width?: number;
  height?: number;
}
