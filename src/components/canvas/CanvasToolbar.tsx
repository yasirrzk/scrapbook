import React, { useRef } from 'react';
import {
  MousePointer,
  PenTool,
  Type,
  Sticker,
  Image as ImageIcon,
  Receipt as ReceiptIcon,
  Layers,
  Trash2,
  Download,
  Save,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { NeoButton } from '../common/NeoButton';
import confetti from 'canvas-confetti';

interface CanvasToolbarProps {
  isDrawing: boolean;
  onToggleDrawing: (enabled: boolean) => void;
  brushColor: string;
  onSelectBrushColor: (color: string) => void;
  brushWidth: number;
  onSelectBrushWidth: (width: number) => void;
  onAddText: (type: 'grotesk' | 'handwriting') => void;
  onOpenStickerPicker: () => void;
  onOpenReceiptPicker: () => void;
  onUploadImage: (file: File) => void;
  hasSelection: boolean;
  onDeleteSelected: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onClear: () => void;
  onSave: () => void;
  onExportPNG: () => void;
}

const BRUSH_COLORS = [
  { name: 'Dark', hex: '#121212' },
  { name: 'Pink', hex: '#FF6584' },
  { name: 'Yellow', hex: '#FFE600' },
  { name: 'Green', hex: '#00E599' },
  { name: 'Purple', hex: '#A388EE' },
  { name: 'Blue', hex: '#58C4DC' },
];

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  isDrawing,
  onToggleDrawing,
  brushColor,
  onSelectBrushColor,
  brushWidth,
  onSelectBrushWidth,
  onAddText,
  onOpenStickerPicker,
  onOpenReceiptPicker,
  onUploadImage,
  hasSelection,
  onDeleteSelected,
  onBringForward,
  onSendBackward,
  onClear,
  onSave,
  onExportPNG,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
      e.target.value = '';
    }
  };

  const handleExportWithConfetti = () => {
    onExportPNG();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFE600', '#FF6584', '#A388EE', '#00E599', '#121212'],
    });
  };

  return (
    <div className="bg-[#FFFDF5] border-3 border-neoDark shadow-neo p-3 space-y-3">
      {/* Top Actions: Mode, Insertables, Save/Export */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Interaction Modes */}
        <div className="flex items-center gap-1.5 bg-white p-1 border-2 border-neoDark shadow-neo-sm">
          <button
            onClick={() => onToggleDrawing(false)}
            className={`px-3 py-1.5 text-xs font-grotesk font-black uppercase flex items-center gap-1.5 transition-all ${
              !isDrawing ? 'bg-neoYellow text-neoDark border-2 border-neoDark' : 'hover:bg-gray-100'
            }`}
            title="Mode Pilih & Pindah Objek"
          >
            <MousePointer size={14} />
            Pilih
          </button>
          <button
            onClick={() => onToggleDrawing(true)}
            className={`px-3 py-1.5 text-xs font-grotesk font-black uppercase flex items-center gap-1.5 transition-all ${
              isDrawing ? 'bg-neoPink text-white border-2 border-neoDark' : 'hover:bg-gray-100'
            }`}
            title="Mode Menggambar & Tulisan Tangan Bebas"
          >
            <PenTool size={14} />
            Doodle
          </button>
        </div>

        {/* Object Insert Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Add Text buttons */}
          <div className="inline-flex border-2 border-neoDark bg-white">
            <button
              onClick={() => onAddText('handwriting')}
              className="px-2.5 py-1.5 text-xs font-handwriting text-base font-bold text-neoDark hover:bg-[#FFF8E7] flex items-center gap-1"
              title="Tambah tulisan tangan (font Caveat)"
            >
              <Type size={14} /> Catatan 
            </button>
            <button
              onClick={() => onAddText('grotesk')}
              className="px-2.5 py-1.5 text-xs font-grotesk font-black uppercase border-l-2 border-neoDark hover:bg-[#FFF8E7]"
              title="Tambah teks cetak (Space Grotesk)"
            >
              JUDUL
            </button>
          </div>

          {/* Stickers */}
          <NeoButton
            variant="purple"
            size="sm"
            onClick={onOpenStickerPicker}
            title="Tambah Stiker & Selotip Washi Tape"
          >
            <Sticker size={14} />
            Stiker & Tape
          </NeoButton>

          {/* From Receipt Jar */}
          <NeoButton
            variant="yellow"
            size="sm"
            onClick={onOpenReceiptPicker}
            title="Tempel karcis dari The Receipt Jar"
          >
            <ReceiptIcon size={14} />
            + Karcis Jar
          </NeoButton>

          {/* Upload Custom Photo */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <NeoButton
            variant="white"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            title="Upload foto kamera / galeri"
          >
            <ImageIcon size={14} />
            Foto
          </NeoButton>
        </div>

        {/* Right side: Save & Export */}
        <div className="flex items-center gap-2">
          <NeoButton
            variant="green"
            size="sm"
            onClick={onSave}
            title="Simpan Kolase ke Memori"
          >
            <Save size={14} />
            Simpan
          </NeoButton>

          <NeoButton
            variant="pink"
            size="sm"
            onClick={handleExportWithConfetti}
            title="Download Kolase Scrapbook ke format PNG resolusi tinggi"
          >
            <Download size={14} />
            Unduh PNG
          </NeoButton>
        </div>
      </div>

      {/* Sub-bar: If Drawing Mode is Active, show Brush settings; If Selection is Active, show Layer settings */}
      {isDrawing ? (
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-neoYellow/30 border-2 border-dashed border-neoDark">
          <div className="flex items-center gap-2">
            <span className="text-xs font-grotesk font-black uppercase text-neoDark">
              Warna Doodle:
            </span>
            <div className="flex items-center gap-1.5">
              {BRUSH_COLORS.map((col) => (
                <button
                  key={col.hex}
                  onClick={() => onSelectBrushColor(col.hex)}
                  style={{ backgroundColor: col.hex }}
                  className={`w-6 h-6 border-2 border-neoDark transition-transform ${
                    brushColor === col.hex ? 'scale-125 shadow-neo-sm ring-2 ring-neoDark' : ''
                  }`}
                  title={col.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-grotesk font-black uppercase text-neoDark">
              Ketebalan:
            </span>
            <div className="flex items-center gap-1">
              {[2, 4, 8, 14].map((w) => (
                <button
                  key={w}
                  onClick={() => onSelectBrushWidth(w)}
                  className={`px-2 py-0.5 text-xs font-bold border-2 border-neoDark ${
                    brushWidth === w ? 'bg-neoDark text-white' : 'bg-white text-neoDark'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-grotesk">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-600 font-bold">Lapisan Objek:</span>
            <button
              onClick={onBringForward}
              disabled={!hasSelection}
              className="p-1 px-2 border-2 border-neoDark bg-white hover:bg-yellow-50 disabled:opacity-40 flex items-center gap-1 font-bold"
              title="Bawa objek ke depan"
            >
              <ArrowUp size={12} /> Naik
            </button>
            <button
              onClick={onSendBackward}
              disabled={!hasSelection}
              className="p-1 px-2 border-2 border-neoDark bg-white hover:bg-yellow-50 disabled:opacity-40 flex items-center gap-1 font-bold"
              title="Kirim objek ke belakang"
            >
              <ArrowDown size={12} /> Turun
            </button>
            <button
              onClick={onDeleteSelected}
              disabled={!hasSelection}
              className="p-1 px-2 border-2 border-neoDark bg-white hover:bg-red-500 hover:text-white disabled:opacity-40 flex items-center gap-1 font-bold ml-1"
              title="Hapus objek yang dipilih"
            >
              <Trash2 size={12} /> Hapus Objek
            </button>
          </div>

          <button
            onClick={onClear}
            className="p-1 px-2 border-2 border-neoDark bg-white hover:bg-red-100 text-neoDark font-bold flex items-center gap-1"
            title="Bersihkan seluruh kanvas"
          >
            <RotateCcw size={12} /> Reset Kanvas
          </button>
        </div>
      )}
    </div>
  );
};
