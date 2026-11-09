import React, { useRef } from 'react';
import {
  MousePointer,
  PenTool,
  Eraser,
  Type,
  Sticker,
  Image as ImageIcon,
  Receipt as ReceiptIcon,
  Trash2,
  Download,
  Save,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import { NeoButton } from '../common/NeoButton';
import confetti from 'canvas-confetti';
import type { ToolMode } from '../../hooks/useCanvas';

interface CanvasToolbarProps {
  tool: ToolMode;
  onSelectTool: (tool: ToolMode) => void;
  brushColor: string;
  onSelectBrushColor: (color: string) => void;
  brushWidth: number;
  onSelectBrushWidth: (width: number) => void;
  eraserSize: number;
  onSelectEraserSize: (size: number) => void;
  onClearDoodlesOnly: () => void;
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
  { name: 'Espresso', hex: '#221F1B' },
  { name: 'Dusty Rose', hex: '#D87D88' },
  { name: 'Warm Honey', hex: '#EAC875' },
  { name: 'Muted Sage', hex: '#8EA48B' },
  { name: 'Dusty Mauve', hex: '#9C8EB9' },
  { name: 'Slate Blue', hex: '#799BA8' },
  { name: 'Tipe-X Kertas', hex: '#FAF6F0' },
];

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  tool,
  onSelectTool,
  brushColor,
  onSelectBrushColor,
  brushWidth,
  onSelectBrushWidth,
  eraserSize,
  onSelectEraserSize,
  onClearDoodlesOnly,
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
      colors: ['#EAC875', '#D87D88', '#9C8EB9', '#8EA48B', '#799BA8', '#221F1B'],
    });
  };

  return (
    <div className="bg-[#FAF6F0] border-3 border-neoDark shadow-neo p-3 space-y-3">
      {/* Top Actions: Mode Switcher, Object Inserters, Save & Export */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Interaction Modes: Pilih, Doodle, Penghapus */}
        <div className="flex items-center gap-1.5 bg-white p-1 border-2 border-neoDark shadow-neo-sm">
          <button
            onClick={() => onSelectTool('select')}
            className={`px-3 py-1.5 text-xs font-grotesk font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              tool === 'select' ? 'bg-neoYellow text-neoDark border-2 border-neoDark' : 'hover:bg-gray-100'
            }`}
            title="Mode Pilih & Pindah Objek"
          >
            <MousePointer size={14} />
            Pilih
          </button>
          <button
            onClick={() => onSelectTool('draw')}
            className={`px-3 py-1.5 text-xs font-grotesk font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              tool === 'draw' ? 'bg-neoPink text-white border-2 border-neoDark' : 'hover:bg-gray-100'
            }`}
            title="Mode Menggambar & Tulisan Tangan Bebas"
          >
            <PenTool size={14} />
            Doodle
          </button>
          <button
            onClick={() => onSelectTool('eraser')}
            className={`px-3 py-1.5 text-xs font-grotesk font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              tool === 'eraser' ? 'bg-neoPurple text-white border-2 border-neoDark' : 'hover:bg-gray-100'
            }`}
            title="Mode Penghapus (Hapus Coretan Doodle)"
          >
            <Eraser size={14} />
            Penghapus
          </button>
        </div>

        {/* Object Insert Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Add Text buttons */}
          <div className="inline-flex border-2 border-neoDark bg-white">
            <button
              onClick={() => onAddText('handwriting')}
              className="px-2.5 py-1.5 text-xs font-handwriting text-base font-bold text-neoDark hover:bg-[#F3ECE1] flex items-center gap-1 cursor-pointer"
              title="Tambah tulisan tangan (font Caveat)"
            >
              <Type size={14} /> Catatan ✍️
            </button>
            <button
              onClick={() => onAddText('grotesk')}
              className="px-2.5 py-1.5 text-xs font-grotesk font-black uppercase border-l-2 border-neoDark hover:bg-[#F3ECE1] cursor-pointer"
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

      {/* Sub-bar: Dynamic contextual controls based on active tool */}
      {tool === 'draw' && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-neoYellow/25 border-2 border-dashed border-neoDark">
          <div className="flex items-center gap-2">
            <span className="text-xs font-grotesk font-black uppercase text-neoDark">
              Warna Doodle:
            </span>
            <div className="flex items-center gap-1.5">
              {BRUSH_COLORS.map((col) => (
                <button
                  key={col.name}
                  onClick={() => onSelectBrushColor(col.hex)}
                  style={{ backgroundColor: col.hex }}
                  className={`w-6 h-6 border-2 border-neoDark transition-transform cursor-pointer relative ${
                    brushColor === col.hex ? 'scale-125 shadow-neo-sm ring-2 ring-neoDark' : ''
                  }`}
                  title={col.name}
                >
                  {col.name === 'Tipe-X Kertas' && (
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black leading-none text-neoDark">
                      X
                    </span>
                  )}
                </button>
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
                  className={`px-2 py-0.5 text-xs font-bold border-2 border-neoDark cursor-pointer ${
                    brushWidth === w ? 'bg-neoDark text-white' : 'bg-white text-neoDark'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tool === 'eraser' && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-neoPurple/20 border-2 border-dashed border-neoDark">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1 text-xs font-grotesk font-black uppercase text-neoDark bg-neoPurple text-white px-2 py-0.5 border border-neoDark">
              <Eraser size={12} />
              Penghapus Aktif
            </span>
            <span className="text-xs font-grotesk font-medium text-neoDark/80 hidden sm:inline">
              Klik atau gesek di atas garis doodle untuk menghapusnya.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-xs font-grotesk font-bold text-neoDark mr-1">Ukuran:</span>
              {[
                { label: 'S (8px)', val: 8 },
                { label: 'M (18px)', val: 18 },
                { label: 'L (32px)', val: 32 },
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => onSelectEraserSize(s.val)}
                  className={`px-2 py-0.5 text-xs font-bold border-2 border-neoDark cursor-pointer ${
                    eraserSize === s.val ? 'bg-neoDark text-white' : 'bg-white text-neoDark'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                if (confirm('Hapus seluruh coretan doodle di kanvas? (Foto & teks tetap aman)')) {
                  onClearDoodlesOnly();
                }
              }}
              className="p-1 px-2 border-2 border-neoDark bg-white hover:bg-neoPink hover:text-white text-xs font-grotesk font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="Hapus hanya coretan gambar tangan bebas, simpan foto & teks"
            >
              <RotateCcw size={12} /> Hapus Semua Coretan
            </button>
          </div>
        </div>
      )}

      {tool === 'select' && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-grotesk">
          <div className="flex items-center gap-1.5">
            <span className="text-neoDark/70 font-bold">Lapisan Objek:</span>
            <button
              onClick={onBringForward}
              disabled={!hasSelection}
              className="p-1 px-2 border-2 border-neoDark bg-white hover:bg-[#F3ECE1] disabled:opacity-40 flex items-center gap-1 font-bold cursor-pointer"
              title="Bawa objek ke depan"
            >
              <ArrowUp size={12} /> Naik
            </button>
            <button
              onClick={onSendBackward}
              disabled={!hasSelection}
              className="p-1 px-2 border-2 border-neoDark bg-white hover:bg-[#F3ECE1] disabled:opacity-40 flex items-center gap-1 font-bold cursor-pointer"
              title="Kirim objek ke belakang"
            >
              <ArrowDown size={12} /> Turun
            </button>
            <button
              onClick={onDeleteSelected}
              disabled={!hasSelection}
              className="p-1 px-2 border-2 border-neoDark bg-white hover:bg-neoPink hover:text-white disabled:opacity-40 flex items-center gap-1 font-bold ml-1 cursor-pointer"
              title="Hapus objek yang dipilih"
            >
              <Trash2 size={12} /> Hapus Objek
            </button>
          </div>

          <button
            onClick={onClear}
            className="p-1 px-2 border-2 border-neoDark bg-white hover:bg-[#FBECEE] text-neoDark font-bold flex items-center gap-1 cursor-pointer"
            title="Bersihkan seluruh kanvas"
          >
            <RotateCcw size={12} /> Reset Kanvas
          </button>
        </div>
      )}
    </div>
  );
};
