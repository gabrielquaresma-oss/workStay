"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

interface CityData {
  city: string;
  state: string;
  lat: number;
  lng: number;
  total_spent: number;
  avg_stayscore: number;
  bookings_count: number;
}

interface CityHeatmapProps {
  cities: CityData[];
}

let optionsSetMap = false;

function getCircleColor(score: number): string {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#EAB308";
  return "#EF4444";
}

export function CityHeatmap({ cities }: CityHeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) {
      setMapError(true);
      return;
    }

    if (!optionsSetMap) {
      setOptions({ key: apiKey, v: "weekly" });
      optionsSetMap = true;
    }

    (async () => {
      try {
        const { Map } = await importLibrary("maps");

        const map = new Map(mapRef.current!, {
          center: { lat: -15.78, lng: -47.93 },
          zoom: 4,
          mapId: "stayscore-heatmap",
        });

        const maxSpent = Math.max(...cities.map((c) => c.total_spent));

        cities.forEach((city) => {
          const radius = 30000 + (city.total_spent / maxSpent) * 120000;
          const color = getCircleColor(city.avg_stayscore);

          const circle = new google.maps.Circle({
            map,
            center: { lat: city.lat, lng: city.lng },
            radius,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.3,
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `<div style="padding:8px">
              <strong>${city.city}, ${city.state}</strong><br/>
              <span>Gasto: R$ ${city.total_spent.toLocaleString("pt-BR")}</span><br/>
              <span>StayScore Médio: ${city.avg_stayscore}</span><br/>
              <span>Reservas: ${city.bookings_count}</span>
            </div>`,
          });

          circle.addListener("click", () => {
            infoWindow.setPosition({ lat: city.lat, lng: city.lng });
            infoWindow.open(map);
          });
        });
      } catch {
        setMapError(true);
      }
    })();
  }, [cities]);

  if (mapError) {
    return (
      <div className="w-full h-[350px] bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
        Mapa indisponível
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-[350px] rounded-lg" />;
}
