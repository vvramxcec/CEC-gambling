import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";

interface AppLayoutProps {
  children: ReactNode;
  adminOnly?: boolean;
  showNavbar?: boolean;
}

export async function AppLayout({
  children,
  adminOnly = false,
  showNavbar = true,
}: AppLayoutProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (adminOnly && session.user.role !== "ADMIN") redirect("/dashboard");

  const user = {
    id: session.user.id,
    name: session.user.name ?? "",
    pointBalance: session.user.pointBalance,
    role: session.user.role,
  };

  return (
    <>
      {showNavbar && <Navbar user={user} />}
      <main className="flex-1 pt-16 min-h-screen">
        {children}
      </main>
    </>
  );
}

export async function LandingLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const user = session?.user ? {
    id: session.user.id,
    name: session.user.name ?? "",
    pointBalance: session.user.pointBalance,
    role: session.user.role,
  } : null;
  return (
    <>
      <Navbar user={user} isLandingPage={true} />
      <main className="min-h-screen">{children}</main>
    </>
  );
}