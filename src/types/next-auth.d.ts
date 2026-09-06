import { DefaultSession } from "next-auth";
import { Role } from "@/lib/constants";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      pointBalance: number;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    pointBalance: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    pointBalance?: number;
  }
}
