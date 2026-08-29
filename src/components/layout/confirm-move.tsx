import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type MoveDetails = {
  reservationId: string;
  targetTableId: string;
  targetTableName?: string;
  targetTime: string;
} | null;

type Props = {
  isOpen: boolean;
  moveDetails: MoveDetails;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmMoveModal = ({
  isOpen,
  moveDetails,
  onConfirm,
  onCancel,
}: Props) => {
  if (!moveDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-106.25rounded-none">
        <DialogHeader>
          <DialogTitle>Confirmer le déplacement</DialogTitle>
          <DialogDescription className="pt-2 text-sm text-slate-600">
            Voulez-vous vraiment déplacer cette réservation vers la{" "}
            <span className="font-semibold text-slate-900">
              {moveDetails.targetTableName ||
                `Table ${moveDetails.targetTableId}`}
            </span>{" "}
            à{" "}
            <span className="font-semibold text-slate-900">
              {moveDetails.targetTime}
            </span>{" "}
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} className="rounded-none">
            Annuler
          </Button>
          <Button onClick={onConfirm}>Confirmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
