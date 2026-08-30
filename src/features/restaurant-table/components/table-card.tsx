import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RestaurantTable } from "../types/table";
import { useState } from "react";

type Props = {
  resTable: RestaurantTable;
  onDelete?: (id: string) => void;
};

const TableCard = ({ resTable, onDelete }: Props) => {
  const [status, setStatus] = useState(resTable.status);
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "default";
      case "OCCUPIED":
        return "destructive";
      case "RESERVED":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">
          Table N° {resTable.num}
        </CardTitle>

        <DropdownMenu>
          <DropdownMenuTrigger
          nativeButton={false}
            className={"cursor-pointer"}
            render={
              <Badge variant={getBadgeVariant(resTable.status)}>
                {resTable.status}
              </Badge>
            }
          />
          <DropdownMenuContent className="w-32">
            <DropdownMenuGroup>
              <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
                <DropdownMenuRadioItem value="AVAILABLE">
                  DISPO
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="OCCUPIED">
                  OCCUPÉ
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="RESERVED">
                  RESERVÉ
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          Capacité :{" "}
          <span className="font-semibold text-foreground">
            {resTable.capacity} couverts
          </span>
        </p>
      </CardContent>

      <CardFooter className="flex justify-end pt-2">
        <Button
          variant="destructive"
          size="sm"
          className={"rounded-none"}
          // onClick={() => onDelete && onDelete(resTable.id)}
        >
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TableCard;
