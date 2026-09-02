export type TableStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "RESERVED"
  | "UNAVAILABLE";

export type RestaurantTable = {
  id: string;
  num: number;
  capacity: number;
  place: string;
  status?: TableStatus;
};
