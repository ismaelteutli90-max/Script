import React, { useState } from "react";
import { HistoryEntry } from "../types";
import { Clock, Trash2, Search, ArrowRight, CheckCircle2, ChevronRight, Ban } from "lucide-react";

interface HistoryListProps {
  entries: HistoryEntry[];
  onSelectEntry: (entry: HistoryEntry) => void;
  onDeleteEntry: (id: string) => void;
  onClearHistory: () => void;
}

export default function HistoryList({
  entries,
  onSelectEntry,
  onDeleteEntry,
  onClearHistory,
}: HistoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEntries = entries.filter((entry) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      entry.nombre.toLowerCase().includes(searchLower) ||
      entry.os.toLowerCase().includes(searchLower) ||
      entry.cuenta.toLowerCase().includes(searchLower)
    );
  });

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "instalacion":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "soporte":
        return "bg-sky-500/10 text-sky-400 border border-sky-500/20";
      case "planta":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  const getOrderLabel = (type: string) => {
    switch (type) {
      case "instalacion":
        return "Instalación";
      case "soporte":
        return "Soporte";
      case "planta":
        return "Planta Ext.";
      default:
        return "Otro";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#e30613]" />
          <h2 className="text-xl font-semibold text-white">Historial de Reportes</h2>
        </div>

        {entries.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("¿Estás seguro de que deseas borrar todo el historial?")) {
                onClearHistory();
              }
            }}
            className="text-xs text-red-500 hover:text-red-400 transition-colors"
          >
            Borrar Todo
          </button>
        )}
      </div>

      {entries.length > 0 && (
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, OS o cuenta..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#e30613]"
          />
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
        </div>
      )}

      <div className="flex-1 overflow-y-auto max-h-[350px] md:max-h-none space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 text-slate-500">
            <Clock className="w-10 h-10 text-slate-700 mb-2" />
            <p className="text-xs font-medium">Historial vacío</p>
            <p className="text-[10px] text-slate-600 mt-1 max-w-[200px]">
              Los reportes que guardes aparecerán aquí para acceso rápido posterior.
            </p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No se encontraron coincidencias para "{searchTerm}"
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-slate-950/50 hover:bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-xl p-3.5 transition-all duration-200 flex justify-between items-start group"
            >
              <div
                onClick={() => onSelectEntry(entry)}
                className="flex-1 cursor-pointer pr-3 space-y-1"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider ${getBadgeColor(entry.orderType)}`}>
                    {getOrderLabel(entry.orderType)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(entry.timestamp).toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-[#e30613] transition-colors">
                  {entry.nombre || "Sin Nombre de Cliente"}
                </h4>

                <div className="flex items-center gap-x-4 text-[10px] text-slate-400 font-mono">
                  <span>OS: {entry.os || "S/D"}</span>
                  <span>CTA: {entry.cuenta || "S/D"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectEntry(entry)}
                  className="p-1 bg-slate-900 group-hover:bg-[#e30613]/10 text-slate-400 group-hover:text-[#e30613] rounded-lg transition-all"
                  title="Cargar reporte"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-1 text-slate-600 hover:text-red-500 rounded-lg hover:bg-red-950/20 transition-all opacity-0 group-hover:opacity-100"
                  title="Eliminar de historial"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
