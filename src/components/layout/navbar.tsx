"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, User, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<NavUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  function handleSearch() {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const isManager =
    user?.role === "TRAVEL_MANAGER" || user?.role === "FINANCE_MANAGER";

  return (
    <nav className="h-16 bg-white border-b border-border flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-50">
      {/* Logo */}
      <a href="/search" className="flex items-center gap-2 shrink-0">
        <span className="text-xl font-bold text-primary tracking-tight">
          StayScore
        </span>
        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          by Onfly
        </span>
      </a>

      {/* Search — full on desktop, icon on mobile */}
      <div className="flex-1 flex justify-center">
        {/* Desktop search */}
        <div className="relative w-full max-w-[520px] hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Busque por cidade, regiao ou hotel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-[#F2F5F7] border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />
        </div>
        {/* Mobile search icon */}
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="sm:hidden h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <Search className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Mobile expanded search */}
      {mobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-border p-3 sm:hidden z-40">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Busque por cidade, regiao ou hotel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                handleKeyDown(e);
                if (e.key === "Enter") setMobileSearchOpen(false);
              }}
              autoFocus
              className="w-full h-10 pl-10 pr-4 rounded-full bg-[#F2F5F7] border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
          </div>
        </div>
      )}

      {/* User menu */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0 hover:bg-primary/90 transition-colors">
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/search")}>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            {isManager && (
              <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
}
