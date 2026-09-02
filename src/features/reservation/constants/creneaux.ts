/**
 * Unified reservation time slots shared by the admin back-office and the
 * client self-service form so that both offer (and display) identical créneaux.
 *
 * Display format is 12-hour `h:mm AM/PM`, which matches the output of
 * `parseReservationTime` (see @/services/reservations).
 * Send to the API as HH:mm:ss via `toApiTime`.
 */
export const RESERVATION_TIME_SLOTS = [
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
];