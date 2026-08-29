import { Search } from "lucide-react";
import { RestaurantTable } from "../types/table";
import TableCard from "./table-card";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";

type Props = {
  restaurantTables: RestaurantTable[];
};

const ListTable = ({ restaurantTables }: Props) => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredTables = restaurantTables.filter((table) => {
    if (!search.trim()) return true;

    const query = search.toLowerCase().trim();
    const searchNum = parseInt(query, 10);

    const matchNum = !isNaN(searchNum) && table.num === searchNum;
    const matchCapacity = !isNaN(searchNum) && table.capacity === searchNum;
    const matchStatus = table.status.toLowerCase().includes(query);

    return matchNum || matchCapacity || matchStatus;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Recherche par numéro, capacité ou statut..."
          className="pl-9"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTables.length > 0 ? (
          filteredTables.map((table) => (
            <TableCard key={table.id} resTable={table} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground col-span-full py-8 text-center">
            Aucune table ne correspond à votre recherche.
          </p>
        )}
      </div>
    </div>
  );
};

export default ListTable;
