export interface TopHotel {
  id: string;
  name: string;
  city: string;
  bookings_count: number;
  total_spent: number;
  avg_stayscore: number;
}

export interface CityHeatmapData {
  city: string;
  state: string;
  lat: number;
  lng: number;
  total_spent: number;
  avg_stayscore: number;
  bookings_count: number;
}

export interface PriceTrend {
  hotel_id: string;
  hotel_name: string;
  weeks: {
    week: string;
    avg_price: number;
  }[];
}

export interface Insight {
  type: "saving" | "quality" | "alert";
  title: string;
  description: string;
  action?: string;
}
