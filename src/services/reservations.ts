import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./http";
import { buildQuery } from "./http";
import { getCustomers } from "./customers";
import type { Customer } from "@/features/client/types/client.types";
import type { Reservation, ReservationStatus } from "@/features/reservation/types/reservation.type";

interface ReservationDto {
  id: string;
  customerId: string;
  tableId: string | null;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  status: ReservationStatus;
  specialRequest: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateReservationPayload = {
  customerId: string;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  tableId?: string | null;
  specialRequest?: string | null;
};

export type UpdateReservationPayload = {
  tableId?: string | null;
  reservationTime?: string;
  reservationDate?: string;
  numberOfGuests?: number;
  status?: ReservationStatus;
  specialRequest?: string | null;
};

export function parseReservationTime(apiTime: string): string {
  const [hours, minutes] = apiTime.split(":").map(Number);
  if (isNaN(hours)) return apiTime;
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = String(minutes ?? 0).padStart(2, "0");
  return `${hour12}:${displayMinutes === "00" ? "00" : displayMinutes} ${suffix}`;
}

export function toApiTime(displayTime: string): string {
  const match = displayTime.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return displayTime;
  let hours = Number(match[1]);
  const minutes = match[2];
  const suffix = match[3]?.toUpperCase();
  if (suffix === "PM" && hours !== 12) hours += 12;
  if (suffix === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}:00`;
}

function mapReservation(dto: ReservationDto, customerMap: Map<string, Customer>): Reservation {
  return {
    id: dto.id,
    customer: customerMap.get(dto.customerId) ?? ({} as Customer),
    tableId: dto.tableId,
    reservationDate: dto.reservationDate,
    reservationTime: parseReservationTime(dto.reservationTime),
    numberOfGuests: dto.numberOfGuests,
    status: dto.status,
    specialRequest: dto.specialRequest,
    createdAt: dto.createdAt,
  };
}

let customersCache: Promise<Map<string, Customer>> | null = null;

async function getCustomerMap(): Promise<Map<string, Customer>> {
  customersCache ??= getCustomers().then((customers) => new Map(customers.map((c) => [c.id, c])));
  return customersCache;
}

export async function getReservations(): Promise<Reservation[]> {
  const [reservations, customerMap] = await Promise.all([
    apiGet<ReservationDto[]>(`/api/reservations${buildQuery({ limit: 500 })}`),
    getCustomerMap(),
  ]);
  return reservations.map((dto) => mapReservation(dto, customerMap));
}

export async function updateReservation(
  id: string,
  payload: UpdateReservationPayload,
): Promise<Reservation> {
  const customerMap = await getCustomerMap();
  const dto = await apiPut<ReservationDto>(`/api/reservations/${id}`, payload);
  return mapReservation(dto, customerMap);
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<Reservation> {
  const customerMap = await getCustomerMap();
  const dto = await apiPatch<ReservationDto>(`/api/reservations/${id}/status`, { status });
  return mapReservation(dto, customerMap);
}

export async function createReservation(
  payload: CreateReservationPayload,
): Promise<Reservation> {
  const customerMap = await getCustomerMap();
  const dto = await apiPost<ReservationDto>("/api/reservations", payload);
  return mapReservation(dto, customerMap);
}

export async function cancelReservation(id: string): Promise<void> {
  await apiDelete<{ message: string }>(`/api/reservations/${id}`);
}