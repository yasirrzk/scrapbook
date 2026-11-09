import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { Palette, Trash2, Download, Calendar, Plus } from 'lucide-react';
import { NeoButton } from '../common/NeoButton';
import { useAppStore } from '../../store/useAppStore';
import type { ScrapbookCollage } from '../../types';

interface CollageGalleryViewProps {
  onLoadCollageToCanvas: (collage: ScrapbookCollage) => void;
}

export const CollageGalleryView: React.FC<CollageGalleryViewProps> = ({
  onLoadCollageToCanvas,
}) => {
  const { setCurrentTab } = useAppStore();
  const collages = useLiveQuery(() => db.collages.orderBy('createdAt').reverse().toArray()) || [];

  const handleDelete = async (id: number) => {
    if (confirm('Hapus kolase ini dari galeri?')) {
      await db.collages.delete(id);
    }
  };

  const handleDownload = (collage: ScrapbookCollage) => {
    const link = document.createElement('a');
    link.download = `${collage.title.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = collage.previewUrl;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-neoGreen border-3 border-neoDark shadow-neo p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-grotesk font-black text-2xl sm:text-3xl uppercase tracking-tight text-neoDark">
            Galeri Kolase Scrapbook 
          </h1>
          <p className="font-grotesk font-medium text-sm text-neoDark/90 mt-1">
            Kumpulan kreasi kolase digital hasil karya kalian berdua.
          </p>
        </div>
        <NeoButton
          variant="yellow"
          onClick={() => setCurrentTab('canvas')}
          className="whitespace-nowrap"
        >
          <Plus size={16} />
          Bikin Kolase Baru
        </NeoButton>
      </div>

      {/* Grid */}
      {collages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collages.map((col) => (
            <div
              key={col.id}
              className="bg-white border-3 border-neoDark shadow-neo hover:shadow-neo-lg transition-all flex flex-col justify-between"
            >
              <div className="p-3 border-b-2 border-neoDark bg-[#F5EFE3] flex items-center justify-between">
                <h3 className="font-grotesk font-black text-sm text-neoDark truncate">
                  {col.title}
                </h3>
                <span className="text-[11px] font-bold text-neoDark/70 font-grotesk flex items-center gap-1">
                  <Calendar size={12} /> {col.date}
                </span>
              </div>

              {/* Preview */}
              <div className="p-3 bg-[#FAF6F0] aspect-[4/3] flex items-center justify-center overflow-hidden">
                <img
                  src={col.previewUrl}
                  alt={col.title}
                  className="max-h-full max-w-full object-contain border border-neoDark shadow-neo-sm"
                />
              </div>

              {/* Actions */}
              <div className="p-3 border-t-2 border-neoDark bg-white flex items-center gap-2">
                <NeoButton
                  variant="yellow"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => onLoadCollageToCanvas(col)}
                >
                  <Palette size={14} /> Buka di Kanvas
                </NeoButton>

                <button
                  onClick={() => handleDownload(col)}
                  className="p-2 border-2 border-neoDark bg-white hover:bg-neoBlue text-neoDark transition-colors"
                  title="Unduh PNG"
                >
                  <Download size={14} />
                </button>

                <button
                  onClick={() => col.id && handleDelete(col.id)}
                  className="p-2 border-2 border-neoDark bg-white hover:bg-neoPink hover:text-white text-neoDark transition-colors"
                  title="Hapus Kolase"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-3 border-neoDark shadow-neo p-10 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 bg-neoYellow border-3 border-neoDark flex items-center justify-center text-2xl shadow-neo-sm">
            
          </div>
          <h3 className="font-grotesk font-black text-lg text-neoDark uppercase">
            Belum Ada Kolase yang Disimpan
          </h3>
          <p className="font-grotesk text-sm text-neoDark/70 max-w-md">
            Rangkai karcis, stiker selotip washi tape, dan coretan tulisan tanganmu di kanvas, lalu simpan ke galeri ini!
          </p>
          <NeoButton
            variant="yellow"
            onClick={() => setCurrentTab('canvas')}
            className="mt-2"
          >
            Mulai Bikin Kolase Sekarang
          </NeoButton>
        </div>
      )}
    </div>
  );
};
