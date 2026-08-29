import { Plus } from "lucide-react";
import { AddTableComponet } from "../components/add";
import { Button } from "@/components/ui/button";

const AddTable = () => {
  return (
    <div className="flex justify-between items-center">
      <div className=" flex flex-col mb-2">
        <h1 className="text-xl font-semibold">Tous vos Tables</h1>
        <p className="text-sm">Gerer vos tables ici</p>
      </div>
      <AddTableComponet
        addBtn={
          <Button
            className={
              "border-gray-900 border-2 hover:bg-gray-950 hover:text-white"
            }
            variant="outline"
          >
            <Plus />
            Ajouter
          </Button>
        }
      />
    </div>
  );
};

export default AddTable;
