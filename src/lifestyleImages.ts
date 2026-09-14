// Lifestyle image assets showing real people using products
import smartwatchUserImg from "./assets/images/smartwatch_user_1789420341868.jpg";
import headphoneUserImg from "./assets/images/headphone_user_1789420351296.jpg";
import bottleUserImg from "./assets/images/bottle_user_1789420361997.jpg";
import desklampUserImg from "./assets/images/desklamp_user_1789420371721.jpg";
import personHoldingItemImg from "./assets/images/person_holding_item_1789420382973.jpg";
import personHomeLifestyleImg from "./assets/images/person_home_lifestyle_1789420412894.jpg";
import handsOperatingItemImg from "./assets/images/hands_operating_item_1789420393477.jpg";
import personOutdoorsUseImg from "./assets/images/person_outdoors_use_1789420403856.jpg";

export interface LifestylePersonImage {
  id: number;
  badge: string;
  action: string;
  image: string;
}

// 4 versatile lifestyle images featuring people using products
export const DEFAULT_PEOPLE_USING_PRODUCT: LifestylePersonImage[] = [
  {
    id: 1,
    badge: "Pessoa Usando no Dia a Dia",
    action: "Pessoa apresentando e demonstrando o produto com sorriso e satisfação",
    image: personHoldingItemImg,
  },
  {
    id: 2,
    badge: "Pessoa em Ambiente Doméstico / Conforto",
    action: "Pessoa relaxando em casa e interagindo ativamente com o produto",
    image: personHomeLifestyleImg,
  },
  {
    id: 3,
    badge: "Mãos em Manuseio e Ergonomia",
    action: "Close-up em primeira pessoa das mãos segurando e operando com facilidade",
    image: handsOperatingItemImg,
  },
  {
    id: 4,
    badge: "Pessoa em Movimento / Uso Externo",
    action: "Pessoa dinâmica utilizando o produto em rotina externa e moderna",
    image: personOutdoorsUseImg,
  },
];

// Specific product lifestyle mappings for known items or categories
export const PRODUCT_SPECIFIC_PEOPLE_IMAGES: Record<string, string[]> = {
  smartwatch: [
    smartwatchUserImg,
    handsOperatingItemImg,
    personOutdoorsUseImg,
    personHoldingItemImg,
  ],
  relogio: [
    smartwatchUserImg,
    handsOperatingItemImg,
    personOutdoorsUseImg,
    personHoldingItemImg,
  ],
  headphone: [
    headphoneUserImg,
    personHomeLifestyleImg,
    personHoldingItemImg,
    personOutdoorsUseImg,
  ],
  fone: [
    headphoneUserImg,
    personHomeLifestyleImg,
    personHoldingItemImg,
    personOutdoorsUseImg,
  ],
  bottle: [
    bottleUserImg,
    personOutdoorsUseImg,
    handsOperatingItemImg,
    personHoldingItemImg,
  ],
  garrafa: [
    bottleUserImg,
    personOutdoorsUseImg,
    handsOperatingItemImg,
    personHoldingItemImg,
  ],
  lamp: [
    desklampUserImg,
    personHomeLifestyleImg,
    handsOperatingItemImg,
    personHoldingItemImg,
  ],
  luminaria: [
    desklampUserImg,
    personHomeLifestyleImg,
    handsOperatingItemImg,
    personHoldingItemImg,
  ],
};

/**
 * Returns the best 4 images of people using the product based on product title or category
 */
export function getPeopleUsingProductImages(productNameOrCategory?: string): string[] {
  if (!productNameOrCategory) {
    return DEFAULT_PEOPLE_USING_PRODUCT.map((p) => p.image);
  }

  const query = productNameOrCategory.toLowerCase();

  for (const [key, list] of Object.entries(PRODUCT_SPECIFIC_PEOPLE_IMAGES)) {
    if (query.includes(key)) {
      return list;
    }
  }

  return DEFAULT_PEOPLE_USING_PRODUCT.map((p) => p.image);
}
