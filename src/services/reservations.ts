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

/**
 * Normalize an API time value into 24h "HH:mm:ss" (or "HH:mm") form.
 *
 * Backend `time` fields are serialized as "HH:MM:SS", but this guard also
 * accepts "HH:MM" or a number of hours/minutes so we never crash on a value
 * we do not fully control. Returns `null` when the value is empty/malformed.
 */
export function normalizeApiTime(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM)?$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = match[3] ? Number(match[3]) : 0;
  const suffix = (match[4] ?? "").toUpperCase();

  if (hours > 23 || minutes > 59 || seconds > 59) return null;
  if (suffix === "PM" && hours !== 12) hours += 12;
  if (suffix === "AM" && hours === 12) hours = 0;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = match[3] ? String(seconds).padStart(2, "0") : "00";
  return `${hh}:${mm}:${ss}`;
}

/**
 * Convert an API time value into a 12h display string like "12:30 PM".
 * Falls back to the raw input (never throws, never returns undefined).
 */
export function parseReservationTime(apiTime: string | null | undefined): string {
  const normalized = normalizeApiTime(apiTime);
  if (!normalized) {
    return typeof apiTime === "string" && apiTime.trim() ? apiTime.trim() : "";
  }

  const [hh, mm] = normalized.split(":");
  const hours = Number(hh);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${mm} ${suffix}`;
}

export function toApiTime(displayTime: string): string {
  const normalized = normalizeApiTime(displayTime);
  return normalized ?? displayTime;
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