"use client";

import { useState, useEffect } from "react";
import {
  Home,
  ArrowLeftRight,
  Briefcase,
  ClipboardCheck,
  Settings2,
  UserCog,
  CircleHelp,
  Bell,
  ChevronDown,
} from "lucide-react";

interface NavUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const NAV_ITEMS = [
  { label: "Início", icon: Home, active: true, href: "/search" },
  { label: "Viagens", icon: ArrowLeftRight, hasChevron: true },
  { label: "Despesas", icon: Briefcase, hasChevron: true },
  { label: "Aprovações", icon: ClipboardCheck },
  { label: "Gestão", icon: Settings2, hasChevron: true },
  { label: "Configurações", icon: UserCog, hasChevron: true },
];

export function OnflyNavbar() {
  const [user, setUser] = useState<NavUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const displayName = user?.name
    ? user.name.split(" ")[0] +
      (user.name.split(" ").length > 1
        ? " " + user.name.split(" ")[1]?.[0] + "."
        : "")
    : "";

  return (
    <nav className="h-14 bg-white border-b border-[#E5E9F0] flex items-center px-7 sticky top-0 z-50">
      {/* Logo */}
      <a
        href="/search"
        className="flex items-center gap-1.5 mr-7 shrink-0"
      >
        <span className="text-[22px] font-bold text-[#009EFB] tracking-tight leading-none">
          onfly
        </span>
        <span className="w-[7px] h-[7px] bg-[#009EFB] rounded-full self-end mb-[1px]" />
      </a>

      {/* Nav items */}
      <div className="flex items-center gap-0.5 flex-1">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href || "#"}
            className={`flex items-center gap-[5px] px-2.5 py-1.5 rounded-md text-[13px] font-medium whitespace-nowrap transition-colors ${
              item.active
                ? "text-[#009EFB]"
                : "text-[#374151] hover:bg-[#F0F7FF] hover:text-[#009EFB]"
            }`}
          >
            <item.icon className="w-[15px] h-[15px] shrink-0 opacity-70" />
            {item.label}
            {item.hasChevron && (
              <ChevronDown className="w-[10px] h-[10px] opacity-45" />
            )}
          </a>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto shrink-0">
        {/* Help */}
        <button className="flex items-center gap-1 text-[13px] font-medium text-[#6B7280] px-2.5 py-1.5 rounded-md hover:text-[#009EFB] hover:bg-[#F0F7FF] transition-colors">
          <CircleHelp className="w-[14px] h-[14px]" />
          Ajuda
        </button>

        {/* Notification bell */}
        <button className="relative w-8 h-8 rounded-full border border-[#EAECF0] bg-white flex items-center justify-center hover:border-[#009EFB] transition-colors">
          <Bell className="w-[14px] h-[14px] text-[#6B7280]" />
          <span className="absolute -top-[3px] -right-[3px] w-[15px] h-[15px] bg-[#009EFB] rounded-full text-[9px] text-white flex items-center justify-center font-bold border-2 border-white">
            3
          </span>
        </button>

        {/* Avatar */}
        {user && (
          <button className="flex items-center gap-[7px] py-[3px] px-[3px] pr-2.5 rounded-[20px] border border-[#EAECF0] hover:border-[#009EFB] hover:bg-[#F0FBFF] transition-colors">
            <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#009EFB] to-[#0070E0] flex items-center justify-center text-[11px] font-semibold text-white">
              {initials}
            </div>
            <span className="text-[13px] font-medium text-[#374151]">
              {displayName}
            </span>
            <ChevronDown className="w-[9px] h-[9px] text-[#9CA3AF]" />
          </button>
        )}
      </div>
    </nav>
  );
}
