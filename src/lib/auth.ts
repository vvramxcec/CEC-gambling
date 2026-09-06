import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { LedgerReason, Role } from "@/lib/constants";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2).max(40),
  inviteCode: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        inviteCode: { label: "Invite Code", type: "text" },
        mode: { label: "Mode", type: "text" },
      },
      async authorize(credentials) {
        const mode = credentials?.mode as string | undefined;

        if (mode === "signup") {
          const parsed = signupSchema.safeParse(credentials);
          if (!parsed.success) return null;

          const { email, password, name, inviteCode } = parsed.data;

          if (inviteCode !== process.env.CLASS_INVITE_CODE) {
            throw new Error("Invalid invite code");
          }

          const existing = await db.user.findUnique({ where: { email } });
          if (existing) {
            throw new Error("Email already registered");
          }

          const userCount = await db.user.count();
          const isAdmin =
            userCount === 0 || email === process.env.ADMIN_EMAIL;

          const passwordHash = await bcrypt.hash(password, 10);

          const user = await db.user.create({
            data: {
              email,
              name,
              passwordHash,
              role: isAdmin ? Role.ADMIN : Role.MEMBER,
              pointBalance: 1000,
              ledger: {
                create: {
                  delta: 1000,
                  reason: LedgerReason.SIGNUP_BONUS,
                  note: "Welcome bonus",
                },
              },
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as Role,
            pointBalance: user.pointBalance,
          };
        }

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as Role,
            pointBalance: user.pointBalance,
          };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.pointBalance = user.pointBalance;
      }

      if (trigger === "update" && token.id) {
        const freshUser = await db.user.findUnique({
          where: { id: token.id as string },
        });
        if (freshUser) {
          token.pointBalance = freshUser.pointBalance;
          token.role = freshUser.role;
          token.name = freshUser.name;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.pointBalance = token.pointBalance as number;
      }
      return session;
    },
  },
});
