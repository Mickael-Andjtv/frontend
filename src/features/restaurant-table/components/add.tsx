import LabelComponent from "@/components/layout/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { RestaurantTable } from "../types/table";

type Props = {
  addBtn: React.ReactElement;
  tableData: RestaurantTable;
  isAdd?: boolean;
  onSubmit?: (data: RestaurantTable) => void;
};

export function AddTableComponet({ addBtn, tableData, isAdd, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [table, setTable] = useState<RestaurantTable>(tableData);

  const addTable = () => {
    onSubmit?.({ ...table, id: "" });
    setOpen(false);
  };

  const editTable = () => {
    onSubmit?.(table);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={addBtn} />

      <SheetContent>
        <SheetHeader className="border-b-2">
          <SheetTitle className={"text-2xl"}>Ajouter Un Menu</SheetTitle>
          <SheetDescription>
            Tous les informations sont nécessaire
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4 text-gray-500">
          <div className="grid gap-3">
            <LabelComponent htmfor="num" required name="Numéro du table" />
            <Input
              id="num"
              type="number"
              value={table.num}
              onChange={(e) =>
                setTable({ ...table, num: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="grid gap-3">
            <LabelComponent required htmfor="cap" name="Couverts" />
            <Input
              id="cap"
              type="number"
              value={table.capacity}
              onChange={(e) =>
                setTable({ ...table, capacity: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="grid gap-3">
            <LabelComponent required htmfor="cap" name="Emplacement" />
            <Input
              id="cap"
              value={table.place}
              onChange={(e) => setTable({ ...table, place: e.target.value })}
            />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit" onClick={isAdd ? addTable : editTable}>
            Enregistrer
          </Button>
          <SheetClose render={<Button variant="outline">Annuler</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
