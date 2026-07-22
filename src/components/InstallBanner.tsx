import React from 'react';
import { Download, X } from 'lucide-react';

interface InstallBannerProps {
  deferredPrompt: any;
  onClose: () => void;
}

export const InstallBanner: React.FC<InstallBannerProps> = ({ deferredPrompt, onClose }) => {
  if (!deferredPrompt) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      onClose();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Instalar App</h4>
            <p className="text-xs text-slate-400">Instala para acceso rápido</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <button 
            onClick={handleInstall}
            className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
};
