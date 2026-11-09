import React from 'react';
import { X, Search } from 'lucide-react';
import { useReceipts } from '../../hooks/useReceipts';
import type { Receipt } from '../../types';
import { NeoBadge } from '../common/NeoBadge';

interface ReceiptPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReceipt: (receipt: Receipt) => void;
}

export const ReceiptPickerModal: React.FC<ReceiptPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectReceipt,
}) => {
  const { allReceipts } = useReceipts();
  const [query, setQuery] = React.useState('');

  if (!isOpen) return null;

  const filtered = allReceipts.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.category.toLowerCase().includes(query.toLowerCase()) ||
      (r.location && r.location.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-neoDark/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FAF6F0] border-3 border-neoDark shadow-neo-xl w-full max-w-xl my-6">
        {/* Header */}
        <div className="bg-neoYellow border-b-3 border-neoDark p-3 sm:p-4 flex items-center justify-between">
          <h3 className="font-grotesk font-black text-base uppercase text-neoDark">
            Pilih Karcis dari The Receipt Jar
          </h3>
          <button
            onClick={onClose}
            className="p-1 border-2 border-neoDark bg-white hover:bg-neoPink hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b-2 border-neoDark bg-white">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari karcis..."
              className="w-full pl-9 pr-3 py-2 border-2 border-neoDark text-xs font-bold font-grotesk focus:outline-none"
            />
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neoDark" />
          </div>
        </div>

        {/* List */}
        <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((receipt) => (
              <div
                key={receipt.id}
                onClick={() => {
                  onSelectReceipt(receipt);
                  onClose();
                }}
                className="bg-white border-2 border-neoDark p-2 hover:bg-[#F3ECE1] cursor-pointer shadow-neo-sm hover:shadow-neo transition-all flex flex-col justify-between"
              >
                <div className="aspect-[4/3] bg-gray-50 border border-neoDark mb-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={receipt.imageUrl}
                    alt={receipt.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <NeoBadge category={receipt.category} className="mb-1 text-[9px] py-0 px-1.5" />
                  <p className="font-grotesk font-bold text-xs text-neoDark line-clamp-1">
                    {receipt.title}
                  </p>
                  <p className="text-[10px] text-neoDark/60 font-grotesk">{receipt.date}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-xs font-bold text-neoDark/60">
              Belum ada karcis yang tersimpan di toples.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
