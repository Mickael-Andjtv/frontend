import { RestaurantTable } from "../types/table";

export const MOCK_TABLES: RestaurantTable[] = [
  { id: "tbl-001", num: 1, capacity: 2, status: "AVAILABLE" },
  { id: "tbl-002", num: 2, capacity: 2, status: "OCCUPIED" },
  { id: "tbl-003", num: 3, capacity: 4, status: "AVAILABLE" },
  { id: "tbl-004", num: 4, capacity: 4, status: "RESERVED" },
  { id: "tbl-005", num: 5, capacity: 4, status: "OCCUPIED" },
  { id: "tbl-006", num: 6, capacity: 6, status: "AVAILABLE" },
  { id: "tbl-007", num: 7, capacity: 6, status: "UNAVAILABLE" },
  { id: "tbl-008", num: 8, capacity: 8, status: "RESERVED" },
  { id: "tbl-009", num: 9, capacity: 2, status: "AVAILABLE" },
  { id: "tbl-010", num: 10, capacity: 10, status: "OCCUPIED" },
];
