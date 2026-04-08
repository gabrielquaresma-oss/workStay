import { cookies } from "next/headers";

const COOKIE_NAME = "stayscore-session";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "TRAVELER" | "TRAVEL_MANAGER" | "FINANCE_MANAGER" | "ADMIN";
  companyId: string;
}

interface SessionPayload {
  userId: string;
  role: SessionUser["role"];
  companyId: string;
}

// Demo users for MVP hackathon
const DEMO_USERS: Record<string, SessionUser> = {
  TRAVELER: {
    id: "demo-traveler-001",
    name: "Ana Silva",
    email: "ana.silva@democorp.com",
    role: "TRAVELER",
    companyId: "demo-company-001",
  },
  TRAVEL_MANAGER: {
    id: "demo-manager-001",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@democorp.com",
    role: "TRAVEL_MANAGER",
    companyId: "demo-company-001",
  },
  FINANCE_MANAGER: {
    id: "demo-finance-001",
    name: "Maria Santos",
    email: "maria.santos@democorp.com",
    role: "FINANCE_MANAGER",
    companyId: "demo-company-001",
  },
};

/**
 * Get the current user from the session cookie.
 * Returns null if no valid session exists.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const payload: SessionPayload = JSON.parse(sessionCookie.value);
    // Look up the demo user by role
    const user = Object.values(DEMO_USERS).find(
      (u) => u.id === payload.userId
    );
    if (user) return user;

    // Fallback: construct from payload
    return {
      id: payload.userId,
      name: "Usuário",
      email: "user@company.com",
      role: payload.role,
      companyId: payload.companyId,
    };
  } catch {
    return null;
  }
}

/**
 * Set the session cookie with user data.
 * Only callable from Route Handlers or Server Functions.
 */
export async function setSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  const payload: SessionPayload = {
    userId: user.id,
    role: user.role,
    companyId: user.companyId,
  };

  cookieStore.set(COOKIE_NAME, JSON.stringify(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear the session cookie.
 * Only callable from Route Handlers or Server Functions.
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Get a demo user by role. Used for quick demo login.
 */
export function getDemoUser(
  role: "TRAVELER" | "TRAVEL_MANAGER" | "FINANCE_MANAGER"
): SessionUser | null {
  return DEMO_USERS[role] ?? null;
}

/**
 * Get current user or auto-create a TRAVEL_MANAGER session.
 * Use this in API routes to ensure there is always a valid session.
 */
export async function getOrCreateUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (user) return user;

  const demoUser = getDemoUser("TRAVEL_MANAGER")!;
  await setSession(demoUser);
  return demoUser;
}
