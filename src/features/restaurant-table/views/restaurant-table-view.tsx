import ListTable from "../components/list";
import { MOCK_TABLES } from "../mocks/table-mocks";
import AddTable from "./add-table";

const RestaurantTableView = () => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center m-2">
        <h1 className="text-xl font-bold">Tables</h1>

      <AddTable />
      </div>
      <ListTable restaurantTables={MOCK_TABLES} />
    </div>
  );
};

export default RestaurantTableView;
