"use client";

import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SurveyForm } from "@/components/survey/survey-form";

// Demo booking info map (for MVP without DB)
const DEMO_BOOKINGS: Record<
  string,
  { hotel_id: string; hotel_name: string; stay_date: string }
> = {
  "booking-006": {
    hotel_id: "hotel-mercure-bh-lourdes",
    hotel_name: "Mercure BH Lourdes",
    stay_date: "2026-04-05",
  },
  "booking-007": {
    hotel_id: "hotel-ibis-sp-paulista",
    hotel_name: "Ibis Sao Paulo Paulista",
    stay_date: "2026-03-28",
  },
};

export default function SurveyPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  const booking = DEMO_BOOKINGS[bookingId];

  if (!booking) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-muted-foreground">
          Reserva nao encontrada
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-primary/5 to-transparent">
      <div className="max-w-lg mx-auto px-4 py-10">
        <Card className="shadow-md">
          <CardContent className="pt-8 pb-8">
            <SurveyForm
              hotelId={booking.hotel_id}
              bookingId={bookingId}
              hotelName={booking.hotel_name}
              stayDate={booking.stay_date}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
