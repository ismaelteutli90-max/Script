import React, { useState, useEffect } from 'react';
import { User, IdCard, Save, X } from 'lucide-react';

interface ProfileSettingsProps {
  onClose: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onClose }) => {
  const [tecnico, setTecnico] = useState(localStorage.getItem('tecnico') || '');
  const [gaffete, setGaffete] = useState(localStorage.getItem('gaffete') || '');

  const saveProfile = () => {
    localStorage.setItem('tecnico', tecnico);
    localStorage.setItem('gaffete', gaffete);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">Perfil Técnico</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nombre del Técnico</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
              <input 
                type="text" 
                value={tecnico}
                onChange={(e) => setTecnico(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-3 text-sm text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs text-slate-400 mb-1 block">ID / Gaffete</label>
            <div className="relative">
              <IdCard className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
              <input 
                type="text" 
                value={gaffete}
                onChange={(e) => setGaffete(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-3 text-sm text-white"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={saveProfile}
          className="w-full mt-6 bg-primary text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700"
        >
          <Save className="w-4 h-4" /> Guardar
        </button>
      </div>
    </div>
  );
};
