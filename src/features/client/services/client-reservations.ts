import { apiGet, apiPost } from "@/services/http";
import { parseReservationTime } from "@/services/reservations";
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

export type CreateClientReservationPayload = {
  customerId: string;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  tableId?: string | null;
  specialRequest?: string;
};

function mapReservation(dto: ReservationDto): Reservation {
  return {
    id: dto.id,
    customer: {} as never,
    tableId: dto.tableId,
    reservationDate: dto.reservationDate,
    reservationTime: parseReservationTime(dto.reservationTime),
    numberOfGuests: dto.numberOfGuests,
    status: dto.status,
    specialRequest: dto.specialRequest,
    createdAt: dto.createdAt,
  };
}

export function currentIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function getClientReservations(
  customerId: string,
): Promise<Reservation[]> {
  const dtos = await apiGet<ReservationDto[]>(
    `/api/reservations?customer_id=${customerId}&limit=500`,
  );
  return [...dtos]
    .sort(
      (a, b) =>
        new Date(`${b.reservationDate}T${b.reservationTime}`).getTime() -
        new Date(`${a.reservationDate}T${a.reservationTime}`).getTime(),
    )
    .map(mapReservation);
}

export async function createClientReservation(
  payload: CreateClientReservationPayload,
): Promise<Reservation> {
  const dto = await apiPost<ReservationDto>("/api/reservations", payload);
  return mapReservation(dto);
}