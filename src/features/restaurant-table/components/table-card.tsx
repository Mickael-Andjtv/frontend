"use client";

import { Users, Trash2, MapPin, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RestaurantTable } from "../types/table";
import { AddTableComponet } from "./add";

type Props = {
  resTable: RestaurantTable;
};

const TableCard = ({ resTable }: Props) => {
  return (
    <Card className="w-full rounded-none border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-base font-bold text-slate-900">
          Table {resTable.num}
        </CardTitle>
        <Badge
          variant="outline"
          className="rounded-none border-slate-300 text-slate-700 font-medium text-[11px]"
        >
          {resTable.capacity} Couverts
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <Users className="h-4 w-4 text-slate-400" />
          <span>
            Capacité :{" "}
            <strong className="text-slate-900 font-semibold">
              {resTable.capacity} personnes
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span>{resTable.place ?? "Salle principale"}</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end p-3 pt-0 bg-white">
        <AddTableComponet
          addBtn={
            <Button
              variant="ghost"
              size="sm"
              className={"rounded-none"}
            >
              <Edit className="h-3.5 w-3.5" />
              Modifier
            </Button>
          }
          tableData={resTable}
          isAdd={false}
        />
      </CardFooter>
    </Card>
  );
};

export default TableCard;
