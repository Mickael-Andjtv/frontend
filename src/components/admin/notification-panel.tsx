"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  type AppNotification,
  type NotificationType,
} from "@/services/notifications";

const TYPE_LABELS: Record<NotificationType, string> = {
  ORDER: "Commande",
  RESERVATION: "R\u00e9servation",
  CUSTOMER: "Client",
  PAYMENT: "Paiement",
  INFO: "Info",
};

const TYPE_COLORS: Record<NotificationType, string> = {
  ORDER: "bg-sky-100 text-sky-700",
  RESERVATION: "bg-emerald-100 text-emerald-700",
  CUSTOMER: "bg-violet-100 text-violet-700",
  PAYMENT: "bg-amber-100 text-amber-700",
  INFO: "bg-slate-100 text-slate-700",
};

const TYPE_ICONS: Record<NotificationType, string> = {
  ORDER: "\ud83d\udce6",
  RESERVATION: "\ud83d\udcc5",
  CUSTOMER: "\ud83d\udc64",
  PAYMENT: "\ud83d\udcb3",
  INFO: "\u2139\ufe0f",
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return "à l'instant";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `il y a ${diffD}j`;
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const [notifs, count] = await Promise.all([
          getNotifications(),
          getUnreadNotificationCount(),
        ]);
        if (active) {
          setNotifications(notifs);
          setUnreadCount(count);
        }
      } catch {
        // silent
      } finally {
        if (active) setLoading(false);
      }
    };
    poll();
    const timer = setInterval(poll, 10000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silent
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // silent
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "relative p-2 rounded-lg hover:bg-slate-100 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-sky-500",
        )}
      >
        <Bell className="h-5 w-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-96 max-h-[500px] p-0">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className="font-semibold text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="text-xs text-sky-600 hover:text-sky-700 disabled:opacity-50"
            >
              {markingAll ? (
                <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
              ) : (
                "Tout marquer comme lu"
              )}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400">
            <Bell className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">Aucune notification</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {unreadNotifications.map((notif) => (
              <NotificationItem key={notif.id} notification={notif} onMarkRead={handleMarkRead} />
            ))}
            {readNotifications.map((notif) => (
              <NotificationItem key={notif.id} notification={notif} onMarkRead={handleMarkRead} />
            ))}
          </div>
        )}

        <div className="border-t border-slate-200 px-4 py-2 text-center text-xs text-slate-500">
          Actualis\u00e9 automatiquement
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors",
        notification.isRead ? "opacity-70" : "bg-sky-50",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5 text-lg">{TYPE_ICONS[notification.type] || TYPE_ICONS.INFO}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={cn("text-sm font-medium text-slate-900", !notification.isRead && "font-semibold")}>
              {notification.title}
            </p>
            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", TYPE_COLORS[notification.type] || TYPE_COLORS.INFO)}>
              {TYPE_LABELS[notification.type]}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">{notification.message}</p>
          <p className="mt-1.5 text-[11px] text-slate-400">{timeAgo(notification.createdAt)}</p>
        </div>
        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
            aria-label="Marquer comme lu"
          >
            <Check className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
