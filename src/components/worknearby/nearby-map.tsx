"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

interface Workspace {
  id: string;
  name: string;
  type: "COWORKING" | "CAFE";
  latitude: number;
  longitude: number;
  distance_meters: number;
  google_rating: number | null;
}

interface NearbyMapProps {
  hotelLat: number;
  hotelLng: number;
  hotelName: string;
  workspaces: Workspace[];
  highlightedId?: string | null;
}

let optionsSet = false;

export function NearbyMap({
  hotelLat,
  hotelLng,
  hotelName,
  workspaces,
  highlightedId,
}: NearbyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) {
      setMapError(true);
      return;
    }

    if (!optionsSet) {
      setOptions({ key: apiKey, v: "weekly" });
      optionsSet = true;
    }

    (async () => {
      try {
        const { Map } = await importLibrary("maps");
        const { AdvancedMarkerElement } = await importLibrary("marker");

        const map = new Map(mapRef.current!, {
          center: { lat: hotelLat, lng: hotelLng },
          zoom: 15,
          mapId: "stayscore-nearby",
        });

        // 1km radius circle
        new google.maps.Circle({
          map,
          center: { lat: hotelLat, lng: hotelLng },
          radius: 1000,
          strokeColor: "#7C3AED",
          strokeOpacity: 0.5,
          strokeWeight: 2,
          fillColor: "#7C3AED",
          fillOpacity: 0.05,
        });

        // Hotel marker (purple)
        const hotelPin = document.createElement("div");
        hotelPin.style.cssText =
          "width:32px;height:32px;border-radius:50%;background:#7C3AED;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.3)";
        hotelPin.textContent = "H";

        const hotelMarker = new AdvancedMarkerElement({
          map,
          position: { lat: hotelLat, lng: hotelLng },
          content: hotelPin,
          title: hotelName,
        });

        const hotelInfo = new google.maps.InfoWindow({
          content: `<div style="padding:4px"><strong>${hotelName}</strong></div>`,
        });
        hotelMarker.addListener("click", () => {
          hotelInfo.open({ anchor: hotelMarker, map });
        });

        // Workspace markers
        workspaces.forEach((ws) => {
          const isCoworking = ws.type === "COWORKING";
          const color = isCoworking ? "#3B82F6" : "#22C55E";

          const pin = document.createElement("div");
          const isHighlighted = highlightedId === ws.id;
          pin.style.cssText = `width:28px;height:28px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.2);${
            isHighlighted ? "transform:scale(1.3);box-shadow:0 0 0 3px rgba(0,0,0,0.3);" : ""
          }`;
          pin.textContent = isCoworking ? "C" : "F";

          const marker = new AdvancedMarkerElement({
            map,
            position: { lat: ws.latitude, lng: ws.longitude },
            content: pin,
            title: ws.name,
          });

          const infoContent = `<div style="padding:4px">
            <strong>${ws.name}</strong><br/>
            <span style="font-size:12px">${ws.distance_meters}m${ws.google_rating ? ` · ★ ${ws.google_rating}` : ""}</span>
          </div>`;

          const infoWindow = new google.maps.InfoWindow({ content: infoContent });
          marker.addListener("click", () => {
            infoWindow.open({ anchor: marker, map });
          });
        });
      } catch {
        setMapError(true);
      }
    })();
  }, [hotelLat, hotelLng, hotelName, workspaces, highlightedId]);

  if (mapError) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        <p className="text-sm">
          Mapa indisponível. Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
        </p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg" />;
}
