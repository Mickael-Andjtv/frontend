import { apiGet, apiPost, apiPut } from "./http";
import type { Customer, CustomerLoyalty, CustomerPreferences, CustomerStatus, LoyaltyTier } from "@/features/client/types/client.types";

interface CustomerDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string | null;
  status: CustomerStatus;
  loyalty: { points: number; tier: LoyaltyTier; customDiscountPercent: number | null };
  preferences: { isVegetarian: boolean; isGlutenFree: boolean; allergies: string[] | null; preferredTableNotes: string | null } | null;
  totalOrders: number;
  totalReservations: number;
  noShowCount: number;
  totalSpent: number;
  lastVisitAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateCustomerPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image?: string | null;
  preferences?: {
    isVegetarian?: boolean;
    isGlutenFree?: boolean;
    allergies?: string[];
    preferredTableNotes?: string;
  } | null;
};

export type UpdateCustomerPayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  image?: string | null;
  status?: CustomerStatus;
  preferences?: CustomerPreferences;
  loyalty?: CustomerLoyalty;
};

function mapCustomer(dto: CustomerDto): Customer {
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    phone: dto.phone,
    image: dto.image ?? undefined,
    status: dto.status,
    loyalty: {
      points: dto.loyalty.points,
      tier: dto.loyalty.tier,
      customDiscountPercent: dto.loyalty.customDiscountPercent ?? undefined,
    },
    preferences: dto.preferences
      ? {
          isVegetarian: dto.preferences.isVegetarian,
          isGlutenFree: dto.preferences.isGlutenFree,
          allergies: dto.preferences.allergies ?? [],
          preferredTableNotes: dto.preferences.preferredTableNotes ?? undefined,
        }
      : undefined,
    stats: {
      totalOrders: dto.totalOrders,
      totalReservations: dto.totalReservations,
      noShowCount: dto.noShowCount,
      totalSpent: dto.totalSpent,
      lastVisitAt: dto.lastVisitAt ?? undefined,
    },
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export async function getCustomers(): Promise<Customer[]> {
  const customers = await apiGet<CustomerDto[]>("/api/customers?limit=500");
  return customers.map(mapCustomer);
}

export async function getCustomer(id: string): Promise<Customer> {
  const customer = await apiGet<CustomerDto>(`/api/customers/${id}`);
  return mapCustomer(customer);
}

export async function createCustomer(payload: CreateCustomerPayload): Promise<Customer> {
  const customer = await apiPost<CustomerDto>("/api/customers", payload);
  return mapCustomer(customer);
}

export async function updateCustomer(id: string, payload: UpdateCustomerPayload): Promise<Customer> {
  const customer = await apiPut<CustomerDto>(`/api/customers/${id}`, payload);
  return mapCustomer(customer);
}