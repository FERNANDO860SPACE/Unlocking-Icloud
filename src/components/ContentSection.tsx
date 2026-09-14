import { useState } from "react";
import { FileText, Copy, Check, Share2, Tag } from "lucide-react";

interface ContentSectionProps {
  title: string;
  description: string;
  subtitle?: string;
  category?: string;
  keywords?: string[];
  onChangeTitle: (val: string) => void;
  onChangeDescription: (val: string) => void;
}

export function ContentSection({
  title,
  description,
  subtitle,
  category,
  keywords,
  onChangeTitle,
  onChangeDescription,
}: ContentSectionProps) {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyToClipboard = async (text: string, type: "title" | "desc" | "all") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "title") {
        setCopiedTitle(true);
        setTimeout(() => setCopiedTitle(false), 2000);
      } else if (type === "desc") {
        setCopiedDesc(true);
        setTimeout(() => setCopiedDesc(false), 2000);
      } else {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const titleLength = title.length;

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">📝 Conteúdo Gerado</h2>
            {category && (
              <span className="text-[11px] text-cyan-400 font-medium">
                Categoria sugerida: {category}
              </span>
            )}
          </div>
        </div>

        {title && description && (
          <button
            type="button"
            onClick={() =>
              copyToClipboard(
                `${title}\n\n${subtitle ? subtitle + "\n\n" : ""}${description}`,
                "all"
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Anúncio Completo Copiado</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copiar Anúncio Completo</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Subtitle if available */}
        {subtitle && (
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200">
            <strong className="text-cyan-300">Frase de Destaque:</strong> {subtitle}
          </div>
        )}

        {/* Product Title */}
        <div className="form-group">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="productTitle" className="text-xs font-semibold text-slate-300">
              Título do Produto (Otimizado para Busca & SEO):
            </label>
            <div className="flex items-center gap-3">
              <span
                className={`text-[11px] font-mono ${
                  titleLength > 70
                    ? "text-amber-400"
                    : titleLength > 0
                    ? "text-emerald-400"
                    : "text-slate-400"
                }`}
              >
                {titleLength}/70 caracteres
              </span>
              {title && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(title, "title")}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedTitle ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTitle ? "Copiado!" : "Copiar"}</span>
                </button>
              )}
            </div>
          </div>
          <input
            type="text"
            id="productTitle"
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="Título gerado pela IA..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium"
          />
        </div>

        {/* Product Description */}
        <div className="form-group">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="productDesc" className="text-xs font-semibold text-slate-300">
              Descrição do Produto (Copywriting Persuasivo):
            </label>
            {description && (
              <button
                type="button"
                onClick={() => copyToClipboard(description, "desc")}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedDesc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDesc ? "Copiado!" : "Copiar"}</span>
              </button>
            )}
          </div>
          <textarea
            id="productDesc"
            rows={6}
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
            placeholder="Descrição gerada pela IA..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 leading-relaxed font-mono text-xs sm:text-sm"
          />
        </div>

        {/* SEO Keywords tags */}
        {keywords && keywords.length > 0 && (
          <div>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-2">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              Tags de Busca Recomendadas (Marketplaces):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:border-cyan-700/50 transition-colors"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
