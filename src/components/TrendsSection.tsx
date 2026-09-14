import { useState } from "react";
import { Flame, RefreshCw, ArrowUpRight, TrendingUp, Sparkles, ShoppingCart } from "lucide-react";
import { TrendingItem } from "../types";

interface TrendsSectionProps {
  trends: TrendingItem[];
  isLoading: boolean;
  onRefreshTrends: () => void;
  onSelectTrendProduct?: (name: string, category: string) => void;
}

export function TrendsSection({
  trends,
  isLoading,
  onRefreshTrends,
  onSelectTrendProduct,
}: TrendsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(trends.map((t) => t.category)))];

  const filteredTrends =
    selectedCategory === "all"
      ? trends
      : trends.filter((t) => t.category === selectedCategory);

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-950 text-orange-400 border border-orange-800/40">
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              🔥 Produtos Mais Procurados — Tempo Real
            </h2>
            <p className="text-xs text-slate-400">
              Varredura de volume de buscas e intenção de compra em e-commerce
            </p>
          </div>
        </div>

        <button
          id="refreshTrendsBtn"
          type="button"
          onClick={onRefreshTrends}
          disabled={isLoading}
          className="btn secondary-btn inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-semibold text-cyan-300 border border-slate-700 transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
          <span>{isLoading ? "Varredura em andamento..." : "🔄 Atualizar Varredura"}</span>
        </button>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 text-xs">
        <span className="text-slate-400 text-[11px] whitespace-nowrap mr-1">Filtrar:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-cyan-950 border border-cyan-600 text-cyan-300"
                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {cat === "all" ? "Todos os Nichos" : cat}
          </button>
        ))}
      </div>

      <div id="trendsContent" className="space-y-2.5">
        {isLoading ? (
          <div className="loading p-8 rounded-xl border border-dashed border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center gap-2.5">
            <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
            <p className="text-xs text-slate-300 font-medium">
              Consultando inteligência de mercado com Gemini 2.0+...
            </p>
            <span className="text-[10px] text-slate-400">
              Mapeando nichos virais, ticket médio e volume de busca
            </span>
          </div>
        ) : filteredTrends.length === 0 ? (
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 text-center text-xs text-slate-400">
            Nenhum produto encontrado nesta categoria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredTrends.map((p) => (
              <div
                key={p.rank}
                className="trend-item p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-800/60 transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="rank flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 font-extrabold text-xs shrink-0 group-hover:border-cyan-500/50">
                    #{p.rank}
                  </span>
                  <div className="trend-info min-w-0">
                    <strong className="block text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                      {p.name}
                    </strong>
                    <div className="flex items-center gap-2 mt-1">
                      <small className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {p.category}
                      </small>
                      {p.avgPrice && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          Méd: {p.avgPrice}
                        </span>
                      )}
                      {p.competition && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded ${
                            p.competition.toLowerCase().includes("baixa")
                              ? "text-emerald-400 bg-emerald-950/40"
                              : p.competition.toLowerCase().includes("alta")
                              ? "text-rose-400 bg-rose-950/40"
                              : "text-amber-400 bg-amber-950/40"
                          }`}
                        >
                          {p.competition} concorrência
                        </span>
                      )}
                    </div>
                    {p.growthReason && (
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                        💡 {p.growthReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="trend-up inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-950/70 border border-emerald-700/60 text-emerald-400 font-mono">
                    <TrendingUp className="w-3 h-3" />
                    {p.trend}
                  </span>
                  {onSelectTrendProduct && (
                    <button
                      type="button"
                      onClick={() => onSelectTrendProduct(p.name, p.category)}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Analisar Nicho</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
