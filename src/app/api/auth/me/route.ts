import { getCurrentUser, getDemoUser, setSession } from "@/lib/auth";

export async function GET() {
  let user = await getCurrentUser();

  if (!user) {
    const demoUser = getDemoUser("TRAVEL_MANAGER");
    await setSession(demoUser!);
    user = demoUser;
  }

  return Response.json({ user });
}
