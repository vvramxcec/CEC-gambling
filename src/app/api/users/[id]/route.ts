import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/users/[id]">,
) {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;

  const { id } = await context.params;

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      pointBalance: true,
      role: true,
      createdAt: true,
      ledger: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          market: { select: { id: true, title: true } },
        },
      },
      wagers: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          market: { select: { id: true, title: true, status: true } },
          outcome: { select: { label: true } },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
