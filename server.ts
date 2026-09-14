import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Support base64 image uploads up to 25MB
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Helper to get GoogleGenAI client
function getGenAIClient(customApiKey?: string) {
  const apiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Models to try in sequence for resilience against 503 / high-demand spikes
const CANDIDATE_MODELS = [
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
];

// Helper to execute generateContent with automatic retry and model fallbacks
async function generateContentWithFallback(
  ai: GoogleGenAI,
  requestPayload: {
    contents: any;
    config?: any;
  }
) {
  let lastError: any = null;

  for (let i = 0; i < CANDIDATE_MODELS.length; i++) {
    const model = CANDIDATE_MODELS[i];
    try {
      const response = await ai.models.generateContent({
        model,
        contents: requestPayload.contents,
        config: requestPayload.config,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      console.warn(
        `Modelo ${model} retornou erro (tentativa ${i + 1}/${CANDIDATE_MODELS.length}):`,
        err?.message || err
      );

      // If it's a 503 or 429, wait a moment and try the next model
      const errStr = JSON.stringify(err?.message || "");
      const isTransient =
        errStr.includes("503") ||
        errStr.includes("429") ||
        errStr.includes("UNAVAILABLE") ||
        errStr.includes("RESOURCE_EXHAUSTED") ||
        errStr.includes("high demand");

      if (isTransient && i < CANDIDATE_MODELS.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 800 * (i + 1)));
        continue;
      }

      // If not transient, still try next model unless it's an invalid key
      if (errStr.includes("API_KEY_INVALID") || errStr.includes("INVALID_ARGUMENT")) {
        throw err;
      }

      if (i < CANDIDATE_MODELS.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  throw lastError;
}

// Helper to format clean user-friendly error messages
function sanitizeErrorMessage(error: any): string {
  let raw = error?.message || String(error || "");
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error?.message) {
      raw = parsed.error.message;
    }
  } catch {
    // raw is not json
  }

  if (raw.includes("503") || raw.includes("UNAVAILABLE") || raw.includes("high demand")) {
    return "Os servidores da IA do Google estão temporariamente com alta demanda. Por favor, aguarde alguns segundos e tente novamente.";
  }
  if (raw.includes("API_KEY_INVALID") || raw.includes("API key not valid")) {
    return "Chave de API do Gemini inválida. Verifique sua chave no painel ou nas configurações.";
  }
  if (raw.includes("429") || raw.includes("RESOURCE_EXHAUSTED") || raw.includes("quota")) {
    return "Limite de requisições atingido na API Gemini. Por favor, aguarde 1 minuto ou utilize sua própria chave de API.";
  }

  return raw || "Ocorreu um erro ao comunicar com a inteligência artificial.";
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Product image analysis endpoint
app.post("/api/analyze-product", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", customApiKey } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Nenhuma imagem fornecida." });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.includes(",")
      ? imageBase64.split(",")[1]
      : imageBase64;

    const detectedMime = imageBase64.includes(";")
      ? imageBase64.split(";")[0].replace("data:", "")
      : mimeType;

    const ai = getGenAIClient(customApiKey);

    if (!ai) {
      return res.status(400).json({
        error:
          "Chave da API Gemini não configurada. Insira sua chave no campo de API ou configure GEMINI_API_KEY.",
      });
    }

    const prompt = `Você é um dos maiores especialistas do Brasil e do mundo em E-commerce, Copywriting para Marketplaces (Mercado Livre, Shopee, Amazon, Magalu) e Fotografia Comercial de Produtos com Pessoas Reais.

Analise cuidadosamente esta imagem do produto enviado e gere um cadastro de vendas de altíssima conversão com exatamente 4 variações fotográficas estratégicas.

ATENÇÃO — REQUISITO OBRIGATÓRIO: Conforme exigência estrita, TODAS as 4 variações de imagem DEVEM mostrar PESSOAS USANDO E INTERAGINDO COM O PRODUTO (modelos/pessoas reais segurando, vestindo, manuseando, operando ou desfrutando dos benefícios reais do produto em diferentes momentos e cenários do dia a dia).

Responda ESTRITAMENTE em formato JSON VÁLIDO com a seguinte estrutura (sem blocos de código adicionais fora do JSON):
{
  "titulo": "Título de alta conversão até 70 caracteres com palavras-chave principais",
  "subtitulo": "Frase de impacto resumindo o maior benefício",
  "categoria": "Categoria comercial precisa do produto",
  "descricao": "Descrição persuasiva de venda completa com: introdução magnética, principais benefícios, diferenciais de qualidade, modo de uso e chamada para ação",
  "especificacoes": [
    {"nome": "Material", "valor": "Material identificado ou recomendado"},
    {"nome": "Dimensões", "valor": "Dimensões aproximadas ou padrão"},
    {"nome": "Peso", "valor": "Peso estimado"},
    {"nome": "Cor / Acabamento", "valor": "Cor e acabamento visual"},
    {"nome": "Compatibilidade / Indicação", "valor": "Público e utilidade recomendada"},
    {"nome": "Garantia", "valor": "Ex: 90 dias contra defeitos de fabricação"},
    {"nome": "Itens Inclusos", "valor": "Ex: 1x Produto principal, 1x Manual de instruções"}
  ],
  "variacoes": [
    {
      "id": 1,
      "titulo": "Pessoa Usando o Produto — Uso Principal no Dia a Dia",
      "estilo": "Pessoa em Uso Real",
      "descricao": "Pessoa/modelo sorridente e confiante usando ativamente o produto no cotidiano, destacando satisfação e praticidade imediata.",
      "prompt_sugerido": "Commercial lifestyle advertising photography of an attractive person naturally using and enjoying the [product], bright authentic setting, smiling with confidence, photorealistic 8k, sharp focus, magazine quality"
    },
    {
      "id": 2,
      "titulo": "Pessoa em Ação / Rotina Dinâmica",
      "estilo": "Rotina & Movimento",
      "descricao": "Pessoa utilizando o produto em um ambiente dinâmico da sua rotina (trabalho, casa, esporte ou momentos de lazer), demonstrando versatilidade.",
      "prompt_sugerido": "Candid dynamic lifestyle shot of a person actively using the [product] during modern daily routine, natural daylight, genuine emotion, professional commercial lighting"
    },
    {
      "id": 3,
      "titulo": "Mãos em Ação — Manuseio Ergonômico & Praticidade",
      "estilo": "Mãos & Ergonomia",
      "descricao": "Close-up focado nas mãos de uma pessoa operando, segurando ou ajustando o produto, evidenciando ergonomia e facilidade de manuseio.",
      "prompt_sugerido": "First-person close-up POV photography of human hands skillfully holding, touching and operating the [product], highlighting ease of use, premium tactile feel, soft depth of field"
    },
    {
      "id": 4,
      "titulo": "Pessoas Conectadas — Experiência Social & Estilo de Vida",
      "estilo": "Lifestyle Social",
      "descricao": "Pessoas juntas em momento de conexão e convivência desfrutando dos resultados e bem-estar proporcionados pelo produto.",
      "prompt_sugerido": "Warm lifestyle social scene with happy people interacting together around the [product], warm inviting ambient light, high-end e-commerce advertising standard"
    }
  ],
  "preco_sugerido": 89.90,
  "custo_estimado": 35.00,
  "palavras_chave": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5", "palavra6"]
}`;

    const response = await generateContentWithFallback(ai, {
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: detectedMime,
              data: cleanBase64,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const cleaned = responseText.replace(/```json|```/g, "").trim();
    const resultJson = JSON.parse(cleaned);

    return res.json({
      success: true,
      data: resultJson,
    });
  } catch (error: any) {
    console.error("Erro na análise do produto:", error);
    const friendlyError = sanitizeErrorMessage(error);
    return res.status(500).json({
      error: friendlyError,
    });
  }
});

// Real-time trending products scan endpoint
app.post("/api/trends", async (req, res) => {
  try {
    const { customApiKey } = req.body;
    const ai = getGenAIClient(customApiKey);

    if (!ai) {
      // Return curated fallback trends if no key yet
      return res.json({
        success: true,
        source: "fallback",
        trends: defaultTrends,
      });
    }

    const prompt = `Você é um analista de tendências de mercado e inteligência competitiva de e-commerce (Mercado Livre, Amazon Brasil, Shopee, TikTok Shop).
Forneça uma lista atualizada de 8 produtos que estão em forte alta de buscas e vendas neste momento.

Retorne EXCLUSIVAMENTE um JSON VÁLIDO com a seguinte estrutura:
[
  {
    "rank": 1,
    "name": "Nome descritivo e comercial do produto",
    "trend": "+142%",
    "category": "Eletrônicos",
    "avgPrice": "R$ 149,90",
    "growthReason": "Motivo resumido do aumento de demanda (ex: viralizou nas redes, inovação prática)",
    "competition": "Média"
  }
]`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "[]";
    const cleaned = responseText.replace(/```json|```/g, "").trim();
    const trends = JSON.parse(cleaned);

    return res.json({
      success: true,
      source: "gemini",
      trends,
    });
  } catch (error: any) {
    console.error("Erro ao gerar tendências:", error);
    return res.json({
      success: true,
      source: "fallback",
      trends: defaultTrends,
    });
  }
});

const defaultTrends = [
  {
    rank: 1,
    name: "Smartphone 5G com Câmera Profissional Ultra HD",
    trend: "+128%",
    category: "Eletrônicos",
    avgPrice: "R$ 1.899,00",
    growthReason: "Alta busca por criadores de conteúdo e redes sociais",
    competition: "Alta",
  },
  {
    rank: 2,
    name: "Fone Bluetooth com Cancelamento Ativo de Ruído (ANC)",
    trend: "+95%",
    category: "Acessórios",
    avgPrice: "R$ 189,90",
    growthReason: "Trabalho híbrido, estudos e foco em produtividade",
    competition: "Média",
  },
  {
    rank: 3,
    name: "Smartwatch AMOLED à Prova d'Água com Monitor Cardíaco",
    trend: "+87%",
    category: "Eletrônicos",
    avgPrice: "R$ 249,00",
    growthReason: "Adoção maciça de métricas de saúde e condicionamento",
    competition: "Média",
  },
  {
    rank: 4,
    name: "Camisetas Dry Fit Térmicas — Kit com 5 Unidades",
    trend: "+76%",
    category: "Moda Esportiva",
    avgPrice: "R$ 99,90",
    growthReason: "Kits de alto giro com custo-benefício para academia",
    competition: "Alta",
  },
  {
    rank: 5,
    name: "Sérum Facial Orgânico Anti-Idade com Vitamina C",
    trend: "+68%",
    category: "Beleza & Skincare",
    avgPrice: "R$ 79,90",
    growthReason: "Tendência de cuidados com a pele naturais e veganos",
    competition: "Média",
  },
  {
    rank: 6,
    name: "Mini Processador & Triturador Elétrico USB sem Fio",
    trend: "+62%",
    category: "Casa & Cozinha",
    avgPrice: "R$ 49,90",
    growthReason: "Praticidade na cozinha compacta e viral no TikTok",
    competition: "Baixa",
  },
  {
    rank: 7,
    name: "Creatina Monohidratada 100% Pura 300g",
    trend: "+58%",
    category: "Saúde & Suplementos",
    avgPrice: "R$ 89,00",
    growthReason: "Aumento contínuo do público fitness e bem-estar",
    competition: "Alta",
  },
  {
    rank: 8,
    name: "Kit Faixas Elásticas Extensoras para Exercícios em Casa",
    trend: "+51%",
    category: "Esportes",
    avgPrice: "R$ 59,90",
    growthReason: "Treinos funcionais flexíveis em viagens e em casa",
    competition: "Baixa",
  },
];

// Mount Vite middleware for dev or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
