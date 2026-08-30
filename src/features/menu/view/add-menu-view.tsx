"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuItem } from "../types/menu.types";
import { MenuFormSheet } from "../components/menu-form";

type AddMenuViewProps = {
  categories?: { id: string; name: string }[];
  onSubmit?: (data: Partial<MenuItem> & { imageFiles?: File[] }) => void;
};

const AddMenuView = ({ categories = [], onSubmit }: AddMenuViewProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col mb-2"></div>
      <MenuFormSheet
        key="add-new-menu-item"
        categories={categories}
        onSubmit={onSubmit}
        triggerBtn={
          <Button
            className="border-gray-900 border-2 hover:bg-gray-950 hover:text-white"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        }
      />
    </div>
  );
};

export default AddMenuView;
