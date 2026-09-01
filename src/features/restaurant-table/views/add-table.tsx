import { Plus } from "lucide-react";
import { AddTableComponet } from "../components/add";
import { Button } from "@/components/ui/button";

const AddTable = () => {
  return (
    <div className="flex justify-between items-center">
      <div className=" flex flex-col mb-2"></div>
      <AddTableComponet
        isAdd
        tableData={{
          id: "",
          num: 0,
          capacity: 0,
          place: "",
        }}
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
