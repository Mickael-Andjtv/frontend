"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ClientView from "@/features/client/views/client-view";

const CustomersAdminPage = () => {
  return (
    <Suspense fallback={null}>
      <CustomersContent />
    </Suspense>
  );
};

function CustomersContent() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get("id") ?? undefined;
  return (
    <div>
      <ClientView focusId={focusId} />
    </div>
  );
}

export default CustomersAdminPage;
