import React, { useState, useEffect } from "react";
import { ReportData, HistoryEntry, OrderType } from "./types";
import { generateWhatsappScript } from "./utils";
import FileUpload from "./components/FileUpload";
import ReportForm from "./components/ReportForm";
import FormattedScriptDisplay from "./components/FormattedScriptDisplay";
import HistoryList from "./components/HistoryList";
import { Sparkles, RefreshCw, AlertCircle, FileSpreadsheet, PlusCircle, UserCheck, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { InstallBanner } from "./components/InstallBanner";
import { ProfileSettings } from "./components/ProfileSettings";

const BLANK_REPORT = (type: OrderType = "instalacion"): ReportData => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();

  return {
    orderType: type,
    fecha: `${dd}/${mm}/${yyyy}`,
    tecnico: "MARIO ISMAEL TEUTLI MARCELINO",
    gaffete: "MEGE3PUET0498",
    os: "",
    cuenta: "",
    nombre: "",
    cta: "",
    sp: "",
    pto: "",
    candado: "Sin candado",
    ubicacion: "",
    equipos: [],
    pruebasVelocidad: true,
    script: "",
  };
};

export default function App() {
  const [reportData, setReportData] = useState<ReportData>(BLANK_REPORT());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hasData, setHasData] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    // Pre-fill profile if not set
    if (!localStorage.getItem('tecnico')) localStorage.setItem('tecnico', 'Luis Fernando Becerril');
    if (!localStorage.getItem('gaffete')) localStorage.setItem('gaffete', 'MEGE3PUET0446');

    try {
      const stored = localStorage.getItem("totalplay_report_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error al cargar historial:", e);
    }
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Save history to state and localStorage
  const saveToHistory = () => {
    if (!reportData.nombre && !reportData.os && !reportData.cuenta) {
      alert("Por favor rellena al menos el nombre, OS o cuenta del cliente para guardar en el historial.");
      return;
    }

    const newEntry: HistoryEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      orderType: reportData.orderType,
      os: reportData.os,
      cuenta: reportData.cuenta,
      nombre: reportData.nombre,
      script: reportData.script,
      data: reportData,
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("totalplay_report_history", JSON.stringify(updatedHistory));
    alert("¡Reporte guardado en el historial con éxito!");
  };

  const deleteHistoryEntry = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem("totalplay_report_history", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("totalplay_report_history");
  };

  const selectHistoryEntry = (entry: HistoryEntry) => {
    setReportData(entry.data);
    setHasData(true);
  };

  // Utility to convert File to Base64
  const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const commaIndex = result.indexOf(",");
        const base64 = result.substring(commaIndex + 1);
        resolve({ base64, mimeType: file.type });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Process files upload (capturas de pantalla)
  const handleFilesSelect = async (files: File[]) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // Map all files to base64 promises
      const base64Promises = files.map(async (file) => {
        const { base64, mimeType } = await fileToBase64(file);
        return { data: base64, mimeType };
      });
      const imagesData = await Promise.all(base64Promises);

      const response = await fetch("/api/process-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: imagesData }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Ocurrió un error al procesar con el servidor.");
      }

      const result = await response.json();
      
      // Map server response to our expected local schema
      const mappedReport: ReportData = {
        orderType: result.orderType || "instalacion",
        fecha: result.fecha || reportData.fecha,
        tecnico: result.tecnico || "MARIO ISMAEL TEUTLI MARCELINO",
        gaffete: result.gaffete || "MEGE3PUET0498",
        os: result.os || "",
        cuenta: result.cuenta || "",
        nombre: result.nombre || "",
        cta: result.cta || "",
        sp: result.sp || "",
        pto: result.pto || "",
        candado: result.candado || "Sin candado",
        ubicacion: result.ubicacion || "",
        equipos: (result.equipos || []).map((eq: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          cantidad: eq.cantidad || "1",
          unidad: eq.unidad || "PZA",
          descripcion: eq.descripcion || "",
          especificaciones: eq.especificaciones || "",
          mac: eq.mac || "",
        })),
        fallaReportada: result.fallaReportada || "",
        solucion: result.solucion || "",
        distritoNodo: result.distritoNodo || "",
        estatusPlanta: result.estatusPlanta || "",
        pruebasVelocidad: result.pruebasVelocidad !== undefined ? result.pruebasVelocidad : reportData.pruebasVelocidad,
        script: "", // will be calculated below
      };

      // Generate script
      mappedReport.script = generateWhatsappScript(mappedReport);

      setReportData(mappedReport);
      setHasData(true);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Error al procesar las imágenes de Field Cloud.");
    } finally {
      setIsLoading(false);
    }
  };

  // Process text pasted
  const handleTextPaste = async (pastedText: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/process-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pastedText }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Ocurrió un error al procesar el texto.");
      }

      const result = await response.json();

      const mappedReport: ReportData = {
        orderType: result.orderType || "instalacion",
        fecha: result.fecha || reportData.fecha,
        tecnico: result.tecnico || "MARIO ISMAEL TEUTLI MARCELINO",
        gaffete: result.gaffete || "MEGE3PUET0498",
        os: result.os || "",
        cuenta: result.cuenta || "",
        nombre: result.nombre || "",
        cta: result.cta || "",
        sp: result.sp || "",
        pto: result.pto || "",
        candado: result.candado || "Sin candado",
        ubicacion: result.ubicacion || "",
        equipos: (result.equipos || []).map((eq: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          cantidad: eq.cantidad || "1",
          unidad: eq.unidad || "PZA",
          descripcion: eq.descripcion || "",
          especificaciones: eq.especificaciones || "",
          mac: eq.mac || "",
        })),
        fallaReportada: result.fallaReportada || "",
        solucion: result.solucion || "",
        distritoNodo: result.distritoNodo || "",
        estatusPlanta: result.estatusPlanta || "",
        pruebasVelocidad: result.pruebasVelocidad !== undefined ? result.pruebasVelocidad : reportData.pruebasVelocidad,
        script: "",
      };

      mappedReport.script = generateWhatsappScript(mappedReport);

      setReportData(mappedReport);
      setHasData(true);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Error al procesar el texto provisto.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportDataChange = (updated: ReportData) => {
    const updatedWithScript = {
      ...updated,
      script: generateWhatsappScript(updated),
    };
    setReportData(updatedWithScript);
    setHasData(true);
  };

  const createBlankReport = (type: OrderType) => {
    const blank = BLANK_REPORT(type);
    blank.script = generateWhatsappScript(blank);
    setReportData(blank);
    setHasData(true);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 selection:bg-[#e30613]/30">
      {/* Background radial effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#e30613]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-red-950/40 text-white font-bold tracking-wider flex items-center justify-center">
              TP
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                Asistente de Reportes Totalplay
                <span className="text-[9px] bg-red-600/20 text-primary border border-red-500/30 font-medium px-1.5 py-0.5 rounded-full uppercase">
                  AI Beta
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">Automatización de Reportes de Fibra Óptica</p>
            </div>
          </div>
          <button onClick={() => setShowProfile(true)} className="text-slate-400 hover:text-white transition-colors">
            <Settings className="w-6 h-6" />
          </button>

          <div className="hidden sm:flex items-center gap-3 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-850">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-right">
              <p className="text-[10px] font-semibold text-slate-300">MARIO ISMAEL TEUTLI</p>
              <p className="text-[9px] font-mono text-slate-500">ID: MEGE3PUET0498</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        
        {/* Loading Spinner / HUD Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-6">
            <div className="relative flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-slate-850 border-t-primary animate-spin" />
              <Sparkles className="w-6 h-6 text-primary absolute animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-white">Analizando con Inteligencia Artificial...</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-sm">
              Extrayendo detalles de Field Cloud, configurando materiales, identificando el tipo de orden y estructurando la plantilla.
            </p>
          </div>
        )}

        {/* Info Banner / Guide */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 space-y-1">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> ¿Cómo funciona este asistente?
            </h3>
            <p className="text-xs text-slate-400">
              Carga una captura de pantalla de tu aplicación <strong>Field Cloud</strong> o pega los textos de instalación. 
              Nuestra IA de Google Gemini reconocerá automáticamente el tipo de orden, el cliente, 
              las redes y los materiales, y construirá la plantilla lista para WhatsApp.
            </p>
          </div>

          <div className="md:col-span-4 flex justify-end gap-2 flex-wrap md:flex-nowrap">
            <button
              onClick={() => createBlankReport("instalacion")}
              className="text-xs bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center"
            >
              <PlusCircle className="w-4 h-4 text-primary" />
              Nueva Inst.
            </button>
            <button
              onClick={() => createBlankReport("soporte")}
              className="text-xs bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center"
            >
              <PlusCircle className="w-4 h-4 text-accent" />
              Nuevo Soporte
            </button>
          </div>
        </div>

        {/* Error Alert Display */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-xs flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Ocurrió un error:</span> {errorMessage}
              <p className="mt-1 text-slate-500">Puedes intentar cargando la imagen nuevamente o rellenar de forma manual usando el botón de arriba.</p>
            </div>
          </div>
        )}

        {/* Step 1: Evidences Upload */}
        <FileUpload
          onFilesSelect={handleFilesSelect}
          onTextPaste={handleTextPaste}
          isLoading={isLoading}
        />

        {/* Steps 2 & 3 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Active form column */}
          <div className="lg:col-span-7 h-full">
            <ReportForm
              data={reportData}
              onChange={handleReportDataChange}
            />
          </div>

          {/* Formatted Script & History column */}
          <div className="lg:col-span-5 space-y-6 h-full">
            <FormattedScriptDisplay
              script={reportData.script}
              onScriptChange={(newScript) => handleReportDataChange({ ...reportData, script: newScript })}
              onSaveToHistory={saveToHistory}
              hasData={hasData}
            />

            <HistoryList
              entries={history}
              onSelectEntry={selectHistoryEntry}
              onDeleteEntry={deleteHistoryEntry}
              onClearHistory={clearHistory}
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-850 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4">
          <p>Totalplay - Automatización de Reportes Técnicos para Técnicos Móviles</p>
          <p className="mt-1 text-slate-700">Integración autorizada con Google Gemini AI y Field Cloud.</p>
        </div>
      </footer>
      <InstallBanner deferredPrompt={deferredPrompt} onClose={() => setDeferredPrompt(null)} />
      {showProfile && <ProfileSettings onClose={() => setShowProfile(false)} />}
    </div>
  );
}
