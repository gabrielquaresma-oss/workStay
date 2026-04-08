"use client";

import { useState, useEffect, use } from "react";
import { Star, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { StayScoreBadge } from "@/components/hotel/stayscore-badge";
import { ScoreBreakdown } from "@/components/hotel/score-breakdown";
import { ReviewList } from "@/components/hotel/review-list";
import { NearbyMap } from "@/components/worknearby/nearby-map";
import { WorkspaceList } from "@/components/worknearby/workspace-list";
import { DateHeatmap } from "@/components/compare/date-heatmap";
import { DateSuggestion } from "@/components/compare/date-suggestion";
import { AlternativeHotels } from "@/components/compare/alternative-hotels";
import type { StayScoreResult, ScoreBreakdown as ScoreBreakdownType } from "@/types/hotel";

interface HotelDetail {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  google_rating: number | null;
  google_total_reviews: number | null;
  photo_urls: string[];
}

interface ReviewSentiment {
  wifi: number;
  workspace_room: number;
  workspace_hotel: number;
  noise: number;
  location_business: number;
}

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time: string;
  is_work_relevant: boolean;
  work_relevance_score: number;
  sentiment_analysis: ReviewSentiment | null;
}

interface Workspace {
  id: string;
  name: string;
  type: "COWORKING" | "CAFE";
  address: string;
  latitude: number;
  longitude: number;
  distance_meters: number;
  google_rating: number | null;
  opening_hours: string[] | null;
  has_wifi: boolean;
  has_power_outlets: boolean;
  is_quiet: boolean;
}

interface CompareResult {
  original_price: number;
  heatmap: {
    date: string;
    day_of_week: string;
    price: number;
    color: string;
    is_selected: boolean;
  }[];
  best_date: {
    date: string;
    price: number;
    savings: number;
    stayscore_ok: boolean;
  } | null;
  alternative_hotels: {
    name: string;
    price: number;
    stayscore: number;
    savings: number;
  }[];
  projected_annual_savings: number;
}

export default function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [stayscore, setStayscore] = useState<StayScoreResult | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspacesLoading, setWorkspacesLoading] = useState(false);
  const [highlightedWs, setHighlightedWs] = useState<string | null>(null);

  const [checkIn, setCheckIn] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [compare, setCompare] = useState<CompareResult | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);

  const [prices, setPrices] = useState<{ date: string; price: number }[]>([]);

  // Fetch hotel details
  useEffect(() => {
    setLoading(true);
    fetch(`/api/hotels/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setHotel(data.hotel);
          setStayscore(data.stayscore);
          setReviews(data.reviews ?? []);
          setPrices(data.prices ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch nearby workspaces
  useEffect(() => {
    if (!hotel) return;
    setWorkspacesLoading(true);
    fetch(`/api/hotels/${id}/nearby`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.workspaces) setWorkspaces(data.workspaces);
      })
      .catch(() => {})
      .finally(() => setWorkspacesLoading(false));
  }, [id, hotel]);

  // Compare dates
  function handleCompare() {
    if (!hotel) return;
    setCompareLoading(true);
    fetch("/api/hotels/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotel_id: id,
        hotel_name: hotel.name,
        city: hotel.address.split(",").pop()?.trim() ?? "",
        check_in: checkIn,
        stayscore: stayscore?.total_score ?? 70,
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setCompare(data);
      })
      .catch(() => {})
      .finally(() => setCompareLoading(false));
  }

  const todayPrice = prices.find(
    (p) => p.date === new Date().toISOString().slice(0, 10)
  );

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-muted-foreground">
          Hotel não encontrado
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 pb-24">
      {/* Section 1 - Header */}
      <div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <span>Busca</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{hotel.name}</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold">{hotel.name}</h1>
            <p className="text-muted-foreground mt-1">{hotel.address}</p>
            {hotel.google_rating && (
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{hotel.google_rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({hotel.google_total_reviews} avaliações)
                </span>
              </div>
            )}
          </div>
          {stayscore && (
            <StayScoreBadge score={stayscore.total_score} size="lg" />
          )}
        </div>
      </div>

      {/* Section 2 - Photo gallery placeholder */}
      <div className="grid grid-cols-3 gap-2 h-[250px]">
        <div className="col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
          <span className="text-6xl text-primary/20">
            {hotel.name.charAt(0)}
          </span>
        </div>
        <div className="space-y-2">
          <div className="h-[121px] bg-gradient-to-br from-primary/5 to-muted rounded-lg" />
          <div className="h-[121px] bg-gradient-to-br from-muted to-primary/5 rounded-lg" />
        </div>
      </div>

      {/* Section 3 - Score Breakdown */}
      {stayscore && (
        <Card>
          <CardHeader>
            <CardTitle>StayScore - Análise de Produtividade</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreBreakdown breakdown={stayscore.breakdown as ScoreBreakdownType} />
          </CardContent>
        </Card>
      )}

      {/* Section 4 - Date Comparator */}
      <Card>
        <CardHeader>
          <CardTitle>Comparador de Datas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-48"
            />
            <Button onClick={handleCompare} disabled={compareLoading}>
              {compareLoading ? "Comparando..." : "Comparar"}
            </Button>
          </div>

          {compare && (
            <div className="space-y-4">
              <DateHeatmap
                heatmap={compare.heatmap}
                bestDate={compare.best_date?.date ?? null}
              />
              {compare.best_date && (
                <DateSuggestion
                  bestDate={compare.best_date}
                  projectedAnnualSavings={compare.projected_annual_savings}
                />
              )}
              <AlternativeHotels hotels={compare.alternative_hotels} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 5 - WorkNearby */}
      <Card>
        <CardHeader>
          <CardTitle>Espaços de Trabalho Próximos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-[60%]">
              <NearbyMap
                hotelLat={hotel.latitude}
                hotelLng={hotel.longitude}
                hotelName={hotel.name}
                workspaces={workspaces}
                highlightedId={highlightedWs}
              />
            </div>
            <div className="lg:w-[40%]">
              {workspacesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <WorkspaceList
                  workspaces={workspaces}
                  highlightedId={highlightedWs}
                  onHover={setHighlightedWs}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6 - Reviews */}
      <Card>
        <CardContent className="pt-6">
          <ReviewList reviews={reviews} />
        </CardContent>
      </Card>

      {/* Section 7 - Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 py-3 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            {todayPrice && (
              <span className="text-2xl font-bold text-primary">
                R$ {todayPrice.price.toFixed(0)}
                <span className="text-sm font-normal text-muted-foreground">
                  /noite
                </span>
              </span>
            )}
          </div>
          <Button className="h-11 px-8">
            <ExternalLink className="h-4 w-4 mr-2" />
            Reservar na Onfly
          </Button>
        </div>
      </div>
    </div>
  );
}
