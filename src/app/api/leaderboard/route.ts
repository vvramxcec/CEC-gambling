import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-auth";
import { getLeaderboard } from "@/lib/betting-service";

export async function GET() {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;

  const leaderboard = await getLeaderboard();
  return NextResponse.json(leaderboard);
}
