import ListTable from "../components/list";
import { MOCK_TABLES } from "../mocks/table-mocks";
import AddTable from "./add-table";

const RestaurantTableView = () => {
  return (
    <div className="p-4">
      <AddTable />
      <ListTable restaurantTables={MOCK_TABLES} />
    </div>
  );
};

export default RestaurantTableView;
