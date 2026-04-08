"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  { id: "overview", label: "Visão Geral", icon: BarChart3 },
  { id: "hotels", label: "Top Hotéis", icon: Building2 },
  { id: "heatmap", label: "Mapa de Calor", icon: Map },
  { id: "trends", label: "Tendências", icon: LineChart },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [topHotels, setTopHotels] = useState<TopHotel[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    // Check user role
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.role === "TRAVELER") {
          router.replace("/search");
          return;
        }
        setUserRole(data?.user?.role ?? null);
      })
      .catch(() => {});

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
  }, [router]);

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

  if (!userRole && !loading) {
    return null; // Redirecting
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-60 border-r bg-card p-4 shrink-0 hidden lg:block">
        <nav className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
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
            Período
          </label>
          <select className="w-full mt-1 h-9 rounded-md border bg-background px-2 text-sm">
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="12m">Últimos 12 meses</option>
          </select>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))
          ) : (
            <>
              <Card>
                <CardContent className="pt-4 flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total em Hospedagens
                    </p>
                    <p className="text-xl font-bold">
                      R$ {totalSpent.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      StayScore Médio
                    </p>
                    <p className="text-xl font-bold">{avgScore}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Reservas no Período
                    </p>
                    <p className="text-xl font-bold">{totalBookings}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 flex items-center gap-3">
                  <TrendingDown className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Economia Potencial
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      R$ {Math.round(totalSpent * 0.12).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Top Hotels + Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Hotéis</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-64" />
              ) : (
                <TopHotelsTable hotels={topHotels} />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Calor</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-64" />
              ) : (
                <CityHeatmap cities={cities} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Price Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Preços (12 semanas)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64" />
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
                <Skeleton key={i} className="h-24" />
              ))
            ) : (
              insights.map((insight, i) => (
                <InsightCard key={i} insight={insight} />
              ))
            )}
          </div>
          <div>
            {loading ? (
              <Skeleton className="h-32" />
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
