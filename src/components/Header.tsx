import { useState } from "react";
import { Sparkles, ShoppingBag, Zap, Monitor, Copy, Check, X, Chrome } from "lucide-react";

interface HeaderProps {
  hasApiKey: boolean;
}

export function Header({ hasApiKey }: HeaderProps) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const nativefierCmd = `npm install -g nativefier\nnativefier --name "Produto IA" "https://ais-pre-ebt6ohjqixjzzsoipcot7k-251872156946.us-east5.run.app"`;

  const manifestCode = `{
  "manifest_version": 3,
  "name": "Produto IA — Gerador Completo",
  "version": "2.0.0",
  "description": "Lê imagem → gera título, descrição, imagens, especificações, calculadora + tendências.",
  "permissions": ["storage"],
  "host_permissions": ["https://generativelanguage.googleapis.com/*"],
  "action": { "default_popup": "standalone.html" }
}`;

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-bold">
            <ShoppingBag className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-1.5 font-display">
                <span>🛒 Produto IA</span>
                <span className="text-cyan-400 font-normal text-sm sm:text-base">— Gerador Completo</span>
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                v2.0.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Leia imagem → Crie conteúdo → Veja tendências em tempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            <span>Extensão & Desktop</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                hasApiKey ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="font-medium">
              {hasApiKey ? "IA Pronta para Análise" : "Aguardando Chave API"}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-950/50 border border-cyan-800/50 text-cyan-300">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Marketplaces BR & Global</span>
          </div>
        </div>
      </div>

      {/* Export & Desktop Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Empacotar para Extensão ou Desktop</h3>
                  <p className="text-xs text-slate-400">Instruções para Chrome Extension (Manifest V3) e Desktop com Nativefier</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nativefier section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5" />
                  1. Gerar Aplicativo Desktop (.exe / .app / Linux) via Nativefier
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(nativefierCmd, "nativefier")}
                  className="text-xs flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded border border-slate-700 cursor-pointer"
                >
                  {copiedSection === "nativefier" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar comando</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto select-all">
                {nativefierCmd}
              </pre>
            </div>

            {/* Chrome Extension Manifest section */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Chrome className="w-3.5 h-3.5" />
                  2. Manifesto da Extensão Chrome (Manifest V3)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(manifestCode, "manifest")}
                  className="text-xs flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded border border-slate-700 cursor-pointer"
                >
                  {copiedSection === "manifest" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar manifest.json</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-40 select-all">
                {manifestCode}
              </pre>
              <p className="text-[11px] text-slate-400">
                O arquivo <code className="text-cyan-400 font-mono">standalone.html</code> independente já foi gerado na pasta pública com suporte offline/local e chave salva no navegador!
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
