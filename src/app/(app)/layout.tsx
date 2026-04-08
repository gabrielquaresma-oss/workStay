import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OnflyNavbar } from "@/components/layout/onfly-navbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("stayscore-session");

  if (!session?.value) {
    redirect("/api/auth/auto-login");
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <OnflyNavbar />
      <main>{children}</main>
    </div>
  );
}
