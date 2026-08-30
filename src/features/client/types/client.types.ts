export type LoyaltyTier = "BRONZE" | "SILVER" | "GOLD" | "VIP";

export type CustomerStatus = "REGULAR" | "VIP" | "BLOCKED";

export type PromoCode = {
  id: string;
  code: string; 
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT"; 
  discountValue: number; 
  minOrderAmount?: number; 
  maxDiscountAmount?: number;

  requiredLoyaltyTier?: LoyaltyTier;

  startDate?: string; 
  endDate?: string; 
  usageLimit?: number; 
  usageCount?: number; 
  isForSingleUse?: boolean;
  isActive: boolean;
};

export type CustomerLoyalty = {
  points: number; // Cumul des points de fidélité
  tier: LoyaltyTier; // Niveau de fidélité actuel
  customDiscountPercent?: number; // Réduction fixe accordée au client (ex: 10% systématique)
};

export type CustomerPreferences = {
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  allergies?: string[];
  preferredTableNotes?: string;
};

// Modèle Client Mis à jour
export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: CustomerStatus;

  loyalty: CustomerLoyalty; // Données de fidélité
  assignedPromos?: PromoCode[]; // Codes promos attribués spécifiquement à ce client
  preferences?: CustomerPreferences;

  stats?: {
    totalOrders: number;
    totalReservations: number;
    noShowCount: number;
    totalSpent: number;
    lastVisitAt?: string;
  };

  createdAt: string;
  updatedAt: string;
};
