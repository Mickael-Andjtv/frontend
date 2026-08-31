"use client";

import { Users, Trash2, MapPin } from "lucide-react";
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

type Props = {
  resTable: RestaurantTable;
  onDelete?: (id: string) => void;
};

const TableCard = ({ resTable, onDelete }: Props) => {
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
          <span>Salle principale</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end p-3 pt-0 bg-white">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-none text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 px-2 gap-1.5"
          onClick={() => onDelete && onDelete(resTable.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TableCard;
