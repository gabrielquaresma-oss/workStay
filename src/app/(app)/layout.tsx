import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Navbar } from "@/components/layout/navbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("stayscore-session");

  if (!session?.value) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
