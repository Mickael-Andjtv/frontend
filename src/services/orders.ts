import { apiGet, apiPatch } from "./http";
import { buildQuery } from "./http";
import { getCustomers } from "./customers";
import { getMenuItems } from "./menu";
import { getTables } from "./tables";
import type { Customer } from "@/features/client/types/client.types";
import type { MenuItem } from "@/features/menu/types/menu.types";
import type { RestaurantTable } from "@/features/restaurant-table/types/table";
import type {
  Order,
  OrderItem,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from "@/features/order/types/order-types";

interface OrderItemDto {
  id: string;
  menuItemId: string;
  quantity: number;
  totalPrice: number;
  notes: string | null;
}

interface OrderDto {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  customerId: string;
  tableId: string | null;
  items: OrderItemDto[];
  discountAmount: number | null;
  appliedPromoId: string | null;
  taxAmount: number | null;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  estimatedPreparationTimeMinutes: number | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type GetOrdersParams = {
  status?: OrderStatus;
};

function createOrderEnricher() {
  let customersPromise: Promise<Customer[]> | null = null;
  let menuPromise: Promise<MenuItem[]> | null = null;
  let tablesPromise: Promise<RestaurantTable[]> | null = null;

  return async function enrich(dto: OrderDto): Promise<Order> {
    const [customers, menuItems, tables] = await Promise.all([
      customersPromise ??= getCustomers(),
      menuPromise ??= getMenuItems(),
      tablesPromise ??= getTables(),
    ]);

    const customerMap = new Map(customers.map((c) => [c.id, c]));
    const tableMap = new Map(tables.map((t) => [t.id, t]));
    const menuMap = new Map(menuItems.map((m) => [m.id, m]));

    return {
      id: dto.id,
      orderNumber: dto.orderNumber,
      type: dto.type,
      status: dto.status,
      customerId: dto.customerId,
      customer: customerMap.get(dto.customerId) ?? ({} as Customer),
      tableNumber: dto.tableId && tableMap.get(dto.tableId) ? String(tableMap.get(dto.tableId)!.num) : "",
      table: dto.tableId ? (tableMap.get(dto.tableId) ?? ({} as RestaurantTable)) : ({} as RestaurantTable),
      items: dto.items.map((item): OrderItem => ({
        id: item.id,
        menuItemId: item.menuItemId,
        menuItem: menuMap.get(item.menuItemId) ?? ({} as MenuItem),
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        notes: item.notes ?? undefined,
      })),
      discountAmount: dto.discountAmount ?? 0,
      taxAmount: dto.taxAmount ?? 0,
      totalAmount: dto.totalAmount,
      paymentStatus: dto.paymentStatus,
      paymentMethod: dto.paymentMethod ?? undefined,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      estimatedPreparationTimeMinutes: dto.estimatedPreparationTimeMinutes ?? undefined,
      completedAt: dto.completedAt ?? undefined,
    };
  };
}

export async function getOrders(params: GetOrdersParams = {}): Promise<Order[]> {
  const orders = await apiGet<OrderDto[]>(
    `/api/orders${buildQuery({ ...params, limit: 500 })}`,
  );
  const enrich = createOrderEnricher();
  return Promise.all(orders.map(enrich));
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  await apiPatch<OrderDto>(`/api/orders/${orderId}/status`, { status });
}