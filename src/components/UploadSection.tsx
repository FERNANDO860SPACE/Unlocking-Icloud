import React, { useRef, useState } from "react";
import { Camera, UploadCloud, X, Sparkles, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { SAMPLE_PRODUCTS } from "../sampleData";

interface UploadSectionProps {
  uploadedImageBase64: string | null;
  isAnalyzing: boolean;
  canAnalyze: boolean;
  calculatorValidationError?: string | null;
  onImageSelected: (base64: string, productName?: string, productCategory?: string) => void;
  onAnalyze: () => void;
  onClearImage: () => void;
}

export function UploadSection({
  uploadedImageBase64,
  isAnalyzing,
  canAnalyze,
  calculatorValidationError,
  onImageSelected,
  onAnalyze,
  onClearImage,
}: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFile(file);
  };

  const readFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onImageSelected(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <Camera className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white">📷 Imagem do Produto</h2>
        </div>

        {uploadedImageBase64 && (
          <button
            type="button"
            onClick={onClearImage}
            disabled={isAnalyzing}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
            Remover imagem
          </button>
        )}
      </div>

      <div
        id="uploadBox"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploadedImageBase64 && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-6 transition-all text-center ${
          isDragOver
            ? "border-cyan-400 bg-cyan-950/30 scale-[1.01]"
            : uploadedImageBase64
            ? "border-slate-700 bg-slate-950/60"
            : "border-slate-700 hover:border-cyan-500/70 bg-slate-950/40 hover:bg-slate-950 cursor-pointer"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="imageInput"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />

        {uploadedImageBase64 ? (
          <div id="previewContainer" className="flex flex-col items-center justify-center gap-3">
            <div className="relative group max-w-sm rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-black/50">
              <img
                id="previewImage"
                src={uploadedImageBase64}
                alt="Pré-visualização do Produto"
                className="max-h-64 sm:max-h-72 w-auto object-contain mx-auto"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  Trocar imagem
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Imagem pronta para leitura multimodal com Gemini 2.0+
            </p>
          </div>
        ) : (
          <div className="py-6 sm:py-8 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                📎 Clique ou solte a imagem aqui
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Suporta fotos de produtos em JPG, PNG, WEBP
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick sample products */}
      {!uploadedImageBase64 && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            Ou teste agora com um produto de exemplo:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SAMPLE_PRODUCTS.map((prod) => (
              <button
                key={prod.id}
                type="button"
                onClick={() => onImageSelected(prod.dataUrl, prod.name, prod.category)}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/50 text-left transition-all cursor-pointer group"
              >
                <img
                  src={prod.dataUrl}
                  alt={prod.name}
                  className="w-9 h-9 rounded-lg object-cover border border-slate-700 group-hover:scale-105 transition-transform"
                />
                <div className="overflow-hidden">
                  <span className="block text-xs font-semibold text-slate-300 truncate group-hover:text-cyan-300">
                    {prod.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 truncate">
                    {prod.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Analyze Button */}
      <div className="mt-4">
        <button
          id="analyzeBtn"
          type="button"
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
            isAnalyzing
              ? "bg-cyan-600/80 text-white cursor-wait"
              : canAnalyze
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 active:scale-[0.99] shadow-cyan-500/20 font-extrabold"
              : "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>⏳ Analisando com IA...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>🔍 Analisar com IA</span>
            </>
          )}
        </button>
        {calculatorValidationError && uploadedImageBase64 && (
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-950/60 border border-rose-800/60 text-[11px] text-rose-300 mt-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{calculatorValidationError}</span>
          </div>
        )}
        {!uploadedImageBase64 && (
          <p className="text-[11px] text-center text-slate-400 mt-2">
            Carregue uma imagem ou clique em um produto de exemplo para habilitar a análise.
          </p>
        )}
      </div>
    </section>
  );
}
