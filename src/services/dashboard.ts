import { apiGet, resolveApiUrl } from "./http";
import { buildQuery } from "./http";

export type DashboardStats = {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  ordersToday: number;
  revenueToday: number;
  pendingOrders: number;
  pendingReservations: number;
};

export type OrdersByStatus = Record<string, number>;

export type RevenueByDate = {
  date: string;
  revenue: number;
};

export type PopularItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string[];
  totalQuantity: number;
  totalRevenue: number;
};

export type ReservationsByDate = {
  date: string;
  count: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiGet<DashboardStats>("/api/dashboard/stats");
}

export async function getOrdersByStatus(): Promise<OrdersByStatus> {
  return apiGet<OrdersByStatus>("/api/dashboard/orders-by-status");
}

export async function getRevenueByDate(days = 30): Promise<RevenueByDate[]> {
  return apiGet<RevenueByDate[]>(`/api/dashboard/revenue-by-date${buildQuery({ days })}`);
}

export async function getPopularItems(limit = 10): Promise<PopularItem[]> {
  const items = await apiGet<PopularItem[]>(`/api/dashboard/popular-items${buildQuery({ limit })}`);
  return items.map((item) => ({
    ...item,
    imageUrl: (item.imageUrl ?? []).map(resolveApiUrl),
  }));
}

export async function getReservationsByDate(days = 30): Promise<ReservationsByDate[]> {
  return apiGet<ReservationsByDate[]>(`/api/dashboard/reservations-by-date${buildQuery({ days })}`);
}