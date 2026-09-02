"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Receipt,
  Banknote,
  Clock,
  CalendarClock,
  ShoppingBag,
  MoveRight,
} from "lucide-react";
import {
  getDashboardStats,
  getOrdersByStatus,
  getRevenueByDate,
  getPopularItems,
  getReservationsByDate,
} from "@/services/dashboard";
import type {
  DashboardStats,
  OrdersByStatus,
  PopularItem,
  RevenueByDate,
  ReservationsByDate,
} from "@/services/dashboard";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PREPARING: "En cuisine",
  READY: "Prête",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-400",
  CONFIRMED: "bg-blue-500",
  PREPARING: "bg-orange-500",
  READY: "bg-emerald-500",
  COMPLETED: "bg-slate-500",
  CANCELLED: "bg-rose-500",
};

const formatEuro = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-none border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {label}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function RevenueChart({ data }: { data: RevenueByDate[] }) {
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

  const chartData = sorted.map((entry) => {
    const date = new Date(`${entry.date}T00:00:00`);
    const label = date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    });
    return {
      ...entry,
      label,
    };
  });

  const formatDay = (value: string) => {
    const d = new Date(`${value}T00:00:00`);
    return d.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f172a" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#0f172a" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `${Math.round(value)} €`}
            width={56}
          />
          <Tooltip
            formatter={(value) => [formatEuro(Number(value)), "Revenus"]}
            labelFormatter={(label, payload) =>
              payload?.[0]?.payload?.date
                ? formatDay(payload[0].payload.date as string)
                : String(label)
            }
            contentStyle={{
              borderRadius: 0,
              border: "1px solid #e2e8f0",
              fontSize: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
            cursor={{ stroke: "#94a3b8", strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0f172a"
            strokeWidth={2}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const DashboardView = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [ordersByStatus, setOrdersByStatus] = useState<OrdersByStatus>({});
  const [revenue, setRevenue] = useState<RevenueByDate[]>([]);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [reservations, setReservations] = useState<ReservationsByDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      const [
        fetchedStats,
        fetchedStatuses,
        fetchedRevenue,
        fetchedPopular,
        fetchedReservations,
      ] = await Promise.all([
        getDashboardStats(),
        getOrdersByStatus(),
        getRevenueByDate(14),
        getPopularItems(8),
        getReservationsByDate(14),
      ]);
      setStats(fetchedStats);
      setOrdersByStatus(fetchedStatuses);
      setRevenue(fetchedRevenue.reverse());
      setPopularItems(fetchedPopular);
      setReservations(fetchedReservations.reverse());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger le tableau de bord");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      getDashboardStats(),
      getOrdersByStatus(),
      getRevenueByDate(14),
      getPopularItems(8),
      getReservationsByDate(14),
    ])
      .then(([
        fetchedStats,
        fetchedStatuses,
        fetchedRevenue,
        fetchedPopular,
        fetchedReservations,
      ]) => {
        setStats(fetchedStats);
        setOrdersByStatus(fetchedStatuses);
        setRevenue(fetchedRevenue.reverse());
        setPopularItems(fetchedPopular);
        setReservations(fetchedReservations.reverse());
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Impossible de charger le tableau de bord"),
      )
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-none bg-white">
          <p className="text-slate-500 text-sm">{error ?? "Données indisponibles"}</p>
          <button onClick={loadDashboard} className="mt-3 text-xs text-slate-700 underline">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const totalQuantity = Object.values(popularItems).reduce(
    (acc, item) => acc + item.totalQuantity,
    0,
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-slate-500 mt-1">
          Vue d&apos;ensemble de l&apos;activité du restaurant
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Clients"
          value={stats.totalCustomers}
          icon={<Users className="h-4 w-4 text-slate-400" />}
        />
        <StatCard
          label="Commandes"
          value={stats.totalOrders}
          hint={`${stats.pendingOrders} en attente`}
          icon={<Receipt className="h-4 w-4 text-slate-400" />}
        />
        <StatCard
          label="Revenus totaux"
          value={`${stats.totalRevenue.toFixed(2)} €`}
          icon={<Banknote className="h-4 w-4 text-slate-400" />}
        />
        <StatCard
          label="Aujourd&apos;hui"
          value={`${stats.ordersToday} cmd · ${stats.revenueToday.toFixed(2)} €`}
          hint={`${stats.pendingReservations} réservations en attente`}
          icon={<CalendarClock className="h-4 w-4 text-slate-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="rounded-none border-slate-200 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Revenus (14 derniers jours)
            </CardTitle>
            <span className="text-xs text-slate-400">
              Total : {formatEuro(revenue.reduce((s, e) => s + e.revenue, 0))}
            </span>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenue} />
          </CardContent>
        </Card>

        <Card className="rounded-none border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Commandes par statut</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${STATUS_COLORS[status] ?? "bg-slate-400"}`} />
                  <span className="text-sm text-slate-600">
                    {STATUS_LABELS[status] ?? status}
                  </span>
                </div>
                <Badge variant="outline" className="rounded-none">
                  {count}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="rounded-none border-slate-200 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Plats les plus vendus</CardTitle>
            <span className="text-xs text-slate-400">
              {totalQuantity} articles vendus
            </span>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0"
              >
                <span className="text-xs font-bold text-slate-400 w-4">
                  {index + 1}
                </span>
                <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-slate-100 border border-slate-200">
                  {item.imageUrl[0] && (
                    // eslint-disable-next-line @next/next/no-img-element -- backend http images unsupported by next/image optimizer
                    <img
                      src={item.imageUrl[0]}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">{item.price.toFixed(2)} €</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {item.totalQuantity} vendus
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.totalRevenue.toFixed(2)} €
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-none border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Réservations (14 derniers jours)</CardTitle>
            <ShoppingBag className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="space-y-1">
            {reservations.slice(-7).map((entry) => (
              <div key={entry.date} className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 truncate">
                  {new Date(`${entry.date}T00:00:00`).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">
                    {entry.count}
                  </span>
                  <MoveRight className="h-3 w-3 text-slate-300" />
                  <Clock className="h-3 w-3 text-slate-400" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;