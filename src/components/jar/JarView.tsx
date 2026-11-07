import React, { useState } from 'react';
import { Plus, Sparkles, Inbox, Heart } from 'lucide-react';
import { useReceipts } from '../../hooks/useReceipts';
import { useAppStore } from '../../store/useAppStore';
import type { Receipt } from '../../types';
import { ReceiptCard } from './ReceiptCard';
import { FilterBar } from './FilterBar';
import { AddReceiptModal } from './AddReceiptModal';
import { ReceiptViewModal } from './ReceiptViewModal';
import { NeoButton } from '../common/NeoButton';

export const JarView: React.FC = () => {
  const { selectedCategory, searchQuery, setCurrentTab } = useAppStore();
  const { receipts, totalCount, onThisDayReceipts, addReceipt, deleteReceipt, toggleFavorite } =
    useReceipts(selectedCategory, searchQuery);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<Receipt | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Banner: The Receipt Jar Concept */}
      <div className="relative bg-neoYellow border-3 border-neoDark shadow-neo p-5 sm:p-7 overflow-hidden">
        {/* Background decorative stamps */}
        <div className="absolute right-4 top-2 text-7xl select-none opacity-20 pointer-events-none transform rotate-12">
          🏺
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-neoDark text-xs font-black uppercase mb-3 shadow-neo-sm">
            <Sparkles size={14} className="text-neoPink" />
            Toples Kenangan Berdua
          </div>
          <h1 className="font-grotesk font-black text-2xl sm:text-4xl text-neoDark uppercase tracking-tight">
            The Receipt Jar
          </h1>
          <p className="font-medium text-sm sm:text-base text-neoDark/90 mt-1.5 max-w-xl">
            Simpan karcis bioskop, boarding pass tiket kereta, dan struk kencan sebelum tintanya memudar termakan waktu.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <NeoButton
              variant="dark"
              size="md"
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs sm:text-sm"
            >
              <Plus size={16} />
              + Masukkan Karcis Baru
            </NeoButton>

            {onThisDayReceipts.length > 0 && (
              <NeoButton
                variant="pink"
                size="md"
                onClick={() => setCurrentTab('flashback')}
                className="text-xs sm:text-sm animate-bounce"
              >
                <Heart size={16} />
                {onThisDayReceipts.length} Flashback Hari Ini!
              </NeoButton>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar totalCount={totalCount} />

      {/* Receipts Grid */}
      {receipts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {receipts.map((receipt) => (
            <ReceiptCard
              key={receipt.id}
              receipt={receipt}
              onDelete={deleteReceipt}
              onToggleFavorite={toggleFavorite}
              onViewImage={setViewingReceipt}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border-3 border-neoDark shadow-neo flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 bg-neoYellow border-3 border-neoDark flex items-center justify-center text-3xl shadow-neo-sm">
            <Inbox size={32} />
          </div>
          <h3 className="font-grotesk font-black text-lg text-neoDark uppercase">
            {searchQuery || selectedCategory !== 'Semua'
              ? 'Tidak ada karcis yang cocok'
              : 'Toples Kenangan Masih Kosong'}
          </h3>
          <p className="text-sm text-gray-600 max-w-md font-grotesk">
            {searchQuery || selectedCategory !== 'Semua'
              ? 'Coba ganti kata kunci pencarian atau pilih kategori lain.'
              : 'Mulai masukkan karcis bioskop kencan pertama atau struk makan siang favorit kalian berdua!'}
          </p>
          <NeoButton
            variant="yellow"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-2"
          >
            <Plus size={16} />
            Tambah Karcis Pertama
          </NeoButton>
        </div>
      )}

      {/* Add Modal */}
      <AddReceiptModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addReceipt}
      />

      {/* Image / Ticket Lightbox View Modal */}
      <ReceiptViewModal
        receipt={viewingReceipt}
        onClose={() => setViewingReceipt(null)}
      />
    </div>
  );
};
