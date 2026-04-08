import { setSession, getDemoUser } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();

  // Demo mode: login by role
  if (body.role) {
    const user = getDemoUser(body.role);
    if (!user) {
      return Response.json(
        { error: "Perfil demo inválido" },
        { status: 400 }
      );
    }
    await setSession(user);
    return Response.json({ user });
  }

  // Email/password mode (MVP: match demo users by email)
  if (body.email && body.password) {
    // For MVP, accept any password for demo emails
    const demoEmails: Record<string, "TRAVELER" | "TRAVEL_MANAGER" | "FINANCE_MANAGER"> = {
      "ana.silva@democorp.com": "TRAVELER",
      "carlos.oliveira@democorp.com": "TRAVEL_MANAGER",
      "maria.santos@democorp.com": "FINANCE_MANAGER",
    };

    const role = demoEmails[body.email];
    if (role) {
      const user = getDemoUser(role);
      if (user) {
        await setSession(user);
        return Response.json({ user });
      }
    }

    return Response.json(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  return Response.json(
    { error: "Email e senha ou perfil demo são obrigatórios" },
    { status: 400 }
  );
}
