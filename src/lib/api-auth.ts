import { auth } from "@/lib/auth";
import { Role } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

export async function requireAdmin() {
  const result = await requireUser();
  if ("error" in result) return result;

  if (result.session.user.role !== Role.ADMIN) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return result;
}
