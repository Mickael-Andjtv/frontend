// Statut de disponibilité de l'article
export type ItemStatus = "AVAILABLE" | "OUT_OF_STOCK" | "HIDDEN";

export type MenuOption = {
  id: string;
  name: string; 
  priceExtra?: number;
};

export type MenuOptionGroup = {
  id: string;
  required: boolean;
  minChoices?: number;
  maxChoices?: number;
  options: MenuOption[];
};


export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string[];
  status: ItemStatus;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  preparationTimeMinutes?: number; 
  optionGroups?: MenuOptionGroup[]; 
  createdAt?: string;
  updatedAt?: string;
};



