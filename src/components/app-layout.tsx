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

  return (
    <>
      {showNavbar && <Navbar user={session.user} />}
      <main className="flex-1 pt-16 min-h-screen">
        {children}
      </main>
    </>
  );
}

export async function LandingLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  return (
    <>
      <Navbar user={session?.user ?? null} isLandingPage={true} />
      <main className="min-h-screen">{children}</main>
    </>
  );
}