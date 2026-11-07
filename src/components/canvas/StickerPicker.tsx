import React from 'react';
import { X, Sparkles } from 'lucide-react';

export interface StickerOption {
  id: string;
  name: string;
  type: 'tape' | 'stamp' | 'doodle';
  url: string;
}

export const STICKERS_CATALOG: StickerOption[] = [
  // Washi Tapes
  { id: 'tape-yellow', name: 'Washi Kuning Stripe', type: 'tape', url: '/stickers/tape-yellow.svg' },
  { id: 'tape-pink', name: 'Washi Pink Polka', type: 'tape', url: '/stickers/tape-pink.svg' },
  { id: 'tape-green', name: 'Washi Hijau Stitch', type: 'tape', url: '/stickers/tape-green.svg' },

  // Stamps
  { id: 'stamp-love', name: 'Perangko Forever', type: 'stamp', url: '/stickers/stamp-love.svg' },
  { id: 'stamp-date', name: 'Cap Pos Date', type: 'stamp', url: '/stickers/stamp-date.svg' },

  // Doodles & Badges
  { id: 'sticker-heart', name: 'Heart Pop', type: 'doodle', url: '/stickers/sticker-heart.svg' },
  { id: 'sticker-star', name: 'Retro Star', type: 'doodle', url: '/stickers/sticker-star.svg' },
  { id: 'sticker-camera', name: 'Kamera Retro', type: 'doodle', url: '/stickers/sticker-camera.svg' },
  { id: 'sticker-ticket', name: 'Tiket Admit 2', type: 'doodle', url: '/stickers/sticker-ticket.svg' },
  { id: 'sticker-flower', name: 'Daisy Flower', type: 'doodle', url: '/stickers/sticker-flower.svg' },
  { id: 'sticker-pin', name: 'Push Pin', type: 'doodle', url: '/stickers/sticker-pin.svg' },
];

interface StickerPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSticker: (sticker: StickerOption) => void;
}

export const StickerPicker: React.FC<StickerPickerProps> = ({
  isOpen,
  onClose,
  onSelectSticker,
}) => {
  const [activeTab, setActiveTab] = React.useState<'all' | 'tape' | 'stamp' | 'doodle'>('all');

  if (!isOpen) return null;

  const filteredStickers =
    activeTab === 'all'
      ? STICKERS_CATALOG
      : STICKERS_CATALOG.filter((s) => s.type === activeTab);

  return (
    <div className="fixed inset-0 z-50 bg-neoDark/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FFFDF5] border-3 border-neoDark shadow-neo-xl w-full max-w-lg my-6">
        {/* Header */}
        <div className="bg-neoYellow border-b-3 border-neoDark p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-neoDark" />
            <h3 className="font-grotesk font-black text-base uppercase text-neoDark">
              Pilih Stiker & Washi Tape
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-neoDark bg-white hover:bg-neoPink hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b-2 border-neoDark bg-white">
          {(['all', 'tape', 'stamp', 'doodle'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-grotesk font-black uppercase transition-all ${
                activeTab === tab
                  ? 'bg-neoPurple text-white'
                  : 'text-neoDark hover:bg-gray-100'
              }`}
            >
              {tab === 'all' && 'Semua'}
              {tab === 'tape' && 'Selotip'}
              {tab === 'stamp' && 'Perangko'}
              {tab === 'doodle' && 'Stiker'}
            </button>
          ))}
        </div>

        {/* Sticker Grid */}
        <div className="p-4 grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto">
          {filteredStickers.map((sticker) => (
            <button
              key={sticker.id}
              onClick={() => {
                onSelectSticker(sticker);
                onClose();
              }}
              className="p-3 bg-white border-2 border-neoDark hover:bg-yellow-50 hover:border-neoPink shadow-neo-sm hover:shadow-neo transition-all flex flex-col items-center justify-center gap-2 aspect-square group cursor-pointer"
            >
              <img
                src={sticker.url}
                alt={sticker.name}
                className="max-h-14 max-w-full object-contain group-hover:scale-110 transition-transform"
              />
              <span className="text-[10px] font-grotesk font-bold text-neoDark text-center line-clamp-1">
                {sticker.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
