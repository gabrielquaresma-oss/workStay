export interface SurveyInput {
  hotel_id: string;
  booking_id: string;
  wifi_rating: number;
  workspace_adequate: "SIM" | "PARCIAL" | "NAO";
  silence_rating: number;
  would_recommend: "SIM" | "TALVEZ" | "NAO";
  stay_date: string;
}

export interface SurveyResponse {
  id: string;
  hotel_id: string;
  user_id: string;
  booking_id: string | null;
  wifi_rating: number;
  workspace_adequate: "SIM" | "PARCIAL" | "NAO";
  silence_rating: number;
  would_recommend: "SIM" | "TALVEZ" | "NAO";
  responded_at: string;
  stay_date: string;
}
