import React, { useState } from "react";
import { Copy, Check, MessageSquare, AlertCircle } from "lucide-react";

interface FormattedScriptDisplayProps {
  script: string;
  onScriptChange?: (newScript: string) => void;
  onSaveToHistory: () => void;
  hasData: boolean;
}

export default function FormattedScriptDisplay({
  script,
  onScriptChange,
  onSaveToHistory,
  hasData,
}: FormattedScriptDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!script) return;
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for some iframe contexts
      const textArea = document.createElement("textarea");
      textArea.value = script;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error("No se pudo copiar el texto", e);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDirectEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onScriptChange) {
      onScriptChange(e.target.value);
    }
  };

  const charCount = script ? script.length : 0;
  const lineCount = script ? script.split("\n").length : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#e30613]" />
            Reporte Formateado (WhatsApp)
          </h2>
          <p className="text-xs text-slate-400">Listo para copiar y pegar en los canales de Totalplay</p>
        </div>

        <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-1 rounded border border-slate-800">
          {charCount} carácteres | {lineCount} líneas
        </span>
      </div>

      <div className="flex-1 relative min-h-[300px]">
        {script ? (
          <textarea
            value={script}
            onChange={handleDirectEdit}
            className="w-full h-full min-h-[300px] bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-4 font-mono text-sm leading-relaxed focus:outline-none focus:border-[#e30613] resize-y"
            placeholder="El reporte formateado aparecerá aquí..."
          />
        ) : (
          <div className="w-full h-full min-h-[300px] bg-slate-950/40 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <AlertCircle className="w-10 h-10 text-slate-600 mb-3" />
            <p className="text-sm font-medium">No hay reporte generado aún</p>
            <p className="text-xs text-slate-600 mt-1 max-w-xs">
              Carga una captura de pantalla de Field Cloud o pega datos técnicos para iniciar el proceso automatizado.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleCopy}
          disabled={!script}
          className={`flex-1 font-medium py-3 px-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed ${
            copied
              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
              : "bg-[#e30613] hover:bg-[#c40510] text-white"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              ¡Copiado con Éxito!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar Reporte
            </>
          )}
        </button>

        <button
          onClick={onSaveToHistory}
          disabled={!hasData}
          className="bg-slate-800 hover:bg-slate-750 text-white font-medium py-3 px-4 rounded-xl border border-slate-700 shadow-md transition-all duration-200 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Guardar Historial
        </button>
      </div>

      <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-850 text-[11px] text-slate-500 leading-normal flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          Este formato cumple con las pautas oficiales de Totalplay para soporte e instalaciones de fibra óptica. 
          No contiene etiquetas markdown como asteriscos (**), para que sea 100% compatible con copiado directo.
        </p>
      </div>
    </div>
  );
}
