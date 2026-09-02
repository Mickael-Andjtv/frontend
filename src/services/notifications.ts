import { apiGet, apiPatch } from "./http";
import { buildQuery } from "./http";

export type NotificationType =
  | "ORDER"
  | "RESERVATION"
  | "CUSTOMER"
  | "PAYMENT"
  | "INFO";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  referenceId?: string | null;
  referenceType?: string | null;
  isRead: boolean;
  createdAt: string;
};

export async function getNotifications(): Promise<AppNotification[]> {
  return apiGet<AppNotification[]>(`/api/notifications${buildQuery({ limit: 100 })}`);
}

export async function getUnreadNotificationCount(): Promise<number> {
  const result = await apiGet<{ count: number }>("/api/notifications/unread-count");
  return result.count;
}

export async function markNotificationRead(id: string): Promise<AppNotification> {
  return apiPatch<AppNotification>(`/api/notifications/${id}/read`, {});
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiPatch("/api/notifications/mark-all-read", {});
}
