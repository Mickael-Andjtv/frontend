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

type Props = {
  addBtn: React.ReactElement;
};

export function AddTableComponet({ addBtn }: Props) {
  return (
    <Sheet>
      <SheetTrigger render={addBtn} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle className={"text-2xl"}>Ajouter Un Table</SheetTitle>
          <SheetDescription>
            Tous les informations sont nécessaire
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4 text-gray-500">
          <div className="grid gap-3">
            <LabelComponent htmfor="num" required name="Numéro du table" />
            <Input id="num" type="number" />
          </div>
          <div className="grid gap-3">
            <LabelComponent required htmfor="cap" name="Capacité" />
            <Input id="cap" type="number" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Enregistrer</Button>
          <SheetClose render={<Button variant="outline">Annuler</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
