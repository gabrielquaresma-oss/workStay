"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  BarChart3,
  Calendar,
  TrendingDown,
  Building2,
  Map,
  LineChart,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TopHotelsTable } from "@/components/dashboard/top-hotels-table";
import { CityHeatmap } from "@/components/dashboard/city-heatmap";
import { PriceTrendsChart } from "@/components/dashboard/price-trends-chart";
import { InsightCard } from "@/components/dashboard/insight-card";
import { RoiIndex } from "@/components/dashboard/roi-index";

interface TopHotel {
  id: string;
  name: string;
  city: string;
  bookings_count: number;
  total_spent: number;
  avg_stayscore: number;
}

interface CityData {
  city: string;
  state: string;
  lat: number;
  lng: number;
  total_spent: number;
  avg_stayscore: number;
  bookings_count: number;
}

interface TrendData {
  hotel: string;
  data: { week: string; price: number }[];
}

interface Insight {
  type: string;
  title: string;
  description: string;
  action?: string;
}

const SIDEBAR_ITEMS = [
  { id: "overview", label: "Visao Geral", icon: BarChart3 },
  { id: "hotels", label: "Top Hoteis", icon: Building2 },
  { id: "heatmap", label: "Mapa de Calor", icon: Map },
  { id: "trends", label: "Tendencias", icon: LineChart },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [topHotels, setTopHotels] = useState<TopHotel[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    // Fetch all data in parallel
    Promise.all([
      fetch("/api/dashboard/top-hotels").then((r) => r.ok ? r.json() : null),
      fetch("/api/dashboard/heatmap").then((r) => r.ok ? r.json() : null),
      fetch("/api/dashboard/trends").then((r) => r.ok ? r.json() : null),
      fetch("/api/dashboard/insights").then((r) => r.ok ? r.json() : null),
    ])
      .then(([hotelsData, heatmapData, trendsData, insightsData]) => {
        if (hotelsData?.hotels) setTopHotels(hotelsData.hotels);
        if (heatmapData?.cities) setCities(heatmapData.cities);
        if (trendsData?.trends) setTrends(trendsData.trends);
        if (insightsData?.insights) setInsights(insightsData.insights);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // KPI calculations
  const totalSpent = topHotels.reduce((sum, h) => sum + h.total_spent, 0);
  const avgScore =
    topHotels.length > 0
      ? Math.round(
          topHotels.reduce((sum, h) => sum + h.avg_stayscore, 0) /
            topHotels.length
        )
      : 0;
  const totalBookings = topHotels.reduce(
    (sum, h) => sum + h.bookings_count,
    0
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-60 border-r bg-white p-4 shrink-0 hidden lg:block">
        <nav className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Period filter */}
        <div className="mt-6 pt-4 border-t">
          <label className="text-xs text-muted-foreground font-medium">
            Periodo
          </label>
          <select className="w-full mt-1.5 h-9 rounded-lg border bg-transparent px-2 text-sm cursor-pointer">
            <option value="30d">Ultimos 30 dias</option>
            <option value="90d">Ultimos 90 dias</option>
            <option value="12m">Ultimos 12 meses</option>
          </select>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visao geral da inteligencia hoteleira
          </p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          ) : (
            <>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Total em Hospedagens
                      </p>
                      <p className="text-2xl font-bold tracking-tight mt-0.5">
                        R$ {totalSpent.toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        StayScore Medio
                      </p>
                      <p className="text-2xl font-bold tracking-tight mt-0.5">{avgScore}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Reservas no Periodo
                      </p>
                      <p className="text-2xl font-bold tracking-tight mt-0.5">{totalBookings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                      <TrendingDown className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Economia Potencial
                      </p>
                      <p className="text-2xl font-bold text-green-600 tracking-tight mt-0.5">
                        R$ {Math.round(totalSpent * 0.12).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Top Hotels + Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Top Hoteis</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-64 rounded-lg" />
              ) : (
                <TopHotelsTable hotels={topHotels} />
              )}
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Mapa de Calor</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-64 rounded-lg" />
              ) : (
                <CityHeatmap cities={cities} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Price Trends */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Tendencia de Precos (12 semanas)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 rounded-lg" />
            ) : (
              <PriceTrendsChart trends={trends} />
            )}
          </CardContent>
        </Card>

        {/* Insights + ROI */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-3">
            {loading ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))
            ) : (
              insights.map((insight, i) => (
                <InsightCard key={i} insight={insight} />
              ))
            )}
          </div>
          <div>
            {loading ? (
              <Skeleton className="h-40 rounded-lg" />
            ) : (
              <RoiIndex
                avgStayscore={avgScore}
                avgSatisfaction={0.82}
                avgPricePerNight={
                  totalBookings > 0
                    ? totalSpent / totalBookings / 2
                    : 300
                }
                previousRoi={28}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
