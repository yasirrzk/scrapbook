import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { Receipt, ReceiptCategory } from '../types';

export function useReceipts(selectedCategory: ReceiptCategory | 'Semua' = 'Semua', searchQuery: string = '') {
  const allReceipts = useLiveQuery(() => db.receipts.orderBy('date').reverse().toArray(), []) || [];

  const filteredReceipts = allReceipts.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.location && item.location.toLowerCase().includes(q)) ||
      (item.notes && item.notes.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Calculate "On This Day" (same month and day, but different year, or today's date in history)
  const today = new Date();
  const currentMonthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const currentYear = today.getFullYear();

  const onThisDayReceipts = allReceipts.filter((item) => {
    if (!item.date) return false;
    const parts = item.date.split('-');
    if (parts.length !== 3) return false;
    const itemYear = parseInt(parts[0], 10);
    const itemMonthDay = `${parts[1]}-${parts[2]}`;
    return itemMonthDay === currentMonthDay && itemYear < currentYear;
  });

  const addReceipt = async (receipt: Omit<Receipt, 'id' | 'createdAt'>) => {
    return await db.receipts.add({
      ...receipt,
      createdAt: Date.now(),
    });
  };

  const updateReceipt = async (id: number, changes: Partial<Receipt>) => {
    return await db.receipts.update(id, changes);
  };

  const deleteReceipt = async (id: number) => {
    return await db.receipts.delete(id);
  };

  const toggleFavorite = async (id: number, currentFavorite?: boolean) => {
    return await db.receipts.update(id, { favorite: !currentFavorite });
  };

  return {
    receipts: filteredReceipts,
    allReceipts,
    onThisDayReceipts,
    addReceipt,
    updateReceipt,
    deleteReceipt,
    toggleFavorite,
    totalCount: allReceipts.length,
  };
}
