import React from "react";
import { Reservation } from "../types/reservation.type";
import { RestaurantTable } from "@/features/restaurant-table/types/table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReservationCard, ReservationEmptyCard } from "./reservation-card";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  reservationData: Reservation[];
  tabledata: RestaurantTable[];
};

const CRENAUX = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "20:00 PM",
];

const ListReservation = ({ reservationData, tabledata }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <ButtonGroup
            orientation={'vertical'}
            className="h-fit"
            >
              <Button size={"icon-sm"} className={"bg-white text-gray-900 border-2 border-gray-100 hover:bg-gray-300"}>
                <ArrowRight />
              </Button>
              <Button size={"icon-sm"} className={"bg-white text-gray-900 border-2 border-gray-100 hover:bg-gray-300"}>
                <ArrowLeft />
              </Button>
            </ButtonGroup>
          </TableHead>
          {tabledata.map((t, i) => (
            <TableHead className="border  text-center uppercase" key={i}>
              {" "}
              Table {t.num}{" "}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {CRENAUX.map((ck, i) => (
          <TableRow key={i}>
            <TableCell>{ck}</TableCell>
            {tabledata.map((t, index) => {
              const filter = reservationData.find(
                (r) => r.tableId == t.id && r.reservationTime == ck,
              );
              return (
                <TableCell key={index}>
                  {filter ? (
                    <ReservationCard
                      dateEnd={filter.reservationTime}
                      status={filter.status.toLocaleLowerCase()}
                      description={filter.specialRequest ?? ""}
                    />
                  ) : (
                    <ReservationEmptyCard />
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ListReservation;
