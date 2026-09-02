import { apiGet, apiPost } from "@/services/http";
import type {
  Order,
  OrderItem,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from "@/features/order/types/order-types";
import type { MenuItem } from "@/features/menu/types/menu.types";
import type { RestaurantTable } from "@/features/restaurant-table/types/table";
import { getMenuItems } from "@/services/menu";
import { getTables } from "@/services/tables";

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

export type CreateClientOrderPayload = {
  type: OrderType;
  customerId: string;
  tableId?: string | null;
  items: { menuItemId: string; quantity: number; notes?: string }[];
  paymentMethod?: PaymentMethod;
  estimatedPreparationTimeMinutes?: number;
};

function enrichOrders(dtos: OrderDto[],
  menuItems: MenuItem[], tables: RestaurantTable[]): Order[] {
  const menuMap = new Map(menuItems.map((m) => [m.id, m]));
  const tableMap = new Map(tables.map((t) => [t.id, t]));
  return dtos.map((dto): Order => {
    const table = dto.tableId ? tableMap.get(dto.tableId) : undefined;
    return {
      id: dto.id,
      orderNumber: dto.orderNumber,
      type: dto.type,
      status: dto.status,
      customerId: dto.customerId,
      customer: {} as never,
      tableNumber: table ? String(table.num) : "",
      table: (table ?? {}) as RestaurantTable,
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
      estimatedPreparationTimeMinutes:
        dto.estimatedPreparationTimeMinutes ?? undefined,
      completedAt: dto.completedAt ?? undefined,
    };
  });
}

export async function getClientOrder(orderId: string): Promise<Order | null> {
  try {
    const dto = await apiGet<OrderDto>(`/api/orders/${orderId}`);
    const [menuItems, tables] = await Promise.all([
      getMenuItems(),
      getTables(),
    ]);
    return enrichOrders([dto], menuItems, tables)[0];
  } catch {
    return null;
  }
}

export async function getClientOrders(
  customerId: string,
): Promise<Order[]> {
  const [dtos, menuItems, tables] = await Promise.all([
    apiGet<OrderDto[]>(`/api/orders?customer_id=${customerId}&limit=500`),
    getMenuItems(),
    getTables(),
  ]);
  return enrichOrders(
    [...dtos].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
    menuItems,
    tables,
  );
}

export async function createClientOrder(
  payload: CreateClientOrderPayload,
): Promise<Order> {
  const dto = await apiPost<OrderDto>("/api/orders", payload);
  const [menuItems, tables] = await Promise.all([
    getMenuItems(),
    getTables(),
  ]);
  return enrichOrders([dto], menuItems, tables)[0];
}