import { Role, MarketStatus, LedgerReason } from "../src/lib/constants";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  await db.pointLedger.deleteMany();
  await db.wager.deleteMany();
  await db.outcome.deleteMany();
  await db.market.deleteMany();
  await db.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await db.user.create({
    data: {
      name: "Class Admin",
      email: "admin@class.local",
      passwordHash,
      role: Role.ADMIN,
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

  const rajFan = await db.user.create({
    data: {
      name: "Priya",
      email: "priya@class.local",
      passwordHash,
      role: Role.MEMBER,
      pointBalance: 1000,
      ledger: {
        create: {
          delta: 1000,
          reason: LedgerReason.SIGNUP_BONUS,
        },
      },
    },
  });

  const skeptic = await db.user.create({
    data: {
      name: "Arjun",
      email: "arjun@class.local",
      passwordHash,
      role: Role.MEMBER,
      pointBalance: 1000,
      ledger: {
        create: {
          delta: 1000,
          reason: LedgerReason.SIGNUP_BONUS,
        },
      },
    },
  });

  const openMarket = await db.market.create({
    data: {
      title: "Will Raj show up early today?",
      description: "Resolves after first bell. Early = before 9:00 AM.",
      status: MarketStatus.OPEN,
      createdById: rajFan.id,
      approvedById: admin.id,
      closesAt: new Date(Date.now() + 1000 * 60 * 60 * 4),
      outcomes: {
        create: [
          { label: "Yes, before 9:00" },
          { label: "No, late as usual" },
        ],
      },
    },
    include: { outcomes: true },
  });

  await db.market.create({
    data: {
      title: "Will the professor cancel class?",
      description: "Friday edition — admin resolves after attendance.",
      status: MarketStatus.PENDING,
      createdById: skeptic.id,
      outcomes: {
        create: [{ label: "Yes" }, { label: "No" }],
      },
    },
  });

  const earlyOutcome = openMarket.outcomes[0];
  const lateOutcome = openMarket.outcomes[1];

  await db.user.update({
    where: { id: rajFan.id },
    data: { pointBalance: { decrement: 150 } },
  });
  await db.wager.create({
    data: {
      userId: rajFan.id,
      marketId: openMarket.id,
      outcomeId: earlyOutcome.id,
      amount: 150,
    },
  });
  await db.pointLedger.create({
    data: {
      userId: rajFan.id,
      delta: -150,
      reason: LedgerReason.WAGER,
      marketId: openMarket.id,
      note: "Seed wager",
    },
  });

  await db.user.update({
    where: { id: skeptic.id },
    data: { pointBalance: { decrement: 300 } },
  });
  await db.wager.create({
    data: {
      userId: skeptic.id,
      marketId: openMarket.id,
      outcomeId: lateOutcome.id,
      amount: 300,
    },
  });
  await db.pointLedger.create({
    data: {
      userId: skeptic.id,
      delta: -300,
      reason: LedgerReason.WAGER,
      marketId: openMarket.id,
      note: "Seed wager",
    },
  });

  console.log("Seed complete");
  console.log("Admin login: admin@class.local / password123");
  console.log("Member login: priya@class.local / password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
