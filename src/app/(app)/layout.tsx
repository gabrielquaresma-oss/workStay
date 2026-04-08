import { cookies } from "next/headers";
import { Navbar } from "@/components/layout/navbar";
import { getDemoUser, setSession } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("stayscore-session");

  if (!session?.value) {
    const demoUser = getDemoUser("TRAVEL_MANAGER");
    await setSession(demoUser!);
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
