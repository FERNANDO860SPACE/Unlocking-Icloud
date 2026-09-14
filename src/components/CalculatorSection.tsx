import { useState, useEffect } from "react";
import { Calculator, DollarSign, TrendingUp, Percent, Sparkles, RefreshCw, AlertCircle } from "lucide-react";

export function validateCalculatorFields(
  costPrice: string,
  profitPercent: string,
  taxPercent: string
): { valid: boolean; error: string | null } {
  const cost = parseFloat(costPrice.replace(",", "."));
  const profit = parseFloat(profitPercent.replace(",", "."));
  const tax = parseFloat(taxPercent.replace(",", "."));

  if (!costPrice || !costPrice.trim() || isNaN(cost) || cost <= 0) {
    return {
      valid: false,
      error: "Por favor, preencha o Custo do Produto na calculadora com um valor maior que R$ 0,00 antes de analisar.",
    };
  }

  if (!profitPercent || !profitPercent.trim() || isNaN(profit) || profit <= 0) {
    return {
      valid: false,
      error: "Por favor, informe uma porcentagem de Lucro Desejado maior que 0% na calculadora de preços antes de analisar.",
    };
  }

  if (!taxPercent || !taxPercent.trim() || isNaN(tax) || tax < 0) {
    return {
      valid: false,
      error: "Por favor, informe uma porcentagem válida de Impostos e Taxas (mínimo 0%) na calculadora antes de analisar.",
    };
  }

  if (profit + tax >= 100) {
    return {
      valid: false,
      error: "A soma de Lucro e Impostos na calculadora de preços não pode ser igual ou superior a 100%.",
    };
  }

  return { valid: true, error: null };
}

interface CalculatorSectionProps {
  costPrice?: string;
  profitPercent?: string;
  taxPercent?: string;
  onChangeCost?: (val: string) => void;
  onChangeProfit?: (val: string) => void;
  onChangeTax?: (val: string) => void;
  validationError?: string | null;
  suggestedCost?: number;
  suggestedSale?: number;
}

export function CalculatorSection({
  costPrice: propCost,
  profitPercent: propProfit,
  taxPercent: propTax,
  onChangeCost,
  onChangeProfit,
  onChangeTax,
  validationError,
  suggestedCost,
  suggestedSale,
}: CalculatorSectionProps) {
  const [internalCost, setInternalCost] = useState<string>("35.00");
  const [internalProfit, setInternalProfit] = useState<string>("30");
  const [internalTax, setInternalTax] = useState<string>("12");

  const costPrice = propCost !== undefined ? propCost : internalCost;
  const profitPercent = propProfit !== undefined ? propProfit : internalProfit;
  const taxPercent = propTax !== undefined ? propTax : internalTax;

  const setCostPrice = (val: string) => {
    if (onChangeCost) onChangeCost(val);
    else setInternalCost(val);
  };

  const setProfitPercent = (val: string) => {
    if (onChangeProfit) onChangeProfit(val);
    else setInternalProfit(val);
  };

  const setTaxPercent = (val: string) => {
    if (onChangeTax) onChangeTax(val);
    else setInternalTax(val);
  };

  const [salePrice, setSalePrice] = useState<number>(0);
  const [netProfit, setNetProfit] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [markupMultiplier, setMarkupMultiplier] = useState<number>(1);
  const [isCalculated, setIsCalculated] = useState<boolean>(true);

  const calculate = (costStr = costPrice, profitStr = profitPercent, taxStr = taxPercent) => {
    const cost = parseFloat(costStr.replace(",", ".")) || 0;
    const profit = parseFloat(profitStr.replace(",", ".")) || 0;
    const tax = parseFloat(taxStr.replace(",", ".")) || 0;

    const denominator = 1 - (profit + tax) / 100;
    // Guard against division by zero or negative denominator
    const safeDenominator = denominator > 0.05 ? denominator : 0.05;

    const price = cost / safeDenominator;
    const calculatedTax = (price * tax) / 100;
    const profitVal = price - cost - calculatedTax;
    const markup = cost > 0 ? price / cost : 0;

    setSalePrice(price);
    setNetProfit(profitVal);
    setTaxAmount(calculatedTax);
    setMarkupMultiplier(markup);
    setIsCalculated(true);
  };

  // Recalculate whenever inputs change
  useEffect(() => {
    calculate();
  }, [costPrice, profitPercent, taxPercent]);

  // Sync if AI suggested values change
  useEffect(() => {
    if (suggestedCost && suggestedCost > 0) {
      setCostPrice(suggestedCost.toFixed(2));
    }
  }, [suggestedCost]);

  const applyPreset = (profit: number, tax: number) => {
    setProfitPercent(profit.toString());
    setTaxPercent(tax.toString());
    calculate(costPrice, profit.toString(), tax.toString());
  };

  const formatBRL = (val: number) => {
    return val.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Input validation states for inline feedback
  const costNum = parseFloat(costPrice.replace(",", "."));
  const profitNum = parseFloat(profitPercent.replace(",", "."));
  const taxNum = parseFloat(taxPercent.replace(",", "."));
  const isCostValid = !isNaN(costNum) && costNum > 0;
  const isProfitValid = !isNaN(profitNum) && profitNum > 0 && profitNum < 100;
  const isTaxValid = !isNaN(taxNum) && taxNum >= 0 && profitNum + taxNum < 100;

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">🧮 Calculadora de Preço & Lucro</h2>
            <p className="text-xs text-slate-400">
              Fórmula de precificação inteligente para e-commerce e marketplaces
            </p>
          </div>
        </div>

        {suggestedSale && suggestedSale > 0 && (
          <button
            type="button"
            onClick={() => {
              // Work backwards or set price
              setCostPrice(((suggestedSale * 0.4) || 30).toFixed(2));
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 hover:bg-cyan-900/50 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Usar Sugestão da IA (R$ {suggestedSale.toFixed(2)})</span>
          </button>
        )}
      </div>

      {/* Validation Error Alert if triggered by Analyze */}
      {validationError && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2.5 shadow-lg shadow-rose-950/30">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-medium">{validationError}</span>
        </div>
      )}

      {/* Preset shortcuts */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] whitespace-nowrap">Estratégias:</span>
        <button
          type="button"
          onClick={() => applyPreset(20, 12)}
          className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            profitPercent === "20"
              ? "bg-cyan-950 border-cyan-500 text-cyan-300"
              : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
          }`}
        >
          Giro Rápido (20%)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(30, 12)}
          className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            profitPercent === "30"
              ? "bg-cyan-950 border-cyan-500 text-cyan-300"
              : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
          }`}
        >
          Padrão Seguro (30%)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(45, 14)}
          className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            profitPercent === "45"
              ? "bg-cyan-950 border-cyan-500 text-cyan-300"
              : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
          }`}
        >
          Alta Margem (45%)
        </button>
      </div>

      {/* Inputs grid matching user prompt */}
      <div className="calculator-grid grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label htmlFor="costPrice" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Custo do Produto (R$):</span>
            {!isCostValid && <span className="text-[10px] text-rose-400 font-normal">Obrigatório (&gt; R$ 0)</span>}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
              R$
            </span>
            <input
              type="number"
              step="0.01"
              id="costPrice"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              placeholder="0,00"
              className={`w-full bg-slate-950 border rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono transition-colors ${
                !isCostValid
                  ? "border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              }`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="profitPercent" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>% de Lucro Desejado:</span>
            {!isProfitValid && <span className="text-[10px] text-rose-400 font-normal">Obrigatório (&gt; 0%)</span>}
          </label>
          <div className="relative">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
              %
            </span>
            <input
              type="number"
              id="profitPercent"
              value={profitPercent}
              onChange={(e) => setProfitPercent(e.target.value)}
              placeholder="30"
              className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 pr-8 text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono transition-colors ${
                !isProfitValid
                  ? "border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              }`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="taxPercent" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Impostos e Taxas (%):</span>
            {!isTaxValid && <span className="text-[10px] text-rose-400 font-normal">Válido (≥ 0%)</span>}
          </label>
          <div className="relative">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
              %
            </span>
            <input
              type="number"
              id="taxPercent"
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
              placeholder="12"
              className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 pr-8 text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono transition-colors ${
                !isTaxValid
                  ? "border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              }`}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          id="calcBtn"
          type="button"
          onClick={() => calculate()}
          className="btn calc-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-all active:scale-95 shadow-md shadow-cyan-500/10 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-950" />
          <span>Calcular Preço & Lucro</span>
        </button>
        <span className="text-[11px] text-slate-400">
          Cálculo atualizado em tempo real conforme digitação
        </span>
      </div>

      {/* Results matching exactly user IDs: calcResult, salePrice, netProfit */}
      {isCalculated && (
        <div
          id="calcResult"
          className="calc-result rounded-xl border border-cyan-800/40 bg-gradient-to-r from-cyan-950/40 via-slate-950 to-blue-950/40 p-4 sm:p-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-[11px] font-medium text-cyan-300 flex items-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                Preço de Venda Sugerido
              </span>
              <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                R$ <span id="salePrice">{formatBRL(salePrice)}</span>
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Valor final de anúncio ao consumidor
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-[11px] font-medium text-emerald-300 flex items-center gap-1 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Lucro Líquido no Bolso
              </span>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">
                R$ <span id="netProfit">{formatBRL(netProfit)}</span>
              </p>
              <span className="text-[10px] text-emerald-400/80 mt-1 block">
                Margem de {profitPercent}% após custos e taxas
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-[11px] font-medium text-amber-300 flex items-center gap-1 mb-1">
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                Taxas & Impostos Retidos
              </span>
              <p className="text-lg sm:text-xl font-bold text-amber-300 tracking-tight">
                R$ {formatBRL(taxAmount)}
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {taxPercent}% referente ao marketplace e nota fiscal
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-[11px] font-medium text-slate-300 mb-1">
                Multiplicador (Markup)
              </span>
              <p className="text-lg sm:text-xl font-bold text-slate-200 tracking-tight">
                {markupMultiplier.toFixed(2)}x
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Relação Preço de Venda / Custo Base
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
