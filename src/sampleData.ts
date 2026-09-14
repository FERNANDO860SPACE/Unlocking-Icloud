import { TrendingItem } from "./types";

// High-fidelity SVG product images encoded as base64 Data URLs for instant testing
function createSvgDataUrl(title: string, category: string, color1: string, color2: string, iconSvg: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="100%" stop-color="${color2}"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bg)"/>
    <g filter="url(#shadow)" transform="translate(150, 130)">
      ${iconSvg}
    </g>
    <text x="300" y="480" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="bold" fill="#ffffff" letter-spacing="1">
      ${title}
    </text>
    <text x="300" y="515" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" fill="#94a3b8" letter-spacing="2">
      ${category.toUpperCase()}
    </text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export const SAMPLE_PRODUCTS = [
  {
    id: "smartwatch",
    name: "Smartwatch AMOLED Pro",
    category: "Eletrônicos & Wearables",
    dataUrl: createSvgDataUrl(
      "SMARTWATCH AMOLED PRO",
      "Eletrônicos & Wearables",
      "#0f172a",
      "#1e293b",
      `<rect x="70" y="20" width="160" height="240" rx="36" fill="#18181b" stroke="#38bdf8" stroke-width="6"/>
       <rect x="90" y="50" width="120" height="180" rx="20" fill="#09090b"/>
       <circle cx="150" cy="120" r="45" fill="none" stroke="#06b6d4" stroke-width="8" stroke-dasharray="180 80"/>
       <text x="150" y="128" text-anchor="middle" font-size="28" font-family="sans-serif" font-weight="bold" fill="#ffffff">10:42</text>
       <text x="150" y="195" text-anchor="middle" font-size="13" font-family="sans-serif" fill="#22c55e">● 98 BPM</text>
       <path d="M110 0 L190 0 L180 20 L120 20 Z" fill="#27272a"/>
       <path d="M110 280 L190 280 L180 260 L120 260 Z" fill="#27272a"/>`
    ),
  },
  {
    id: "headphone",
    name: "Fone Bluetooth ANC",
    category: "Acessórios de Áudio",
    dataUrl: createSvgDataUrl(
      "FONE OVER-EAR ANC NOISE CANCEL",
      "Acessórios de Áudio",
      "#18181b",
      "#27272a",
      `<path d="M60 160 A90 90 0 0 1 240 160" fill="none" stroke="#64748b" stroke-width="16" stroke-linecap="round"/>
       <rect x="40" y="130" width="45" height="90" rx="22" fill="#0284c7" stroke="#38bdf8" stroke-width="4"/>
       <rect x="215" y="130" width="45" height="90" rx="22" fill="#0284c7" stroke="#38bdf8" stroke-width="4"/>
       <circle cx="62" cy="175" r="12" fill="#0c4a6e"/>
       <circle cx="237" cy="175" r="12" fill="#0c4a6e"/>
       <path d="M110 90 Q150 75 190 90" fill="none" stroke="#38bdf8" stroke-width="6"/>`
    ),
  },
  {
    id: "bottle",
    name: "Garrafa Térmica Inox 1L",
    category: "Cozinha & Fitness",
    dataUrl: createSvgDataUrl(
      "GARRAFA TÉRMICA INOX 1000ML",
      "Cozinha & Fitness",
      "#090d16",
      "#1e1b4b",
      `<rect x="95" y="70" width="110" height="200" rx="28" fill="#312e81" stroke="#818cf8" stroke-width="5"/>
       <rect x="120" y="25" width="60" height="45" rx="8" fill="#4338ca"/>
       <rect x="135" y="10" width="30" height="15" rx="4" fill="#a5b4fc"/>
       <line x1="120" y1="130" x2="180" y2="130" stroke="#a5b4fc" stroke-width="3" stroke-linecap="round"/>
       <text x="150" y="180" text-anchor="middle" font-size="16" font-family="sans-serif" font-weight="bold" fill="#e0e7ff">24h GELADO</text>
       <text x="150" y="205" text-anchor="middle" font-size="13" font-family="sans-serif" fill="#c7d2fe">12h QUENTE</text>`
    ),
  },
  {
    id: "lamp",
    name: "Luminária LED Articulada",
    category: "Casa & Escritório",
    dataUrl: createSvgDataUrl(
      "LUMINÁRIA ARTICULADA TOUCH",
      "Casa & Escritório",
      "#111827",
      "#1f2937",
      `<rect x="80" y="250" width="140" height="20" rx="8" fill="#4b5563"/>
       <circle cx="150" cy="260" r="5" fill="#38bdf8"/>
       <path d="M150 250 L150 140 L210 70" fill="none" stroke="#9ca3af" stroke-width="12" stroke-linecap="round"/>
       <circle cx="150" cy="140" r="10" fill="#374151"/>
       <polygon points="190,50 260,80 230,120" fill="#fbbf24"/>
       <path d="M230 110 L270 230" stroke="#fef08a" stroke-width="4" stroke-dasharray="6 6"/>`
    ),
  },
];

export const INITIAL_TRENDS: TrendingItem[] = [
  {
    rank: 1,
    name: "Smartphone 5G com Câmera Profissional Ultra HD",
    trend: "+128%",
    category: "Eletrônicos",
    avgPrice: "R$ 1.899,00",
    growthReason: "Alta procura para criação de vídeos e redes sociais",
    competition: "Alta",
  },
  {
    rank: 2,
    name: "Fone Bluetooth com Cancelamento de Ruído (ANC)",
    trend: "+95%",
    category: "Acessórios",
    avgPrice: "R$ 189,90",
    growthReason: "Trabalho híbrido, estudos e foco em produtividade",
    competition: "Média",
  },
  {
    rank: 3,
    name: "Relógio Inteligente à Prova d'Água com GPS",
    trend: "+87%",
    category: "Eletrônicos",
    avgPrice: "R$ 249,00",
    growthReason: "Monitoramento de saúde esportiva e notificações",
    competition: "Média",
  },
  {
    rank: 4,
    name: "Camisetas Dry Fit - Kit com 5 Unidades",
    trend: "+76%",
    category: "Moda",
    avgPrice: "R$ 99,90",
    growthReason: "Kit de giro rápido para treino e uso diário",
    competition: "Alta",
  },
  {
    rank: 5,
    name: "Produtos de Beleza e Skincare Orgânicos",
    trend: "+68%",
    category: "Beleza",
    avgPrice: "R$ 79,90",
    growthReason: "Forte adesão a cosméticos veganos e sem parabenos",
    competition: "Média",
  },
  {
    rank: 6,
    name: "Utensílios Domésticos Inteligentes sem Fio",
    trend: "+62%",
    category: "Casa",
    avgPrice: "R$ 59,90",
    growthReason: "Facilidade de preparo rápido de refeições na cozinha",
    competition: "Baixa",
  },
  {
    rank: 7,
    name: "Suplementos Alimentares Premium & Creatina",
    trend: "+58%",
    category: "Saúde",
    avgPrice: "R$ 89,00",
    growthReason: "Crescimento contínuo de praticantes de musculação",
    competition: "Alta",
  },
  {
    rank: 8,
    name: "Equipamentos para Exercícios em Casa",
    trend: "+51%",
    category: "Esportes",
    avgPrice: "R$ 69,90",
    growthReason: "Rotinas funcionais flexíveis e treinos portáteis",
    competition: "Baixa",
  },
];

export const DEFAULT_PRODUCT_VARIATIONS = [
  {
    id: 1,
    titulo: "Pessoa Usando o Produto — Uso Principal no Dia a Dia",
    estilo: "Pessoa em Uso Real",
    descricao: "Modelo sorridente e confiante utilizando ativamente o produto no cotidiano, transmitindo alta satisfação e valor prático.",
    prompt_sugerido: "Commercial advertising photography of an attractive smiling person naturally using and enjoying the product, bright modern interior, photorealistic 8k, sharp focus, magazine quality",
  },
  {
    id: 2,
    titulo: "Pessoa em Ação / Rotina Dinâmica",
    estilo: "Rotina & Movimento",
    descricao: "Pessoa interagindo com o produto durante sua rotina diária e atividades, demonstrando conforto e versatilidade.",
    prompt_sugerido: "Candid dynamic lifestyle shot of an active person using the product during daily routine, natural daylight, authentic commercial capture",
  },
  {
    id: 3,
    titulo: "Mãos em Ação — Manuseio Ergonômico & Praticidade",
    estilo: "Mãos & Ergonomia",
    descricao: "Close-up em primeira pessoa das mãos segurando e operando o produto, evidenciando ergonomia e facilidade de uso.",
    prompt_sugerido: "First-person close-up POV of human hands skillfully holding and operating the product, highlighting ease of use, soft background depth of field",
  },
  {
    id: 4,
    titulo: "Pessoas Conectadas — Experiência Social & Estilo de Vida",
    estilo: "Lifestyle Social",
    descricao: "Pessoas reunidas em momento descontraído desfrutando dos benefícios e resultados proporcionados pelo produto.",
    prompt_sugerido: "Warm lifestyle scene with happy people interacting together around the product, inviting ambient light, high-end commercial quality",
  },
];
