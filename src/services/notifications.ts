import { apiGet, apiPatch } from "./http";
import { buildQuery } from "./http";

export type NotificationType =
  | "ORDER"
  | "RESERVATION"
  | "CUSTOMER"
  | "PAYMENT"
  | "INFO";

export type NotificationEntityType =
  | "order"
  | "reservation"
  | "customer"
  | "payment";

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

/**
 * Resolve the admin URL to visit for a given notification, based on its
 * structured `referenceType`/`referenceId` (never on the free-text message).
 * When an id is available we append it as a query param so the target page
 * can focus the entity directly.
 */
export function resolveNotificationTarget(
  notification: Pick<AppNotification, "type" | "referenceId" | "referenceType">,
): string {
  const id = notification.referenceId;
  const suffix = id ? `?id=${encodeURIComponent(id)}` : "";

  switch (notification.referenceType?.toLowerCase()) {
    case "reservation":
      return `/reservation${suffix}`;
    case "order":
      return `/order${suffix}`;
    case "customer":
      return `/admin/customers${suffix}`;
    case "payment":
      return `/inventory/dashboard${suffix}`;
  }

  // Fallbacks based on the notification category (still structured data).
  switch (notification.type) {
    case "RESERVATION":
      return `/reservation${suffix}`;
    case "ORDER":
      return `/order${suffix}`;
    case "CUSTOMER":
      return `/admin/customers${suffix}`;
    case "PAYMENT":
      return `/inventory/dashboard${suffix}`;
    case "INFO":
    default:
      return "/inventory/dashboard";
  }
}

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
