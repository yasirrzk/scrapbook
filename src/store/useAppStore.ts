import { create } from 'zustand';
import type { Receipt, ReceiptCategory } from '../types';

export type AppTab = 'jar' | 'canvas' | 'flashback' | 'gallery';

interface AppState {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  selectedReceiptForCanvas: Receipt | null;
  setSelectedReceiptForCanvas: (receipt: Receipt | null) => void;
  selectedCategory: ReceiptCategory | 'Semua';
  setSelectedCategory: (cat: ReceiptCategory | 'Semua') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  deferredPrompt: any;
  setDeferredPrompt: (prompt: any) => void;
  isInstallable: boolean;
  setIsInstallable: (installable: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentTab: 'jar',
  setCurrentTab: (tab) => set({ currentTab: tab }),
  selectedReceiptForCanvas: null,
  setSelectedReceiptForCanvas: (receipt) => set({ selectedReceiptForCanvas: receipt }),
  selectedCategory: 'Semua',
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  deferredPrompt: null,
  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt, isInstallable: !!prompt }),
  isInstallable: false,
  setIsInstallable: (installable) => set({ isInstallable: installable }),
}));
