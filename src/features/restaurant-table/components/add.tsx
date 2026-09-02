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
import { ConfirmModal } from "@/components/layout/confirm-modal";

type Props = {
  addBtn: React.ReactElement;
  tableData: RestaurantTable;
  isAdd?: boolean;
  onSubmit?: (data: RestaurantTable) => void;
};

export function AddTableComponet({ addBtn, tableData, isAdd, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [table, setTable] = useState<RestaurantTable>(() =>
    tableData.num != null && tableData.capacity != null
      ? tableData
      : { ...tableData, num: 0, capacity: 0 },
  );
  const [showEditConfirm, setShowEditConfirm] = useState(false);

  const addTable = () => {
    onSubmit?.({ ...table, id: "" });
    setOpen(false);
  };

  const editTable = () => {
    setShowEditConfirm(true);
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
              value={Number.isNaN(table.num) ? "" : (table.num ?? 0)}
              onChange={(e) => {
                const value = e.target.value;
                setTable({ ...table, num: value === "" ? 0 : Number(value) });
              }}
            />
          </div>
          <div className="grid gap-3">
            <LabelComponent required htmfor="cap" name="Couverts" />
            <Input
              id="cap"
              type="number"
              value={Number.isNaN(table.capacity) ? "" : (table.capacity ?? 0)}
              onChange={(e) => {
                const value = e.target.value;
                setTable({
                  ...table,
                  capacity: value === "" ? 0 : Number(value),
                });
              }}
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

      <ConfirmModal
        open={showEditConfirm}
        title="Confirmer les modifications"
        description={`Confirmer la mise à jour de la table ${table.num} (${table.capacity} couverts) ?`}
        confirmLabel="Enregistrer"
        onConfirm={() => {
          onSubmit?.(table);
          setShowEditConfirm(false);
          setOpen(false);
        }}
        onOpenChange={setShowEditConfirm}
      />
    </Sheet>
  );
}
