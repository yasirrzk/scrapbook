import React from 'react';
import { X, Calendar, MapPin, Tag, Heart } from 'lucide-react';
import type { Receipt } from '../../types';
import { NeoBadge } from '../common/NeoBadge';
import { NeoButton } from '../common/NeoButton';
import { useAppStore } from '../../store/useAppStore';

interface ReceiptViewModalProps {
  receipt: Receipt | null;
  onClose: () => void;
}

export const ReceiptViewModal: React.FC<ReceiptViewModalProps> = ({ receipt, onClose }) => {
  const { setCurrentTab, setSelectedReceiptForCanvas } = useAppStore();

  if (!receipt) return null;

  const handleUseOnCanvas = () => {
    setSelectedReceiptForCanvas(receipt);
    setCurrentTab('canvas');
    onClose();
  };

  const formattedAmount = receipt.amount
    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
        receipt.amount
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-neoDark/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FFFDF5] border-3 border-neoDark shadow-neo-xl my-6">
        {/* Header */}
        <div className="bg-neoYellow border-b-3 border-neoDark p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NeoBadge category={receipt.category} />
            <h2 className="font-grotesk font-black text-base sm:text-lg text-neoDark truncate">
              {receipt.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-neoDark bg-white hover:bg-neoPink hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Main Image Display */}
          <div className="bg-white border-3 border-neoDark p-3 flex items-center justify-center max-h-96 overflow-hidden">
            <img
              src={receipt.imageUrl}
              alt={receipt.title}
              className="max-h-80 w-auto object-contain mx-auto"
            />
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-xs font-grotesk">
            <div className="p-3 bg-white border-2 border-neoDark">
              <span className="text-gray-500 font-bold block mb-1 flex items-center gap-1">
                <Calendar size={13} /> Tanggal
              </span>
              <span className="font-black text-sm text-neoDark">{receipt.date}</span>
            </div>

            <div className="p-3 bg-white border-2 border-neoDark">
              <span className="text-gray-500 font-bold block mb-1 flex items-center gap-1">
                <Tag size={13} /> Total Nominal
              </span>
              <span className="font-black text-sm text-neoDark">{formattedAmount || '-'}</span>
            </div>

            {receipt.location && (
              <div className="col-span-2 p-3 bg-white border-2 border-neoDark">
                <span className="text-gray-500 font-bold block mb-1 flex items-center gap-1">
                  <MapPin size={13} /> Lokasi
                </span>
                <span className="font-bold text-sm text-neoDark">{receipt.location}</span>
              </div>
            )}
          </div>

          {/* Handwritten Notes */}
          {receipt.notes && (
            <div className="p-4 bg-[#FFF8E7] border-3 border-neoDark transform -rotate-0.5">
              <span className="font-grotesk font-black text-xs uppercase text-neoDark block mb-1">
                Catatan Berdua ✍️
              </span>
              <p className="font-handwriting text-2xl text-neoDark leading-relaxed">
                "{receipt.notes}"
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-neoDark">
            <NeoButton variant="white" onClick={onClose}>
              Tutup
            </NeoButton>
            <NeoButton variant="pink" onClick={handleUseOnCanvas}>
              Tempel ke Scrapbook 🎨
            </NeoButton>
          </div>
        </div>
      </div>
    </div>
  );
};
