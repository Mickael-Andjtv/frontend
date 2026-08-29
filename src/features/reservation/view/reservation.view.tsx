import { MOCK_TABLES } from "@/features/restaurant-table/mocks/table-mocks";
import ListComponent from "../components/list";
import { MOCK_RESERVATIONS } from "../mocks/reservation.mock";

const ReservationView = () => {
  return (
    <div>
      <ListComponent reservationData={MOCK_RESERVATIONS} tabledata={MOCK_TABLES}/>
    </div>
  );
};

export default ReservationView;
