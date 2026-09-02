import { Order } from "../types/order-types";
import OrderCardComponent from "./order-card";

type Props = {
  orders: Order[];
  onAccept?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
  onStatusChange?: (orderId: string, newStatus: Order["status"]) => void;
  focusId?: string;
};

const ListOrderComponent = ({
  orders,
  onAccept,
  onReject,
  onStatusChange,
  focusId,
}: Props) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {orders.map((ord, index) => (
        <OrderCardComponent
          order={ord}
          key={index}
          onAccept={onAccept}
          onReject={onReject}
          onStatusChange={onStatusChange}
          isFocused={ord.id === focusId}
        />
      ))}
    </div>
  );
};

export default ListOrderComponent;