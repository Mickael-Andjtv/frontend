import { Order } from "../types/order-types";
import OrderCardComponent from "./order-card";

type Props = {
  orders: Order[];
};

const ListOrderComponent = ({ orders }: Props) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {orders.map((ord, index) => (
        <OrderCardComponent order={ord} key={index} />
      ))}
    </div>
  );
};

export default ListOrderComponent;
