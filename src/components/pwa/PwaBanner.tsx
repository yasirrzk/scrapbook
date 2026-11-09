import React, { useEffect, useState } from 'react';
import { Download, WifiOff, X, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { NeoButton } from '../common/NeoButton';

export const PwaBanner: React.FC = () => {
  const { deferredPrompt, setDeferredPrompt } = useAppStore();
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [setDeferredPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      {/* Offline Alert Badge */}
      {!isOnline && (
        <div className="bg-neoYellow border-b-3 border-neoDark p-2.5 px-4 text-center font-grotesk font-black text-xs uppercase flex items-center justify-center gap-2 text-neoDark">
          <WifiOff size={16} />
          <span>Mode Offline Aktif — Semua karcis & kolase tetap tersimpan di HP via IndexedDB</span>
        </div>
      )}

      {/* PWA Install Banner */}
      {deferredPrompt && !dismissed && (
        <div className="bg-neoYellow border-b-3 border-neoDark p-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-neo">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📲</span>
            <div>
              <p className="font-grotesk font-black text-xs sm:text-sm uppercase text-neoDark">
                Pasang Scrapbook ke Layar Utama HP
              </p>
              <p className="font-grotesk font-medium text-xs text-neoDark/80">
                Akses cepat toples struk & kanvas kolase offline kapan pun.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NeoButton
              variant="dark"
              size="sm"
              onClick={handleInstallClick}
              className="text-xs"
            >
              <Download size={14} /> Install PWA
            </NeoButton>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 border-2 border-neoDark bg-white hover:bg-gray-100 cursor-pointer"
              title="Tutup banner"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
