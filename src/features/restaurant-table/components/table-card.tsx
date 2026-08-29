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
        <Badge variant={getBadgeVariant(resTable.status)}>
          {resTable.status}
        </Badge>
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
          className={'rounded-none'}
          // onClick={() => onDelete && onDelete(resTable.id)}
        >
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TableCard;
