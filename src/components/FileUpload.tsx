import React, { useState, useRef, useEffect } from "react";
import { Upload, Image as ImageIcon, FileText, X, Plus, Sparkles, Trash2 } from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
}

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  onTextPaste: (text: string) => void;
  isLoading: boolean;
}

export default function FileUpload({ onFilesSelect, onTextPaste, isLoading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  const processFiles = (newFiles: File[]) => {
    const validFiles: UploadedFile[] = [];
    let limitReached = false;

    for (const file of newFiles) {
      if (!file.type.startsWith("image/")) {
        alert(`El archivo "${file.name}" no es una imagen de captura de pantalla válida.`);
        continue;
      }
      
      if (uploadedFiles.length + validFiles.length >= 10) {
        limitReached = true;
        break;
      }

      validFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
      });
    }

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
    }

    if (limitReached) {
      alert("Se ha alcanzado el límite máximo de 10 imágenes.");
    }

    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (id: string) => {
    const fileToRemove = uploadedFiles.find((f) => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAll = () => {
    uploadedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    setUploadedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pasteText.trim()) {
      onTextPaste(pasteText);
    }
  };

  const handleProcessImages = () => {
    if (uploadedFiles.length > 0) {
      onFilesSelect(uploadedFiles.map((f) => f.file));
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-800/60">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#e30613]" />
            Cargar Evidencia (Field Cloud)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Puedes cargar hasta 10 capturas de pantalla para ser procesadas en conjunto.
          </p>
        </div>
        
        {uploadedFiles.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={isLoading}
            className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 bg-red-950/20 border border-red-900/30 px-3 py-1.5 rounded-lg disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpiar todo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Images Selection & Grid Area (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />

          {uploadedFiles.length === 0 ? (
            /* Dropzone when empty */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isLoading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer min-h-[260px] transition-all duration-300 ${
                isDragging
                  ? "border-[#e30613] bg-red-950/20"
                  : "border-slate-800 hover:border-slate-700 bg-slate-950/50 hover:bg-slate-950"
              } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="bg-slate-900 p-4 rounded-full text-[#e30613] mb-4 shadow-inner">
                <ImageIcon className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium text-slate-200">
                Arrastra aquí tus capturas de Field Cloud
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Soporta cargar hasta 10 imágenes a la vez (PNG, JPG, JPEG)
              </p>
              <button
                type="button"
                className="mt-4 bg-[#e30613] hover:bg-[#b8050f] text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors shadow-md"
              >
                Seleccionar archivos
              </button>
            </div>
          ) : (
            /* Grid with uploaded images and "+" card */
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>Imágenes cargadas</span>
                <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                  {uploadedFiles.length} de 10
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {uploadedFiles.map((fileObj, idx) => (
                  <div
                    key={fileObj.id}
                    className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center"
                  >
                    <img
                      src={fileObj.preview}
                      alt={`Captura ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Index Badge */}
                    <div className="absolute top-1.5 left-1.5 bg-black/75 border border-slate-700 text-[10px] font-bold text-slate-300 px-1.5 py-0.5 rounded min-w-[18px] text-center">
                      {idx + 1}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveFile(fileObj.id)}
                      disabled={isLoading}
                      className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
                      title="Quitar imagen"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Hover detail overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1 text-[9px] text-slate-300 text-center truncate pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      {fileObj.file.name}
                    </div>
                  </div>
                ))}

                {uploadedFiles.length < 10 && (
                  /* "Add More" Button Card inside the grid */
                  <button
                    type="button"
                    onClick={() => !isLoading && fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="aspect-[4/3] rounded-lg border border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/80 flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 transition-all group disabled:opacity-40"
                  >
                    <Plus className="w-6 h-6 text-[#e30613] mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium uppercase tracking-wider">Añadir más</span>
                  </button>
                )}
              </div>

              {/* Action Button to process the selected images */}
              <button
                type="button"
                onClick={handleProcessImages}
                disabled={isLoading || uploadedFiles.length === 0}
                className="w-full bg-[#e30613] hover:bg-[#b8050f] text-white font-medium text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-red-900/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Analizando {uploadedFiles.length} {uploadedFiles.length === 1 ? "captura" : "capturas"} con IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Procesar {uploadedFiles.length} {uploadedFiles.length === 1 ? "captura" : "capturas"} de Field Cloud</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Text Paste Area (5 cols) */}
        <div className="lg:col-span-5 h-full">
          <form onSubmit={handlePasteSubmit} className="flex flex-col h-full bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Texto Copiado de Field Cloud</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Opcionalmente, puedes pegar aquí texto sin procesar si prefieres no subir capturas.
            </p>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              disabled={isLoading}
              placeholder="Pega aquí los datos, lista de materiales o texto sin procesar..."
              className="w-full h-36 lg:h-48 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 text-xs font-mono resize-none"
            />
            <button
              type="submit"
              disabled={isLoading || !pasteText.trim()}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs py-2 px-3 rounded-lg shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              Procesar Texto Copiado
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
