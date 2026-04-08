"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, MapPin, Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HotelCard } from "@/components/hotel/hotel-card";
import { SurveyBanner } from "@/components/survey/survey-banner";
import { ErrorState } from "@/components/ui/error-state";
import { HeroSection } from "@/components/home/hero-section";
import { DynamicTitle } from "@/components/home/dynamic-title";
import { FeaturedSections } from "@/components/home/featured-sections";
import { Footer } from "@/components/layout/footer";
import type { HotelSearchResult, FeaturedSection } from "@/types/hotel";

// ==================== HOMEPAGE VIEW ====================

function HomepageView() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [sections, setSections] = useState<FeaturedSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = selectedCity
      ? `?city=${encodeURIComponent(selectedCity)}`
      : "";
    fetch(`/api/hotels/featured${params}`)
      .then((res) => res.json())
      .then((data) => setSections(data.sections ?? []))
      .catch(() => setSections([]))
      .finally(() => setLoading(false));
  }, [selectedCity]);

  return (
    <div className="bg-[#F7F8FA]">
      <HeroSection
        selectedCity={selectedCity}
        onCitySelect={setSelectedCity}
      />
      <DynamicTitle selectedCity={selectedCity} />

      {loading ? (
        <div className="px-[100px] pb-14">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="w-7 h-7 rounded-lg" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <div className="flex gap-3.5">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="flex-1">
                    <Skeleton className="h-[130px] rounded-t-xl" />
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2 w-1/2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <FeaturedSections sections={sections} />
      )}

      <Footer />
    </div>
  );
}

// ==================== SEARCH RESULTS VIEW ====================

const SUGGESTED_CITIES = [
  { label: "Sao Paulo", query: "Hoteis em Sao Paulo" },
  { label: "Rio de Janeiro", query: "Hoteis no Rio de Janeiro" },
  { label: "Belo Horizonte", query: "Hoteis em Belo Horizonte" },
  { label: "Curitiba", query: "Hoteis em Curitiba" },
  { label: "Brasilia", query: "Hoteis em Brasilia" },
];

function SearchResultsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const weightsParam = searchParams.get("weights");
  const summaryParam = searchParams.get("summary");
  const promptParam = searchParams.get("prompt");

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<HotelSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);

  // Filters
  const [minScore, setMinScore] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState("stayscore");
  const [showFilters, setShowFilters] = useState(false);

  const doSearch = useCallback(
    async (q: string, weights?: string | null) => {
      if (!q.trim()) return;
      setLoading(true);
      setSearched(true);
      setError(false);

      const params = new URLSearchParams({ q: q.trim() });
      if (minScore > 0) params.set("min_score", String(minScore));
      if (maxPrice > 0) params.set("max_price", String(maxPrice));
      if (sort !== "stayscore") params.set("sort", sort);
      if (weights) params.set("weights", weights);

      try {
        const res = await fetch(`/api/hotels/search?${params.toString()}`);
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults(data.hotels ?? []);
      } catch {
        setResults([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [minScore, maxPrice, sort]
  );

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery, weightsParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") doSearch(query);
  }

  const hasResults = searched && !loading && !error;

  return (
    <div>
      {/* Hero section - shown when no search performed */}
      {!searched && (
        <div className="bg-gradient-to-r from-[#2872FA] to-[#009EFB] text-white">
          <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-center">
              Encontre o hotel ideal para trabalhar
            </h1>
            <p className="text-blue-100 text-center mt-3 text-base sm:text-lg max-w-2xl mx-auto">
              Hoteis avaliados por viajantes corporativos com base em Wi-Fi, espaco de trabalho e produtividade
            </p>

            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Busque por cidade, regiao ou hotel..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full h-14 pl-13 pr-32 rounded-full bg-white text-foreground text-base shadow-lg placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-white/30 transition-shadow"
                />
                <Button
                  onClick={() => doSearch(query)}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 rounded-full bg-gradient-to-r from-[#2872FA] to-[#009EFB] hover:from-[#1D5FE0] hover:to-[#008DE0] text-white shadow-md"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SUGGESTED_CITIES.map((city) => (
                <button
                  key={city.label}
                  onClick={() => {
                    setQuery(city.query);
                    doSearch(city.query);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-sm transition-colors cursor-pointer backdrop-blur-sm"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {city.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 pt-6">
        <SurveyBanner />
      </div>

      {searched && (
        <div className="max-w-5xl mx-auto px-4 pt-6">
          {/* AI Interpretation Banner */}
          {summaryParam && (
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 mb-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#009EFB] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#1E3A5F]">
                  {summaryParam}
                </p>
                {promptParam && (
                  <p className="text-xs text-[#6B7280] mt-1">
                    Baseado em: &ldquo;{promptParam}&rdquo;
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Busque por cidade, regiao ou hotel..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-11 pl-10 pr-4 rounded-full bg-white border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              />
            </div>
            <Button
              onClick={() => doSearch(query)}
              disabled={loading}
              className="rounded-full px-6"
            >
              Buscar
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-full shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-4 mb-4 p-4 bg-white rounded-xl border transition-all">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">StayScore min:</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={minScore || ""}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-20 h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="0"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">Preco max (R$):</label>
                <input
                  type="number"
                  min={0}
                  value={maxPrice || ""}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-24 h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="0"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">Ordenar:</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm cursor-pointer"
                >
                  <option value="stayscore">StayScore</option>
                  <option value="price">Preco</option>
                  <option value="value">Custo-beneficio</option>
                </select>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => doSearch(query)}
                className="rounded-lg"
              >
                Aplicar
              </Button>
            </div>
          )}
        </div>
      )}

      <div className={searched ? "bg-[#F2F5F7] py-6 mt-2" : ""}>
        <div className="max-w-5xl mx-auto px-4">
          {hasResults && results.length > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              {results.length} hoteis encontrados
            </p>
          )}

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex bg-white rounded-xl border overflow-hidden">
                  <Skeleton className="w-[200px] h-[160px] shrink-0" />
                  <div className="flex-1 p-5 space-y-3">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-72" />
                    <Skeleton className="h-3 w-32" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((result) => (
                <HotelCard key={result.hotel.id} result={result} />
              ))}
            </div>
          )}

          {!loading && !searched && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/10 mb-6">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Busque uma cidade para encontrar os melhores hoteis para trabalho
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                Analise StayScores, avaliacoes de viajantes corporativos e coworkings proximos
              </p>
            </div>
          )}

          {!loading && error && (
            <ErrorState onRetry={() => doSearch(query)} />
          )}

          {!loading && searched && !error && results.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-muted mb-6">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Nenhum hotel encontrado
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Tente outra cidade ou ajuste os filtros.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== PAGE COMPONENT ====================

export default function SearchPage() {
  const searchParams = useSearchParams();
  const hasQuery = searchParams.has("q") && searchParams.get("q")?.trim();

  if (hasQuery) {
    return <SearchResultsView />;
  }

  return <HomepageView />;
}
