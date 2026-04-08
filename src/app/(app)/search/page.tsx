"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { HotelCard } from "@/components/hotel/hotel-card";
import type { HotelSearchResult } from "@/types/hotel";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<HotelSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Filters
  const [minScore, setMinScore] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState("stayscore");
  const [showFilters, setShowFilters] = useState(false);

  const doSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) return;
      setLoading(true);
      setSearched(true);

      const params = new URLSearchParams({ q: q.trim() });
      if (minScore > 0) params.set("min_score", String(minScore));
      if (maxPrice > 0) params.set("max_price", String(maxPrice));
      if (sort !== "stayscore") params.set("sort", sort);

      // Update URL
      router.replace(`/search?${params.toString()}`);

      try {
        const res = await fetch(`/api/hotels/search?${params.toString()}`);
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults(data.hotels ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [minScore, maxPrice, sort, router]
  );

  // Auto-search on mount if query in URL
  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") doSearch(query);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Busque por cidade, região ou hotel..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>
        <Button onClick={() => doSearch(query)} disabled={loading}>
          Buscar
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 mb-4 p-4 bg-card rounded-lg border">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">StayScore mín:</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={minScore || ""}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-20"
              placeholder="0"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Preço máx (R$):</label>
            <Input
              type="number"
              min={0}
              value={maxPrice || ""}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24"
              placeholder="0"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Ordenar:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="stayscore">StayScore</option>
              <option value="price">Preço</option>
              <option value="value">Custo-benefício</option>
            </select>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => doSearch(query)}
          >
            Aplicar
          </Button>
        </div>
      )}

      {/* Results counter */}
      {searched && !loading && (
        <p className="text-sm text-muted-foreground mb-4">
          {results.length} hotéis encontrados
        </p>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex bg-card rounded-lg border overflow-hidden">
              <Skeleton className="w-[200px] h-[150px] shrink-0" />
              <div className="flex-1 p-4 space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-72" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((result) => (
            <HotelCard key={result.hotel.id} result={result} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !searched && (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-muted-foreground">
            Busque uma cidade para encontrar os melhores hotéis para trabalho
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Ex: &quot;Hotéis em Belo Horizonte&quot;, &quot;São Paulo Paulista&quot;
          </p>
        </div>
      )}

      {/* No results */}
      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-muted-foreground">
            Nenhum hotel encontrado para essa busca.
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Tente outra cidade.
          </p>
        </div>
      )}
    </div>
  );
}
