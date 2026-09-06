export const Role = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const MarketStatus = {
  PENDING: "PENDING",
  OPEN: "OPEN",
  LOCKED: "LOCKED",
  RESOLVED: "RESOLVED",
  VOID: "VOID",
  REJECTED: "REJECTED",
} as const;

export type MarketStatus = (typeof MarketStatus)[keyof typeof MarketStatus];

export const LedgerReason = {
  SIGNUP_BONUS: "SIGNUP_BONUS",
  WAGER: "WAGER",
  PAYOUT: "PAYOUT",
  REFUND: "REFUND",
  ADMIN_ADJUST: "ADMIN_ADJUST",
} as const;

export type LedgerReason = (typeof LedgerReason)[keyof typeof LedgerReason];
