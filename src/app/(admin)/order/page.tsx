"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OrderView from "@/features/order/views/order-view";

const OrderPage = () => {
  return (
    <Suspense fallback={null}>
      <OrderContent />
    </Suspense>
  );
};

function OrderContent() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get("id") ?? undefined;
  return (
    <div>
      <OrderView focusId={focusId} />
    </div>
  );
}

export default OrderPage;
