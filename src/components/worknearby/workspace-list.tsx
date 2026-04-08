"use client";

import { WorkspaceCard } from "./workspace-card";

interface Workspace {
  id: string;
  name: string;
  type: "COWORKING" | "CAFE";
  distance_meters: number;
  google_rating: number | null;
  opening_hours: string[] | null;
  has_wifi: boolean;
  has_power_outlets: boolean;
  is_quiet: boolean;
}

interface WorkspaceListProps {
  workspaces: Workspace[];
  highlightedId: string | null;
  onHover: (id: string | null) => void;
}

export function WorkspaceList({
  workspaces,
  highlightedId,
  onHover,
}: WorkspaceListProps) {
  if (workspaces.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Nenhum espaço de trabalho encontrado nas proximidades.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
      {workspaces.map((ws) => (
        <WorkspaceCard
          key={ws.id}
          workspace={ws}
          isHighlighted={highlightedId === ws.id}
          onHover={onHover}
        />
      ))}
    </div>
  );
}
