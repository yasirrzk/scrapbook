import Dexie, { type Table } from 'dexie';
import type { Receipt, ScrapbookCollage } from '../types';

export class ScrapbookDB extends Dexie {
  receipts!: Table<Receipt, number>;
  collages!: Table<ScrapbookCollage, number>;

  constructor() {
    super('ScrapbookReceiptJarDB');
    this.version(1).stores({
      receipts: '++id, title, category, date, favorite, createdAt',
      collages: '++id, title, date, createdAt, updatedAt',
    });
  }
}

export const db = new ScrapbookDB();

// Sample initial receipts to get started if empty
export async function seedSampleDataIfEmpty() {
  const count = await db.receipts.count();
  if (count > 0) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  // Let's create a date from last year for "On This Day" showcase!
  const lastYearDate = `${year - 1}-${month}-${day}`;
  const thisMonthDate = `${year}-${month}-${Math.max(1, today.getDate() - 2).toString().padStart(2, '0')}`;

  // Cute SVG data URLs for sample receipt tickets
  const cinemaReceiptSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%23FAF6F0"/><rect x="15" y="15" width="270" height="390" fill="none" stroke="%23221F1B" stroke-width="2.5" stroke-dasharray="6,4"/><text x="150" y="55" font-family="'Space Grotesk', monospace" font-weight="900" font-size="18" text-anchor="middle" fill="%23221F1B">★ CINEPOLIS CINEMA ★</text><line x1="25" y1="75" x2="275" y2="75" stroke="%23221F1B" stroke-width="2"/><text x="150" y="115" font-family="'Space Grotesk', monospace" font-size="14" text-anchor="middle" fill="%23221F1B">FILM: LA LA LAND</text><text x="150" y="145" font-family="'Space Grotesk', monospace" font-size="13" text-anchor="middle" fill="%23221F1B">STUDIO 1 • SEAT E11, E12</text><text x="150" y="175" font-family="'Space Grotesk', monospace" font-size="12" text-anchor="middle" fill="%23555555">${lastYearDate} • 19:30 WIB</text><rect x="50" y="210" width="200" height="60" fill="%23EAC875" stroke="%23221F1B" stroke-width="2"/><text x="150" y="245" font-family="'Space Grotesk', monospace" font-weight="bold" font-size="15" text-anchor="middle" fill="%23221F1B">TOTAL: Rp 110.000</text><line x1="25" y1="300" x2="275" y2="300" stroke="%23221F1B" stroke-width="2" stroke-dasharray="4,4"/><text x="150" y="340" font-family="'Caveat', cursive" font-size="24" text-anchor="middle" fill="%23D87D88">Kencan pertama kita! ❤️</text><text x="150" y="380" font-family="'Space Grotesk', monospace" font-size="10" text-anchor="middle" fill="%23888888">BARCODE: ||||| | |||| ||| ||||</text></svg>`;

  const cafeReceiptSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%23FAF6F0"/><rect x="15" y="15" width="270" height="390" fill="none" stroke="%23221F1B" stroke-width="2.5"/><text x="150" y="55" font-family="'Space Grotesk', monospace" font-weight="bold" font-size="18" text-anchor="middle" fill="%23221F1B">KOPI KENANGAN BERDUA</text><line x1="25" y1="75" x2="275" y2="75" stroke="%23221F1B" stroke-width="2"/><text x="40" y="115" font-family="'Space Grotesk', monospace" font-size="13" fill="%23221F1B">2x Caramel Macchiato</text><text x="260" y="115" font-family="'Space Grotesk', monospace" font-size="13" text-anchor="end" fill="%23221F1B">56.000</text><text x="40" y="145" font-family="'Space Grotesk', monospace" font-size="13" fill="%23221F1B">1x Croissant Butter</text><text x="260" y="145" font-family="'Space Grotesk', monospace" font-size="13" text-anchor="end" fill="%23221F1B">28.000</text><line x1="40" y1="170" x2="260" y2="170" stroke="%23221F1B" stroke-width="1.5"/><text x="40" y="200" font-family="'Space Grotesk', monospace" font-weight="bold" font-size="15" fill="%23221F1B">TOTAL Rp</text><text x="260" y="200" font-family="'Space Grotesk', monospace" font-weight="bold" font-size="15" text-anchor="end" fill="%23221F1B">84.000</text><rect x="35" y="235" width="230" height="70" fill="%239C8EB9" fill-opacity="0.25" stroke="%23221F1B" stroke-width="2"/><text x="150" y="275" font-family="'Caveat', cursive" font-size="22" text-anchor="middle" fill="%23221F1B">Ngobrol sampai sore ✨</text><text x="150" y="350" font-family="'Space Grotesk', monospace" font-size="12" text-anchor="middle" fill="%23777777">${thisMonthDate} • Bandung</text></svg>`;

  const trainTicketSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%23FAF6F0"/><rect x="15" y="15" width="270" height="390" fill="none" stroke="%23221F1B" stroke-width="2.5"/><rect x="25" y="25" width="250" height="40" fill="%238EA48B" stroke="%23221F1B" stroke-width="2"/><text x="150" y="52" font-family="'Space Grotesk', monospace" font-weight="900" font-size="15" text-anchor="middle" fill="%23FFFFFF">BOARDING PASS KERETA</text><text x="150" y="105" font-family="'Space Grotesk', monospace" font-weight="bold" font-size="13" text-anchor="middle" fill="%23221F1B">GAMBIR (GMR) ➔ YOGYAKARTA (YK)</text><text x="150" y="135" font-family="'Space Grotesk', monospace" font-size="13" text-anchor="middle" fill="%23555555">KA ARGO DWIPANGGA</text><text x="150" y="165" font-family="'Space Grotesk', monospace" font-size="12" text-anchor="middle" fill="%23555555">EKS-2 / 10A, 10B</text><line x1="30" y1="190" x2="270" y2="190" stroke="%23221F1B" stroke-width="2" stroke-dasharray="5,3"/><text x="150" y="230" font-family="'Caveat', cursive" font-size="24" text-anchor="middle" fill="%23D87D88">Liburan pertama kita ke Jogja! 🎒</text><rect x="40" y="270" width="220" height="45" fill="%23EAC875" stroke="%23221F1B" stroke-width="2"/><text x="150" y="298" font-family="'Space Grotesk', monospace" font-weight="bold" font-size="14" text-anchor="middle" fill="%23221F1B">Rp 760.000 (2 Pax)</text><text x="150" y="360" font-family="'Space Grotesk', monospace" font-size="12" text-anchor="middle" fill="%23888888">Date: ${lastYearDate}</text></svg>`;

  await db.receipts.bulkAdd([
    {
      title: 'Tiket Nonton La La Land',
      category: 'Bioskop',
      date: lastYearDate,
      amount: 110000,
      location: 'Cinepolis Mall',
      notes: 'Kencan pertama kita! Kamu nangis di ending film haha.',
      imageUrl: cinemaReceiptSvg,
      favorite: true,
      createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    },
    {
      title: 'Kopi Kenangan Berdua',
      category: 'Kuliner',
      date: thisMonthDate,
      amount: 84000,
      location: 'Kopi Kenangan Dago',
      notes: 'Ngobrol berjam-jam tentang rencana masa depan.',
      imageUrl: cafeReceiptSvg,
      favorite: true,
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      title: 'Tiket Kereta Liburan Jogja',
      category: 'Liburan',
      date: lastYearDate,
      amount: 760000,
      location: 'Stasiun Gambir',
      notes: 'Perjalanan kereta malam seru sambil dengerin lagu bareng.',
      imageUrl: trainTicketSvg,
      favorite: false,
      createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    },
  ]);
}
