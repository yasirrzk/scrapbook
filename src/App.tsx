import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Heart,
  Palette,
  Inbox,
  Clock,
  Images,
  DownloadCloud,
  UploadCloud,
} from 'lucide-react';
import { useAppStore, type AppTab } from './store/useAppStore';
import { seedSampleDataIfEmpty } from './db';
import { JarView } from './components/jar/JarView';
import { CanvasArea } from './components/canvas/CanvasArea';
import { FlashbackView } from './components/jar/FlashbackView';
import { CollageGalleryView } from './components/canvas/CollageGalleryView';
import { PwaBanner } from './components/pwa/PwaBanner';
import { exportAllDataAsJSON, importDataFromJSON } from './services/backupService';
import type { ScrapbookCollage } from './types';

export const App: React.FC = () => {
  const { currentTab, setCurrentTab } = useAppStore();
  const [selectedCollageForEditing, setSelectedCollageForEditing] = useState<ScrapbookCollage | null>(null);

  // Seed sample receipts if database is freshly empty
  useEffect(() => {
    seedSampleDataIfEmpty().catch(console.error);
  }, []);

  const handleLoadCollageToCanvas = (collage: ScrapbookCollage) => {
    setSelectedCollageForEditing(collage);
    setCurrentTab('canvas');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importDataFromJSON(file);
        alert('Data berhasil diimpor!');
        window.location.reload();
      } catch (err) {
        alert('Gagal mengimpor file backup.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-neoBase flex flex-col font-sans selection:bg-neoYellow selection:text-neoDark">
      {/* PWA Banner & Offline Notification */}
      <PwaBanner />

      {/* Top Navbar */}
      <header className="border-b-3 border-neoDark bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentTab('jar')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 bg-neoYellow border-3 border-neoDark shadow-neo-sm flex items-center justify-center text-xl group-hover:rotate-6 transition-transform">
              🗃️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-grotesk font-black text-lg sm:text-xl tracking-tight text-neoDark uppercase">
                  Digital Scrapbook
                </span>
                <span className="bg-neoPink text-white text-[10px] font-black px-1.5 py-0.5 border-2 border-neoDark shadow-neo-sm">
                  PWA
                </span>
              </div>
              <p className="font-handwriting text-sm text-neoDark/80 leading-none">
                The Receipt Jar & Kanvas Kenangan Berdua
              </p>
            </div>
          </div>

          {/* Backup / Export Import Tools */}
          <div className="flex items-center gap-2 text-xs font-grotesk font-bold">
            <button
              onClick={exportAllDataAsJSON}
              className="p-1.5 sm:px-2.5 sm:py-1 border-2 border-neoDark bg-white hover:bg-yellow-50 shadow-neo-sm flex items-center gap-1.5 text-neoDark transition-all"
              title="Backup semua kenangan ke file JSON"
            >
              <DownloadCloud size={14} />
              <span className="hidden sm:inline">Backup</span>
            </button>
            <label className="p-1.5 sm:px-2.5 sm:py-1 border-2 border-neoDark bg-white hover:bg-yellow-50 shadow-neo-sm flex items-center gap-1.5 text-neoDark transition-all cursor-pointer">
              <UploadCloud size={14} />
              <span className="hidden sm:inline">Restore</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t-2 border-neoDark bg-neoBase">
          <div className="max-w-6xl mx-auto px-4 flex items-center overflow-x-auto no-scrollbar">
            <button
              onClick={() => setCurrentTab('jar')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-grotesk font-black uppercase flex items-center gap-2 border-r-2 border-neoDark whitespace-nowrap transition-all ${
                currentTab === 'jar'
                  ? 'bg-neoYellow text-neoDark border-b-3 border-b-neoDark shadow-neo-sm'
                  : 'text-neoDark/80 hover:bg-white'
              }`}
            >
              <Inbox size={16} />
              The Receipt Jar
            </button>

            <button
              onClick={() => setCurrentTab('canvas')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-grotesk font-black uppercase flex items-center gap-2 border-r-2 border-neoDark whitespace-nowrap transition-all ${
                currentTab === 'canvas'
                  ? 'bg-neoPink text-white border-b-3 border-b-neoDark shadow-neo-sm'
                  : 'text-neoDark/80 hover:bg-white'
              }`}
            >
              <Palette size={16} />
              Scrapbook Canvas
            </button>

            <button
              onClick={() => setCurrentTab('flashback')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-grotesk font-black uppercase flex items-center gap-2 border-r-2 border-neoDark whitespace-nowrap transition-all ${
                currentTab === 'flashback'
                  ? 'bg-neoPurple text-white border-b-3 border-b-neoDark shadow-neo-sm'
                  : 'text-neoDark/80 hover:bg-white'
              }`}
            >
              <Clock size={16} />
              "On This Day"
            </button>

            <button
              onClick={() => setCurrentTab('gallery')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-grotesk font-black uppercase flex items-center gap-2 border-r-2 border-neoDark whitespace-nowrap transition-all ${
                currentTab === 'gallery'
                  ? 'bg-neoGreen text-neoDark border-b-3 border-b-neoDark shadow-neo-sm'
                  : 'text-neoDark/80 hover:bg-white'
              }`}
            >
              <Images size={16} />
              Galeri Kolase
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-20">
        {currentTab === 'jar' && <JarView />}
        {currentTab === 'canvas' && <CanvasArea />}
        {currentTab === 'flashback' && <FlashbackView />}
        {currentTab === 'gallery' && (
          <CollageGalleryView onLoadCollageToCanvas={handleLoadCollageToCanvas} />
        )}
      </main>

      {/* Neobrutalist Footer */}
      <footer className="border-t-3 border-neoDark bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-grotesk">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-neoYellow border-2 border-neoDark font-bold">
              NEOBRUTALISM
            </span>
            <span className="font-bold text-neoDark">
              Digital Scrapbook & Receipt Jar (PWA)
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-gray-700">
            Dibuat dengan <Heart size={14} className="text-neoPink fill-neoPink inline" /> untuk
            mengabadikan setiap momen kencan berdua.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
