import { auth } from "@/lib/auth";
import Link from "next/link";
import { signOut } from "@/lib/auth";

export async function AppHeader() {
  const session = await auth();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/dashboard" className="text-lg font-bold text-emerald-400">
          MCA Betting
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <Link href="/suggest" className="hover:text-white">
            Suggest Bet
          </Link>
          <Link href="/leaderboard" className="hover:text-white">
            Leaderboard
          </Link>
          {session?.user.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-amber-300 text-amber-400">
              Admin
            </Link>
          )}
        </nav>
        {session?.user && (
          <div className="flex items-center gap-3 text-sm">
            <Link
              href={`/profile/${session.user.id}`}
              className="hidden sm:inline text-zinc-300 hover:text-white"
            >
              {session.user.name}
            </Link>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-semibold text-emerald-300">
              {session.user.pointBalance.toLocaleString()} pts
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800"
              >
                Log out
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
