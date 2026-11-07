import React from 'react';
import { Search, X } from 'lucide-react';
import type { ReceiptCategory } from '../../types';
import { useAppStore } from '../../store/useAppStore';

const CATEGORIES: (ReceiptCategory | 'Semua')[] = [
  'Semua',
  'Kuliner',
  'Transport',
  'Bioskop',
  'Liburan',
  'Lainnya',
];

interface FilterBarProps {
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ totalCount }) => {
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useAppStore();

  return (
    <div className="space-y-3 mb-6">
      {/* Search Input & Total count */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari karcis, bioskop, nama cafe, lokasi..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border-3 border-neoDark shadow-neo-sm focus:shadow-neo focus:outline-none font-grotesk text-sm font-semibold"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neoDark" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-2 bg-neoPurple text-white font-grotesk font-black text-xs uppercase border-3 border-neoDark shadow-neo-sm self-start sm:self-auto">
          <span>Total Karcis:</span>
          <span className="bg-neoYellow text-neoDark px-2 py-0.5 border border-neoDark">
            {totalCount}
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-grotesk font-bold border-2 border-neoDark transition-all whitespace-nowrap cursor-pointer uppercase ${
                isActive
                  ? 'bg-neoYellow text-neoDark shadow-neo-sm translate-x-[1px] translate-y-[1px]'
                  : 'bg-white text-neoDark hover:bg-[#FFF8E7]'
              }`}
            >
              {cat === 'Semua' && '🌟 '}
              {cat === 'Kuliner' && '🍔 '}
              {cat === 'Transport' && '✈️ '}
              {cat === 'Bioskop' && '🎬 '}
              {cat === 'Liburan' && '🏖️ '}
              {cat === 'Lainnya' && '✨ '}
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
