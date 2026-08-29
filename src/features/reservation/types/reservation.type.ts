export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export interface Reservation {
  id: string;
  userId: string;
  tableId?: string | null;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  status: ReservationStatus;
  specialRequest?: string | null;
  createdAt: string;
}

export type CreateReservationInput = Omit<
  Reservation,
  "id" | "status" | "createdAt" | "tableId"
> & {
  tableId?: string;
};
