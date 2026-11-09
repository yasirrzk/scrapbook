import React, { useEffect, useRef, useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { CanvasToolbar } from './CanvasToolbar';
import { StickerPicker, type StickerOption } from './StickerPicker';
import { ReceiptPickerModal } from './ReceiptPickerModal';
import { useAppStore } from '../../store/useAppStore';
import type { Receipt } from '../../types';
import { NeoButton } from '../common/NeoButton';
import { NeoInput } from '../common/NeoInput';
import { X } from 'lucide-react';

export const CanvasArea: React.FC = () => {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { selectedReceiptForCanvas, setSelectedReceiptForCanvas } = useAppStore();

  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
  const [isReceiptPickerOpen, setIsReceiptPickerOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [collageTitle, setCollageTitle] = useState('Kolase Kencan Kami');
  const [collageDate, setCollageDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const {
    initCanvas,
    activeTool,
    setTool,
    brushColor,
    updateBrushColor,
    brushWidth,
    updateBrushWidth,
    eraserSize,
    updateEraserSize,
    clearDoodlesOnly,
    hasSelection,
    addText,
    addImage,
    deleteSelected,
    bringForward,
    sendBackward,
    clearCanvas,
    exportHighResPNG,
    saveCollageToDB,
  } = useCanvas();

  // Initialize Fabric Canvas on mount
  useEffect(() => {
    if (!canvasElementRef.current || !containerRef.current) return;

    // Determine appropriate canvas size based on container
    const containerWidth = Math.min(containerRef.current.clientWidth - 8, 860);
    const canvasWidth = Math.max(340, containerWidth);
    const canvasHeight = Math.round(canvasWidth * 0.75); // 4:3 aspect ratio

    initCanvas(canvasElementRef.current, canvasWidth, canvasHeight);
  }, [initCanvas]);

  // Handle incoming receipt to be pasted on canvas from Receipt Jar
  useEffect(() => {
    if (selectedReceiptForCanvas) {
      addImage(selectedReceiptForCanvas.imageUrl, false);
      if (selectedReceiptForCanvas.notes) {
        addText('handwriting', `"${selectedReceiptForCanvas.notes}"`);
      }
      setSelectedReceiptForCanvas(null);
    }
  }, [selectedReceiptForCanvas, addImage, addText, setSelectedReceiptForCanvas]);

  const handleSelectSticker = (sticker: StickerOption) => {
    addImage(sticker.url, true);
  };

  const handleSelectReceipt = (receipt: Receipt) => {
    addImage(receipt.imageUrl, false);
    if (receipt.notes) {
      addText('handwriting', `"${receipt.notes}"`);
    }
  };

  const handleUploadImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        addImage(reader.result, false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCollage = async () => {
    if (!collageTitle.trim()) return;
    try {
      await saveCollageToDB(collageTitle.trim(), collageDate);
      setIsSaveModalOpen(false);
      setSaveSuccessMsg('Kolase berhasil disimpan ke galeri scrapbook!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Canvas Controls Toolbar */}
      <CanvasToolbar
        tool={activeTool}
        onSelectTool={setTool}
        brushColor={brushColor}
        onSelectBrushColor={updateBrushColor}
        brushWidth={brushWidth}
        onSelectBrushWidth={updateBrushWidth}
        eraserSize={eraserSize}
        onSelectEraserSize={updateEraserSize}
        onClearDoodlesOnly={clearDoodlesOnly}
        onAddText={addText}
        onOpenStickerPicker={() => setIsStickerPickerOpen(true)}
        onOpenReceiptPicker={() => setIsReceiptPickerOpen(true)}
        onUploadImage={handleUploadImageFile}
        hasSelection={hasSelection}
        onDeleteSelected={deleteSelected}
        onBringForward={bringForward}
        onSendBackward={sendBackward}
        onClear={clearCanvas}
        onSave={() => setIsSaveModalOpen(true)}
        onExportPNG={() => exportHighResPNG(`${collageTitle.toLowerCase().replace(/\s+/g, '-')}.png`)}
      />

      {saveSuccessMsg && (
        <div className="p-3 bg-neoGreen text-white border-3 border-neoDark shadow-neo font-grotesk font-black text-xs flex items-center justify-between">
          <span>✨ {saveSuccessMsg}</span>
          <button onClick={() => setSaveSuccessMsg('')} className="cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Canvas Board Area */}
      <div
        ref={containerRef}
        className="w-full flex items-center justify-center p-3 sm:p-6 bg-neoBase border-3 border-neoDark shadow-neo overflow-x-auto min-h-[460px] relative"
        style={{
          backgroundImage:
            'radial-gradient(#221F1B 1px, transparent 1px), radial-gradient(#221F1B 1px, #FAF6F0 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      >
        <div className="border-3 border-neoDark shadow-neo-lg bg-[#FAF6F0] p-1 inline-block">
          <canvas ref={canvasElementRef} />
        </div>
      </div>

      {/* Hints bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-white border-2 border-neoDark text-xs font-grotesk text-neoDark/80">
        <span>
          <strong>Tips Scrapbook:</strong> Klik dua kali pada teks untuk mengedit. Geser sudut objek untuk memutar atau mengubah ukuran.
        </span>
        <span className="font-bold text-neoPink">Export Image</span>
      </div>

      {/* Sticker Picker Modal */}
      <StickerPicker
        isOpen={isStickerPickerOpen}
        onClose={() => setIsStickerPickerOpen(false)}
        onSelectSticker={handleSelectSticker}
      />

      {/* Receipt Picker Modal */}
      <ReceiptPickerModal
        isOpen={isReceiptPickerOpen}
        onClose={() => setIsReceiptPickerOpen(false)}
        onSelectReceipt={handleSelectReceipt}
      />

      {/* Save Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-neoDark/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] border-3 border-neoDark shadow-neo-xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-neoDark pb-2">
              <h3 className="font-grotesk font-black text-base uppercase text-neoDark">
                Simpan Kolase Scrapbook
              </h3>
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="p-1 border-2 border-neoDark hover:bg-neoPink hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <NeoInput
              label="Judul Kolase"
              value={collageTitle}
              onChange={(e) => setCollageTitle(e.target.value)}
              placeholder="cth: Kencan Akhir Pekan di Bandung"
            />

            <NeoInput
              label="Tanggal Kenangan"
              type="date"
              value={collageDate}
              onChange={(e) => setCollageDate(e.target.value)}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <NeoButton variant="white" onClick={() => setIsSaveModalOpen(false)}>
                Batal
              </NeoButton>
              <NeoButton variant="green" onClick={handleSaveCollage}>
                Simpan ke Galeri
              </NeoButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
