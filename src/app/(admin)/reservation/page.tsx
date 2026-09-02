"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReservationView from "@/features/reservation/view/reservation.view";

const ReservationPage = () => {
  return (
    <Suspense fallback={null}>
      <ReservationPageContent />
    </Suspense>
  );
};

function ReservationPageContent() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get("id") ?? undefined;
  return (
    <div>
      <ReservationView focusId={focusId} />
    </div>
  );
}

export default ReservationPage;
