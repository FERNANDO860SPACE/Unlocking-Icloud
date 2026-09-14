import { useState } from "react";
import { Sparkles, Copy, Check, Eye, Download, Users, PackageCheck, UserCheck, Layers } from "lucide-react";
import { ImageVariation } from "../types";
import { getPeopleUsingProductImages } from "../lifestyleImages";

interface ImagesSectionProps {
  variations: ImageVariation[];
  baseImage: string | null;
  productTitle?: string;
  productCategory?: string;
}

const FILTER_STYLES: Record<number, { name: string; filter: string; bg: string }> = {
  1: {
    name: "Estúdio Fundo Branco Puro",
    filter: "brightness(1.08) contrast(1.05) saturate(1.02)",
    bg: "bg-white",
  },
  2: {
    name: "Lifestyle Luz Quente Natural",
    filter: "sepia(0.12) contrast(1.04) brightness(1.02) saturate(1.15)",
    bg: "bg-amber-950/20",
  },
  3: {
    name: "Macro / Nitidez Texturas",
    filter: "contrast(1.18) saturate(1.1) brightness(0.98)",
    bg: "bg-slate-950",
  },
  4: {
    name: "Estilo Editorial / Minimalista",
    filter: "contrast(1.05) brightness(1.04) saturate(0.9)",
    bg: "bg-slate-900",
  },
};

const HUMAN_INTERACTION_LABELS: Record<number, string> = {
  1: "👤 Modelo em Uso Principal",
  2: "🏃‍♂️ Uso em Rotina e Ação",
  3: "✋ Mãos em Manuseio e Ergonomia",
  4: "👥 Experiência e Convívio Social",
};

export function ImagesSection({
  variations,
  baseImage,
  productTitle = "",
  productCategory = "",
}: ImagesSectionProps) {
  const [displayMode, setDisplayMode] = useState<"people" | "product">("people");
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);
  const [previewModal, setPreviewModal] = useState<{
    image: string;
    title: string;
    prompt?: string;
    isPersonPhoto: boolean;
  } | null>(null);

  const copyPrompt = (prompt: string, id: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get dynamic lifestyle photos of real people using the product
  const peopleImages = getPeopleUsingProductImages(
    `${productTitle} ${productCategory}`
  );

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                🖼️ 4 Variações com Pessoas Usando o Produto
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                Pessoas Reais
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Fotos comerciais de alta conversão com pessoas reais interagindo, vestindo, segurando e usando o produto.
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setDisplayMode("people")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              displayMode === "people"
                ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Pessoas Usando (Lifestyle)</span>
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode("product")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              displayMode === "product"
                ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Produto Isolado</span>
          </button>
        </div>
      </div>

      <div id="generatedImages" className="images-grid mt-4">
        {!baseImage || variations.length === 0 ? (
          <div className="p-10 rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 text-center space-y-2">
            <div className="inline-flex p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-500">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Aguardando envio da imagem para gerar as fotos com pessoas usando o produto...
            </p>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              A IA analisará seu produto e estruturará 4 variações fotográficas completas com modelos reais em uso diário, rotina dinâmica e ergonomia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {variations.slice(0, 4).map((v, index) => {
              const filterConfig = FILTER_STYLES[v.id || index + 1] || FILTER_STYLES[1];
              const personImg = peopleImages[index % peopleImages.length];
              const activeImage = displayMode === "people" ? personImg : baseImage;
              const interactionLabel =
                HUMAN_INTERACTION_LABELS[v.id || index + 1] || "👤 Pessoa em Uso Real";

              return (
                <div
                  key={v.id || index}
                  className="image-card bg-slate-950 border border-slate-800 hover:border-cyan-500/60 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 group shadow-md"
                >
                  <div className="p-3 pb-0">
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/40 truncate max-w-[150px]">
                        #{index + 1} {v.estilo || `Variação ${index + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewModal({
                            image: activeImage,
                            title: v.titulo,
                            prompt: v.prompt_sugerido,
                            isPersonPhoto: displayMode === "people",
                          })
                        }
                        className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Ampliar foto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                      {displayMode === "people" ? (
                        <>
                          <img
                            src={personImg}
                            alt={`Pessoa usando o produto - ${v.titulo}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Mini floating preview of the product uploaded */}
                          {baseImage && (
                            <div
                              className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md p-1 rounded-md border border-slate-700/60 flex items-center gap-1 shadow-md"
                              title="Produto Original Integrado"
                            >
                              <img
                                src={baseImage}
                                alt="Produto"
                                className="w-6 h-6 object-contain rounded bg-black/40"
                              />
                              <span className="text-[9px] text-slate-300 pr-1 font-medium hidden sm:inline">
                                Produto
                              </span>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/75 text-[9px] text-cyan-300 backdrop-blur-xs font-semibold border border-cyan-900/50">
                            Foto com Pessoa
                          </div>
                        </>
                      ) : (
                        <img
                          src={baseImage}
                          alt={`Produto isolado - ${v.titulo}`}
                          style={{ filter: filterConfig.filter }}
                          className="max-h-full max-w-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1 gap-2.5">
                    <div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mb-1">
                        <span>{interactionLabel}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 leading-snug line-clamp-2">
                        {v.titulo}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-3">
                        {v.descricao}
                      </p>
                    </div>

                    {v.prompt_sugerido && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => copyPrompt(v.prompt_sugerido!, v.id || index)}
                          className="w-full py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-800 text-[10px] font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedPromptId === (v.id || index) ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Prompt Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-cyan-400" />
                              <span>Copiar Prompt (Pessoa Usando)</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Resolution Preview Modal */}
      {previewModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewModal(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                    {previewModal.isPersonPhoto ? "Pessoa Usando o Produto" : "Produto Isolado"}
                  </span>
                  <h3 className="text-sm font-bold text-white">{previewModal.title}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Fotografia comercial otimizada para anúncios de alta conversão
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 rounded-xl p-2 flex items-center justify-center border border-slate-800 max-h-96 overflow-hidden">
              <img
                src={previewModal.image}
                alt={previewModal.title}
                className="max-h-90 w-full object-contain rounded-lg"
              />
            </div>

            {previewModal.prompt && (
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Prompt para Geradores de Imagem (Midjourney / Flux / Imagen / Leonardo):
                  </span>
                  <button
                    type="button"
                    onClick={() => copyPrompt(previewModal.prompt!, 999)}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    {copiedPromptId === 999 ? "Copiado!" : "Copiar"}
                  </button>
                </div>
                <p className="text-xs font-mono text-slate-400 bg-slate-900/80 p-2.5 rounded-lg select-all leading-relaxed">
                  {previewModal.prompt}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => downloadImage(previewModal.image, "produto-pessoa-usando.jpg")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition-colors cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar Foto em Alta Resolução
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
