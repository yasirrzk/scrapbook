import React from 'react';
import { Calendar, Sparkles, Heart, Palette, Clock } from 'lucide-react';
import { useReceipts } from '../../hooks/useReceipts';
import { useAppStore } from '../../store/useAppStore';
import { NeoBadge } from '../common/NeoBadge';
import { NeoButton } from '../common/NeoButton';

export const FlashbackView: React.FC = () => {
  const { onThisDayReceipts, allReceipts } = useReceipts();
  const { setCurrentTab, setSelectedReceiptForCanvas } = useAppStore();

  const today = new Date();
  const dateFormatted = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
  }).format(today);

  const calculateYearsAgo = (dateStr: string) => {
    const year = parseInt(dateStr.split('-')[0], 10);
    const diff = today.getFullYear() - year;
    return diff > 0 ? `${diff} Tahun yang Lalu` : 'Hari Ini';
  };

  const handleUseOnCanvas = (receipt: any) => {
    setSelectedReceiptForCanvas(receipt);
    setCurrentTab('canvas');
  };

  return (
    <div className="space-y-6">
      {/* Flashback Header */}
      <div className="bg-neoPink text-white border-3 border-neoDark shadow-neo p-5 sm:p-7 relative overflow-hidden">
        <div className="absolute right-4 top-2 text-7xl select-none opacity-20 pointer-events-none transform -rotate-12">
          ⏳
        </div>
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-neoDark border-2 border-neoDark text-xs font-black uppercase mb-3 shadow-neo-sm">
            <Sparkles size={14} className="text-neoPink" />
            Mesin Waktu Kenangan
          </div>
          <h1 className="font-grotesk font-black text-2xl sm:text-4xl uppercase tracking-tight">
            "On This Day" Flashback
          </h1>
          <p className="font-medium text-sm sm:text-base mt-1.5 text-white/95">
            Mengenang kembali momen-momen manis yang terjadi tepat di tanggal ini pada tahun-tahun sebelumnya.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-neoDark text-white px-3 py-1.5 border-2 border-white text-xs font-bold font-grotesk">
            <Calendar size={14} />
            {dateFormatted}
          </div>
        </div>
      </div>

      {/* Memory Cards */}
      {onThisDayReceipts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {onThisDayReceipts.map((receipt) => {
            const yearsAgo = calculateYearsAgo(receipt.date);
            return (
              <div
                key={receipt.id}
                className="bg-[#FAF6F0] border-3 border-neoDark shadow-neo-lg p-5 flex flex-col justify-between relative transform hover:-translate-y-1 transition-transform"
              >
                {/* Years badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neoYellow border-2 border-neoDark font-grotesk font-black text-xs uppercase shadow-neo-sm">
                    <Clock size={13} />
                    {yearsAgo}
                  </div>
                  <NeoBadge category={receipt.category} />
                </div>

                <h3 className="font-grotesk font-black text-xl text-neoDark mb-1">
                  {receipt.title}
                </h3>
                <p className="font-bold text-xs text-neoDark/70 mb-3 flex items-center gap-2 font-grotesk">
                  <span>📅 {receipt.date}</span>
                  {receipt.location && <span>• 📍 {receipt.location}</span>}
                </p>

                {/* Struk Image */}
                <div className="border-2 border-neoDark bg-white p-2 mb-3 max-h-56 flex items-center justify-center overflow-hidden">
                  <img
                    src={receipt.imageUrl}
                    alt={receipt.title}
                    className="max-h-52 object-contain"
                  />
                </div>

                {/* Handwritten memory note */}
                {receipt.notes && (
                  <div className="p-3 bg-[#F3ECE1] border-2 border-dashed border-neoDark mb-4">
                    <p className="font-handwriting text-xl text-neoDark leading-snug">
                      "{receipt.notes}"
                    </p>
                  </div>
                )}

                {/* Button to collage */}
                <NeoButton
                  variant="yellow"
                  size="md"
                  onClick={() => handleUseOnCanvas(receipt)}
                  className="w-full"
                >
                  <Palette size={16} />
                  Buat Kolase Ulang Tahun Kenangan Ini 
                </NeoButton>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border-3 border-neoDark shadow-neo p-8 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-neoPurple text-white border-3 border-neoDark flex items-center justify-center text-3xl shadow-neo-sm">
            <Heart size={32} />
          </div>
          <h3 className="font-grotesk font-black text-lg text-neoDark uppercase">
            Belum Ada Flashback Untuk Tanggal Hari Ini
          </h3>
          <p className="font-grotesk text-sm text-neoDark/70 max-w-md">
            Hari ini belum ada catatan karcis dari tahun lalu ({today.getDate()}{' '}
            {today.toLocaleString('id-ID', { month: 'long' })}). Terus kumpulkan karcis kencan
            kalian sekarang, agar tahun depan kartu kenangan ini muncul!
          </p>

          <NeoButton variant="yellow" onClick={() => setCurrentTab('jar')}>
            Lihat Semua Karcis di Toples ({allReceipts.length})
          </NeoButton>
        </div>
      )}
    </div>
  );
};
