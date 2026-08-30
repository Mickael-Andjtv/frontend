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
  points: number;
  tier: LoyaltyTier;
  customDiscountPercent?: number;
};

export type CustomerPreferences = {
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  allergies?: string[];
  preferredTableNotes?: string;
};

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image?: string;
  status: CustomerStatus;

  loyalty: CustomerLoyalty;
  assignedPromos?: PromoCode[];
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
