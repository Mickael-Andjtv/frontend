import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./http";
import { buildQuery } from "./http";
import type { RestaurantTable, TableStatus } from "@/features/restaurant-table/types/table";

interface TableDto {
  id: string;
  num: number;
  capacity: number;
  place: string;
  status: TableStatus;
  createdAt: string;
  updatedAt: string;
}

function mapTable(dto: TableDto): RestaurantTable {
  return {
    id: dto.id,
    num: dto.num,
    capacity: dto.capacity,
    place: dto.place,
    status: dto.status,
  };
}

export type CreateTablePayload = {
  num: number;
  capacity: number;
  place: string;
};

export type UpdateTablePayload = Partial<CreateTablePayload> & {
  status?: TableStatus;
};

export async function getTables(): Promise<RestaurantTable[]> {
  const tables = await apiGet<TableDto[]>(`/api/tables${buildQuery({})}`);
  return tables.map(mapTable);
}

export async function createTable(payload: CreateTablePayload): Promise<RestaurantTable> {
  const table = await apiPost<TableDto>("/api/tables", payload);
  return mapTable(table);
}

export async function updateTable(id: string, payload: UpdateTablePayload): Promise<RestaurantTable> {
  const table = await apiPut<TableDto>(`/api/tables/${id}`, payload);
  return mapTable(table);
}

export async function deleteTable(id: string): Promise<void> {
  await apiDelete<{ message: string }>(`/api/tables/${id}`);
}

export async function updateTableStatus(id: string, status: TableStatus): Promise<RestaurantTable> {
  const table = await apiPatch<TableDto>(`/api/tables/${id}/status?status=${status}`, {});
  return mapTable(table);
}