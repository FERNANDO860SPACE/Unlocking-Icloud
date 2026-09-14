import { useState } from "react";
import { KeyRound, Check, ShieldCheck, Eye, EyeOff } from "lucide-react";

interface ApiKeySectionProps {
  apiKey: string;
  serverHasKey: boolean;
  onSaveKey: (key: string) => void;
}

export function ApiKeySection({ apiKey, serverHasKey, onSaveKey }: ApiKeySectionProps) {
  const [inputVal, setInputVal] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onSaveKey(inputVal.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              🔑 Chave API do Gemini
            </h2>
          </div>
        </div>

        {serverHasKey && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/70 text-emerald-300 border border-emerald-700/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            Chave do Sistema Ativa
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400 mb-3">
        {serverHasKey
          ? "Uma chave Gemini do servidor já está conectada automaticamente. Você também pode inserir uma chave personalizada abaixo se desejar."
          : "Insira sua chave gratuita do Google AI Studio para analisar imagens de produtos com IA."}
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <input
            type={showKey ? "text" : "password"}
            id="apiKey"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              serverHasKey
                ? "Chave do servidor ativa (ou cole sua chave própria)..."
                : "Cole sua chave aqui (aistudio.google.com)..."
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            title={showKey ? "Ocultar chave" : "Mostrar chave"}
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <button
          id="saveKeyBtn"
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 active:scale-95 transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-slate-950" />
              <span>✅ Salvo!</span>
            </>
          ) : (
            <span>Salvar</span>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400">
        <span className="hint">Sua chave fica salva apenas no seu navegador</span>
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
        >
          Obter chave grátis no AI Studio ↗
        </a>
      </div>
    </section>
  );
}
