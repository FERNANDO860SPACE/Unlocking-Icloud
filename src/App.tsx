import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ApiKeySection } from "./components/ApiKeySection";
import { UploadSection } from "./components/UploadSection";
import { ContentSection } from "./components/ContentSection";
import { ImagesSection } from "./components/ImagesSection";
import { SpecsSection } from "./components/SpecsSection";
import { CalculatorSection, validateCalculatorFields } from "./components/CalculatorSection";
import { TrendsSection } from "./components/TrendsSection";
import { INITIAL_TRENDS, DEFAULT_PRODUCT_VARIATIONS } from "./sampleData";
import { ProductAnalysis, ProductSpec, TrendingItem } from "./types";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function App() {
  // API Key management (persisted in localStorage like chrome.storage.local)
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("geminiApiKey") || "";
  });
  const [serverHasKey, setServerHasKey] = useState<boolean>(true);

  // Image Upload state
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pricing & Profit Calculator state with validation
  const [costPrice, setCostPrice] = useState<string>("35.00");
  const [profitPercent, setProfitPercent] = useState<string>("30");
  const [taxPercent, setTaxPercent] = useState<string>("12");
  const [calculatorValidationError, setCalculatorValidationError] = useState<string | null>(null);

  // Generated Content state
  const [productTitle, setProductTitle] = useState<string>("");
  const [productDesc, setProductDesc] = useState<string>("");
  const [productSubtitle, setProductSubtitle] = useState<string>("");
  const [productCategory, setProductCategory] = useState<string>("");
  const [productKeywords, setProductKeywords] = useState<string[]>([]);
  const [specs, setSpecs] = useState<ProductSpec[]>([]);
  const [variations, setVariations] = useState<any[]>([]);
  const [suggestedCost, setSuggestedCost] = useState<number>(35.0);
  const [suggestedSale, setSuggestedSale] = useState<number>(89.9);

  // Real-time Trends state
  const [trends, setTrends] = useState<TrendingItem[]>(INITIAL_TRENDS);
  const [isRefreshingTrends, setIsRefreshingTrends] = useState<boolean>(false);

  // Check server health and API key availability
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasApiKey === "boolean") {
          setServerHasKey(data.hasApiKey);
        }
      })
      .catch((err) => {
        console.error("Health check error:", err);
      });
  }, []);

  // Save API key handler
  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("geminiApiKey", key);
    setSuccessMessage("Chave API salva com sucesso no navegador!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Image selection handler
  const handleImageSelected = (base64: string, optName?: string, optCat?: string) => {
    setUploadedImageBase64(base64);
    if (optName && !productTitle) {
      setProductTitle(optName);
    }
    if (optCat && !productCategory) {
      setProductCategory(optCat);
    }
    // Pre-populate 4 variations with people using product if none exist yet
    if (variations.length === 0) {
      setVariations(DEFAULT_PRODUCT_VARIATIONS);
    }
    setErrorMessage(null);
  };

  // Clear image handler
  const handleClearImage = () => {
    setUploadedImageBase64(null);
    setErrorMessage(null);
  };

  // Calculator validation status
  const currentCalcValidation = validateCalculatorFields(costPrice, profitPercent, taxPercent);

  // Analyze Product with Gemini
  const handleAnalyze = async () => {
    // 1. Validate calculator inputs first and prevent analysis if invalid
    const calcValidation = validateCalculatorFields(costPrice, profitPercent, taxPercent);
    if (!calcValidation.valid) {
      const errorText = calcValidation.error || "Por favor, preencha os campos da calculadora de preços corretamente.";
      setCalculatorValidationError(errorText);
      setErrorMessage(errorText);
      const calcEl = document.getElementById("costPrice");
      if (calcEl) {
        calcEl.scrollIntoView({ behavior: "smooth", block: "center" });
        calcEl.focus();
      }
      return;
    }

    setCalculatorValidationError(null);

    if (!uploadedImageBase64) {
      setErrorMessage("Por favor, selecione ou faça o upload de uma imagem!");
      return;
    }

    if (!serverHasKey && !apiKey.trim()) {
      setErrorMessage("Por favor, informe sua chave API do Gemini no campo acima.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      // Specifically request 4 image variations from the Gemini API
      const response = await fetch("/api/analyze-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: uploadedImageBase64,
          customApiKey: apiKey.trim() || undefined,
          numVariations: 4,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Falha ao processar imagem com IA.");
      }

      const result: ProductAnalysis = data.data;

      // Populate Title and Description
      setProductTitle(result.titulo || "");
      setProductDesc(result.descricao || "");
      setProductSubtitle(result.subtitulo || "");
      setProductCategory(result.categoria || "");
      setProductKeywords(result.palavras_chave || []);

      // Populate Specs
      if (Array.isArray(result.especificacoes)) {
        setSpecs(result.especificacoes);
      }

      // Populate exactly 4 Variations
      if (Array.isArray(result.variacoes)) {
        setVariations(result.variacoes.slice(0, 4));
      }

      // Update pricing benchmarks
      if (result.preco_sugerido) {
        setSuggestedSale(result.preco_sugerido);
      }
      if (result.custo_estimado) {
        setSuggestedCost(result.custo_estimado);
        setCostPrice(result.custo_estimado.toFixed(2));
      }

      setSuccessMessage("Análise e criação de conteúdo concluídas com sucesso!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error("Erro na análise:", err);
      let msg =
        err.message ||
        "Não foi possível completar a análise. Verifique sua chave API ou tente novamente.";
      try {
        const parsed = JSON.parse(msg);
        if (parsed?.error?.message) {
          msg = parsed.error.message;
        }
      } catch {
        // Not JSON
      }
      if (
        msg.includes("503") ||
        msg.includes("UNAVAILABLE") ||
        msg.includes("high demand")
      ) {
        msg =
          "Os servidores do modelo de IA estão com alta demanda temporária no momento. O sistema tentou modelos alternativos automaticamente. Por favor, aguarde alguns segundos e clique novamente em 'Analisar e Gerar Conteúdo'.";
      }
      setErrorMessage(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Refresh Trends with Gemini
  const handleRefreshTrends = async () => {
    setIsRefreshingTrends(true);
    try {
      const res = await fetch("/api/trends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customApiKey: apiKey.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.trends && Array.isArray(data.trends) && data.trends.length > 0) {
        setTrends(data.trends);
        setSuccessMessage("Varredura de tendências atualizada em tempo real!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error("Erro ao atualizar tendências:", err);
    } finally {
      setIsRefreshingTrends(false);
    }
  };

  // When clicking a trending product to analyze niche
  const handleSelectTrendProduct = (name: string, category: string) => {
    setProductTitle(name);
    setProductCategory(category);
    setProductDesc(
      `Conheça o novo ${name}, o item de maior crescimento na categoria ${category}!\n\nProjetado com materiais de alta durabilidade e tecnologia de ponta, oferece desempenho superior para quem busca inovação e praticidade no dia a dia.\n\n✓ Garantia total de qualidade\n✓ Envio imediato para todo o Brasil\n✓ Satisfação garantida ou seu dinheiro de volta`
    );
    setSuccessMessage(`Preenchido com o nicho em alta: ${name}`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header hasApiKey={serverHasKey || Boolean(apiKey)} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Notification alerts */}
        {errorMessage && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-sm shadow-lg shadow-rose-950/20">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-300 hover:text-white underline cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-sm shadow-lg shadow-emerald-950/20">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: API Key + Image Upload */}
          <div className="lg:col-span-5 space-y-6">
            <ApiKeySection
              apiKey={apiKey}
              serverHasKey={serverHasKey}
              onSaveKey={handleSaveApiKey}
            />

            <UploadSection
              uploadedImageBase64={uploadedImageBase64}
              isAnalyzing={isAnalyzing}
              canAnalyze={serverHasKey || Boolean(apiKey)}
              calculatorValidationError={!currentCalcValidation.valid ? currentCalcValidation.error : null}
              onImageSelected={handleImageSelected}
              onAnalyze={handleAnalyze}
              onClearImage={handleClearImage}
            />
          </div>

          {/* Right Column: Generated Content (Title, Description, SEO) */}
          <div className="lg:col-span-7 space-y-6">
            <ContentSection
              title={productTitle}
              description={productDesc}
              subtitle={productSubtitle}
              category={productCategory}
              keywords={productKeywords}
              onChangeTitle={setProductTitle}
              onChangeDescription={setProductDesc}
            />
          </div>
        </div>

        {/* 4 Image Variations Section */}
        <ImagesSection
          variations={variations}
          baseImage={uploadedImageBase64}
          productTitle={productTitle}
          productCategory={productCategory}
        />

        {/* Technical Specs Section */}
        <SpecsSection
          specs={specs}
          onUpdateSpecs={setSpecs}
        />

        {/* Pricing and Profit Calculator */}
        <CalculatorSection
          costPrice={costPrice}
          profitPercent={profitPercent}
          taxPercent={taxPercent}
          onChangeCost={(val) => {
            setCostPrice(val);
            setCalculatorValidationError(null);
          }}
          onChangeProfit={(val) => {
            setProfitPercent(val);
            setCalculatorValidationError(null);
          }}
          onChangeTax={(val) => {
            setTaxPercent(val);
            setCalculatorValidationError(null);
          }}
          validationError={calculatorValidationError}
          suggestedCost={suggestedCost}
          suggestedSale={suggestedSale}
        />

        {/* Real-time Market Trends */}
        <TrendsSection
          trends={trends}
          isLoading={isRefreshingTrends}
          onRefreshTrends={handleRefreshTrends}
          onSelectTrendProduct={handleSelectTrendProduct}
        />
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            🛒 <strong className="text-slate-300">Produto IA — Gerador Completo</strong> — Gemini 2.0+ Multimodal & E-commerce Intelligence
          </p>
          <p className="text-slate-400">
            Compatível com Mercado Livre, Shopee, Amazon, Magalu e Shopify
          </p>
        </div>
      </footer>
    </div>
  );
}
