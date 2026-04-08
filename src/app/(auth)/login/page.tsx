"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type DemoRole = "TRAVELER" | "TRAVEL_MANAGER" | "FINANCE_MANAGER";

const DEMO_ROLES: { value: DemoRole; label: string }[] = [
  { value: "TRAVELER", label: "Viajante" },
  { value: "TRAVEL_MANAGER", label: "Travel Manager" },
  { value: "FINANCE_MANAGER", label: "Gestor Financeiro" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<DemoRole>("TRAVELER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDemoLogin() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });
      if (!res.ok) throw new Error("Falha no login");
      router.push("/search");
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Falha no login");
      router.push("/search");
    } catch {
      setError("Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/20 to-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">StayScore</h1>
          <p className="text-sm text-muted-foreground">
            Inteligência hoteleira para viajantes corporativos
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          {/* Email/password form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full h-[44px] rounded-[8px]"
              disabled={loading || !email || !password}
            >
              Entrar com Onfly
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                ou acesso demo
              </span>
            </div>
          </div>

          {/* Demo role selector */}
          <div className="space-y-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as DemoRole)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {DEMO_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              className="w-full h-[44px] rounded-[8px]"
              disabled={loading}
              onClick={handleDemoLogin}
            >
              {loading ? "Entrando..." : "Entrar como Demo"}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground">
            Produto criado para o Hackathon Onfly 2026
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
