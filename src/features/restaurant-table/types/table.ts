export type RestaurantTable = {
  id: string;
  num: number;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "UNAVAILABLE";
  /* 
  place:"ENDROIT" | "TERASSE"3
  */
};
