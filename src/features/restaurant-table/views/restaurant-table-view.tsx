import ListTable from "../components/list";
import { MOCK_TABLES } from "../mocks/table-mocks";
import AddTable from "./add-table";

const RestaurantTableView = () => {
  return (
    <div className="px-4">
      <h1 className="text-xl font-bold">Tables</h1>

      <AddTable />
      <ListTable restaurantTables={MOCK_TABLES} />
    </div>
  );
};

export default RestaurantTableView;
