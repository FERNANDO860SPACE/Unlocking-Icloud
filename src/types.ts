export interface ProductSpec {
  nome: string;
  valor: string;
}

export interface ImageVariation {
  id: number;
  titulo: string;
  estilo: string;
  descricao: string;
  prompt_sugerido?: string;
  filterStyle?: string;
}

export interface ProductAnalysis {
  titulo: string;
  subtitulo?: string;
  categoria?: string;
  descricao: string;
  especificacoes: ProductSpec[];
  variacoes: ImageVariation[];
  preco_sugerido?: number;
  custo_estimado?: number;
  palavras_chave?: string[];
}

export interface TrendingItem {
  rank: number;
  name: string;
  trend: string;
  category: string;
  avgPrice?: string;
  growthReason?: string;
  competition?: string;
}

export interface SampleProduct {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  dataUrl: string;
}
