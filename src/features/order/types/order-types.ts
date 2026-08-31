import { Customer, PromoCode } from "@/features/client/types/client.types";
import { MenuItem } from "@/features/menu/types/menu.types";
import { RestaurantTable } from "@/features/restaurant-table/types/table";

export type OrderType = "EAT_IN" | "TAKEAWAY" | "DELIVERY";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

export type PaymentMethod = "CASH" | "CARD" | "MOBILE_MONEY" | "OTHER";

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem:MenuItem
  quantity: number;
  totalPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // "CMD-042"
  type: OrderType;
  status: OrderStatus;

  // Relations
  customerId: string;
  customer: Customer; // Pour affichage rapide sans jointure
  tableNumber: string; // Requis si type === "EAT_IN"
  table:RestaurantTable
  // Articles commandés
  items: OrderItem[];

  // Calculs financiers
  discountAmount?: number;
  appliedPromo?: PromoCode;
  taxAmount?: number;
  totalAmount: number;

  // Paiement
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;

  // Suivi temporel
  createdAt: string;
  updatedAt: string;
  estimatedPreparationTimeMinutes?: number;
  completedAt?: string;
}
