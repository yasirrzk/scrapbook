export type ReceiptCategory = 'Kuliner' | 'Transport' | 'Bioskop' | 'Liburan' | 'Lainnya';

export interface Receipt {
  id?: number;
  title: string;
  category: ReceiptCategory;
  date: string; 
  amount?: number;
  location?: string;
  notes?: string;
  imageUrl: string;
  favorite?: boolean;
  createdAt: number;
}

export interface ScrapbookCollage {
  id?: number;
  title: string;
  canvasJSON: string;
  previewUrl: string; 
  date: string; 
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
