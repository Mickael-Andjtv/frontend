import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users, MapPin } from "lucide-react";

type Props = {
  reservationData: Reservation[];
  tabledata: RestaurantTable[];
};

const CRENAUX = [
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
  "8:00 PM",

];

const ListReservation = ({ reservationData, tabledata }: Props) => {
  const [start, setStart] = useState(0);
  const itemsPerPage = 5;

  const visibleTable = tabledata.slice(start, start + itemsPerPage);

  const handlePrev = () => setStart((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setStart((prev) => Math.min(tabledata.length - itemsPerPage, prev + 1));

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <Table className="w-full table-fixed border-collapse">
        <TableHeader className="bg-white">
          <TableRow className="border-b border-slate-100 hover:bg-transparent">
            <TableHead className="w-24 text-center align-middle p-2 border-r border-slate-100">
              <div className="flex items-center justify-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-noneborder border-slate-200 bg-white hover:bg-slate-50"
                  onClick={handlePrev}
                  disabled={start === 0}
                >
                  <ChevronLeft className="h-4 w-4 text-slate-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-none border border-slate-200 bg-white hover:bg-slate-50"
                  onClick={handleNext}
                  disabled={start >= tabledata.length - itemsPerPage}
                >
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </Button>
              </div>
            </TableHead>

            {visibleTable.map((t) => (
              <TableHead key={t.id} className="p-4 border-r border-slate-100 align-top">
                <div className="flex flex-col">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Table {t.num}
                  </h4>
                  <div className="flex flex-col gap-1.5 mt-2 text-[11px] font-medium text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-slate-700" /> 
                      4 personnes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-700" />
                      Intérieur
                    </span>
                  </div>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {CRENAUX.map((ck, i) => (
            <TableRow key={i} className="h-16 hover:bg-transparent border-b border-slate-100">
              <TableCell className="text-center text-[11px] font-medium text-slate-600 border-r border-slate-100 align-top pt-2">
                {ck}
              </TableCell>

              {visibleTable.map((t) => {
                const filter = reservationData.find(
                  (r) => r.tableId === t.id && r.reservationTime === ck
                );
                return (
                  <TableCell key={t.id} className="p-1 border-r border-slate-100 align-top h-16">
                    {filter ? (
                      <ReservationCard
                        dateEnd={filter.reservationTime}
                        status={filter.status}
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
    </div>
  );
};

export default ListReservation;