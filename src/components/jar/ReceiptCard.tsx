import React from 'react';
import { Heart, Trash2, Palette, MapPin, Calendar, DollarSign } from 'lucide-react';
import type { Receipt } from '../../types';
import { NeoBadge } from '../common/NeoBadge';
import { NeoButton } from '../common/NeoButton';
import { useAppStore } from '../../store/useAppStore';

interface ReceiptCardProps {
  receipt: Receipt;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number, current?: boolean) => void;
  onViewImage: (receipt: Receipt) => void;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({
  receipt,
  onDelete,
  onToggleFavorite,
  onViewImage,
}) => {
  const { setCurrentTab, setSelectedReceiptForCanvas } = useAppStore();

  const handleUseOnCanvas = () => {
    setSelectedReceiptForCanvas(receipt);
    setCurrentTab('canvas');
  };

  const formattedAmount = receipt.amount
    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
        receipt.amount
      )
    : null;

  return (
    <div className="group relative bg-[#FFFDF5] border-3 border-neoDark shadow-neo hover:shadow-neo-lg transition-all duration-150 flex flex-col justify-between overflow-hidden">
      {/* Decorative top washi tape aesthetic */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-neoYellow border-x-2 border-b-2 border-neoDark opacity-90 transform -rotate-1 z-10 pointer-events-none" />

      {/* Header / Badges */}
      <div className="p-4 pb-2 pt-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <NeoBadge category={receipt.category} />
          <button
            onClick={() => receipt.id && onToggleFavorite(receipt.id, receipt.favorite)}
            className={`p-1.5 border-2 border-neoDark transition-transform active:scale-90 ${
              receipt.favorite ? 'bg-neoPink text-white' : 'bg-white text-neoDark hover:bg-red-50'
            }`}
            title="Sukai kenangan ini"
          >
            <Heart size={16} fill={receipt.favorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <h3 className="font-grotesk font-extrabold text-lg leading-tight text-neoDark line-clamp-2">
          {receipt.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs font-bold text-gray-700">
          <span className="flex items-center gap-1">
            <Calendar size={13} className="text-neoDark" />
            {receipt.date}
          </span>
          {receipt.location && (
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-neoDark" />
              {receipt.location}
            </span>
          )}
        </div>
      </div>

      {/* Receipt Image / Ticket Preview */}
      <div
        onClick={() => onViewImage(receipt)}
        className="mx-4 my-2 relative border-2 border-neoDark bg-white cursor-pointer overflow-hidden group/img aspect-[4/3] flex items-center justify-center bg-dots"
      >
        <img
          src={receipt.imageUrl}
          alt={receipt.title}
          className="w-full h-full object-contain p-2 group-hover/img:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-neoDark/0 group-hover/img:bg-neoDark/20 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover/img:opacity-100 bg-neoYellow border-2 border-neoDark text-neoDark text-xs font-black px-2 py-1 shadow-neo-sm transform -rotate-2 transition-opacity">
            Lihat Struk 🔍
          </span>
        </div>
      </div>

      {/* Amount & Handwritten Note */}
      <div className="p-4 pt-1 flex-1 flex flex-col justify-between">
        {formattedAmount && (
          <div className="inline-flex items-center gap-1 text-xs font-black font-grotesk bg-neoGreen/30 px-2 py-1 border border-neoDark w-fit mb-2">
            <DollarSign size={13} />
            {formattedAmount}
          </div>
        )}

        {receipt.notes && (
          <div className="bg-[#FFF8E7] p-2.5 border-2 border-dashed border-neoDark/60 mb-3">
            <p className="font-handwriting text-lg text-neoDark leading-snug">
              "{receipt.notes}"
            </p>
          </div>
        )}

        {/* Card Actions */}
        <div className="pt-3 border-t-2 border-neoDark flex items-center gap-2 mt-auto">
          <NeoButton
            variant="yellow"
            size="sm"
            onClick={handleUseOnCanvas}
            className="flex-1 text-xs"
            title="Tempel struk ini ke kanvas scrapbook"
          >
            <Palette size={14} />
            Tempel ke Kanvas
          </NeoButton>

          <button
            onClick={() => receipt.id && onDelete(receipt.id)}
            className="p-2 border-2 border-neoDark bg-white hover:bg-red-500 hover:text-white text-neoDark transition-colors"
            title="Hapus struk"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
