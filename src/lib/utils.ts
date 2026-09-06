export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function formatCurrency(num: number): string {
  return `${formatNumber(num)} pts`;
}