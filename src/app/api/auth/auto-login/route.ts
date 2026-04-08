import { setSession, getDemoUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const demoUser = getDemoUser("TRAVEL_MANAGER")!;
  await setSession(demoUser);

  // Redirect back to the page the user was trying to access
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo") || "/search";
  redirect(returnTo);
}
