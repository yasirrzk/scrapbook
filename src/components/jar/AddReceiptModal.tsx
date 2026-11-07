import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Sparkles } from 'lucide-react';
import type { ReceiptCategory } from '../../types';
import { NeoButton } from '../common/NeoButton';
import { NeoInput, NeoTextArea } from '../common/NeoInput';

interface AddReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (receipt: {
    title: string;
    category: ReceiptCategory;
    date: string;
    amount?: number;
    location?: string;
    notes?: string;
    imageUrl: string;
  }) => Promise<any>;
}

export const AddReceiptModal: React.FC<AddReceiptModalProps> = ({ isOpen, onClose, onAdd }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReceiptCategory>('Kuliner');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDefaultReceiptSlip = () => {
    const receiptSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="100%" height="100%" fill="%23FFFDF5"/><rect x="12" y="12" width="276" height="376" fill="none" stroke="%23121212" stroke-width="3" stroke-dasharray="6,4"/><text x="150" y="50" font-family="monospace" font-weight="900" font-size="18" text-anchor="middle" fill="%23121212">MEMORI KITA</text><line x1="25" y1="70" x2="275" y2="70" stroke="%23121212" stroke-width="2"/><text x="150" y="110" font-family="monospace" font-size="14" text-anchor="middle" fill="%23121212">${title || 'Kencan Manis'}</text><text x="150" y="140" font-family="monospace" font-size="12" text-anchor="middle" fill="%23555555">${date} • ${location || 'Tempat Spesial'}</text><rect x="40" y="180" width="220" height="50" fill="%23FFE600" stroke="%23121212" stroke-width="2"/><text x="150" y="212" font-family="monospace" font-weight="bold" font-size="14" text-anchor="middle" fill="%23121212">RP ${amount || '0'}</text><text x="150" y="280" font-family="cursive" font-size="20" text-anchor="middle" fill="%23FF6584">${notes || 'Kenangan tak terlupakan ❤️'}</text><text x="150" y="340" font-family="monospace" font-size="10" text-anchor="middle" fill="%23888888">★ THE RECEIPT JAR ARCHIVE ★</text></svg>`;
    setImageUrl(receiptSvg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul karcis / struk wajib diisi');
      return;
    }
    if (!imageUrl) {
      setError('Silakan upload foto tiket/struk atau buat slip otomatis');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAdd({
        title: title.trim(),
        category,
        date,
        amount: amount ? parseFloat(amount) : undefined,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
        imageUrl,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan karcis');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neoDark/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FFFDF5] border-3 border-neoDark shadow-neo-xl my-8">
        {/* Header */}
        <div className="bg-neoYellow border-b-3 border-neoDark p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧾</span>
            <h2 className="font-grotesk font-black text-lg tracking-wide uppercase text-neoDark">
              Simpan Karcis / Struk
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-neoDark bg-white hover:bg-neoPink hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-neoPink text-white border-2 border-neoDark font-grotesk font-bold text-xs"> {error}
            </div>
          )}

          {/* Photo Upload Area */}
          <div>
            <label className="block font-grotesk font-bold text-xs uppercase tracking-wider text-neoDark mb-1.5">
              Foto Tiket / Struk / Karcis *
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />

            {imageUrl ? (
              <div className="relative border-3 border-neoDark bg-white p-2">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full max-h-52 object-contain mx-auto"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-neoPink text-white border-2 border-neoDark p-1 text-xs font-bold hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-3 border-dashed border-neoDark bg-white p-5 text-center flex flex-col items-center gap-3">
                <div className="flex gap-2">
                  <NeoButton
                    type="button"
                    variant="yellow"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} />
                    Upload File / Foto
                  </NeoButton>
                  <NeoButton
                    type="button"
                    variant="green"
                    size="sm"
                    onClick={generateDefaultReceiptSlip}
                  >
                    <Sparkles size={14} />
                    Slip Tiket Digital
                  </NeoButton>
                </div>
                <p className="text-xs text-gray-500 font-grotesk">
                  Format JPG, PNG, WEBP (maks. 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Title */}
          <NeoInput
            label="Nama Tempat / Acara *"
            placeholder="cth: Tiket Nonton IMAX Dune, Kopi Kenangan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Category & Date in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-grotesk font-bold text-xs uppercase tracking-wider text-neoDark mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReceiptCategory)}
                className="w-full px-3 py-2.5 font-grotesk font-bold text-sm bg-white border-3 border-neoDark shadow-neo-sm focus:shadow-neo focus:outline-none"
              >
                <option value="Kuliner">Kuliner</option>
                <option value="Transport">Transport</option>
                <option value="Bioskop">Bioskop</option>
                <option value="Liburan">Liburan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <NeoInput
              label="Tanggal Kejadian"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Amount & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NeoInput
              label="Nominal Pengeluaran (Rp)"
              type="number"
              placeholder="cth: 120000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <NeoInput
              label="Lokasi / Kota"
              placeholder="cth: Grand Indonesia, Jakarta"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Notes (Handwritten style) */}
          <NeoTextArea
            label="Catatan Kecil Berdua (Memo)"
            placeholder="Tuliskan momen lucu, kesan pertama, atau hal manis saat itu..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-neoDark">
            <NeoButton
              type="button"
              variant="white"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </NeoButton>
            <NeoButton
              type="submit"
              variant="yellow"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan ke Jar'}
            </NeoButton>
          </div>
        </form>
      </div>
    </div>
  );
};
