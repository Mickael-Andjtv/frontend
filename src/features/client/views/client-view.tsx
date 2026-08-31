import ListClientComponent from "../components/list-client";
import { MOCK_CUSTOMERS } from "../mocks/client.mocks";

const ClientView = () => {
  return (
    <div className="px-4">
      <h1 className="text-xl font-bold m-2">Clients</h1>
      <ListClientComponent clients={MOCK_CUSTOMERS} />
    </div>
  );
};

export default ClientView;




