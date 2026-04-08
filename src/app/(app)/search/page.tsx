"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, MapPin, Building2, Loader2 } from "lucide-react";
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

// ==================== HELPERS ====================

function sortResults(results: HotelSearchResult[], sort: string): HotelSearchResult[] {
  return [...results].sort((a, b) => {
    if (sort === "price") {
      return (a.price_per_night ?? Infinity) - (b.price_per_night ?? Infinity);
    }
    if (sort === "value") {
      const valueA = (a.stayscore?.total_score ?? 0) / (a.price_per_night ?? 1);
      const valueB = (b.stayscore?.total_score ?? 0) / (b.price_per_night ?? 1);
      return valueB - valueA;
    }
    return (b.stayscore?.total_score ?? 0) - (a.stayscore?.total_score ?? 0);
  });
}

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

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<HotelSearchResult[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);

  // Filters
  const [minScore, setMinScore] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState("stayscore");
  const [showFilters, setShowFilters] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Client-side filtering + sorting
  const displayedResults = useMemo(() => {
    let filtered = results;
    if (minScore > 0) {
      filtered = filtered.filter(
        (r) => (r.stayscore?.total_score ?? 0) >= minScore
      );
    }
    if (maxPrice > 0) {
      filtered = filtered.filter(
        (r) => (r.price_per_night ?? 0) <= maxPrice
      );
    }
    return sortResults(filtered, sort);
  }, [results, minScore, maxPrice, sort]);

  const doSearch = useCallback(
    async (q: string, weights?: string | null) => {
      if (!q.trim()) return;

      // Cancel previous stream
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setStreaming(true);
      setSearched(true);
      setError(false);
      setResults([]);

      const params = new URLSearchParams({ q: q.trim() });
      if (weights) params.set("weights", weights);

      try {
        const res = await fetch(`/api/hotels/search?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Search failed");

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const msg = JSON.parse(line);
              if (msg.type === "hotel") {
                setResults((prev) => [...prev, msg.data]);
              } else if (msg.type === "error") {
                setError(true);
              }
            } catch {
              // Skip malformed lines
            }
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(true);
      } finally {
        setStreaming(false);
      }
    },
    []
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

  const hasResults = searched && !streaming && !error;

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
                  disabled={streaming}
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
              disabled={streaming}
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
            </div>
          )}
        </div>
      )}

      <div className={searched ? "bg-[#F2F5F7] py-6 mt-2" : ""}>
        <div className="max-w-5xl mx-auto px-4">
          {searched && displayedResults.length > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              {displayedResults.length} hoteis encontrados
              {streaming && " (buscando mais...)"}
            </p>
          )}

          {/* Skeleton: only when streaming started but no results yet */}
          {streaming && results.length === 0 && (
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

          {/* Results - shown progressively as they stream in */}
          {displayedResults.length > 0 && (
            <div className="space-y-4">
              {displayedResults.map((result) => (
                <HotelCard key={result.hotel.id} result={result} />
              ))}

              {/* Bottom loading indicator while more results stream */}
              {streaming && (
                <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Buscando mais hoteis...
                </div>
              )}
            </div>
          )}

          {!streaming && !searched && (
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

          {!streaming && error && (
            <ErrorState onRetry={() => doSearch(query)} />
          )}

          {!streaming && searched && !error && results.length === 0 && (
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
