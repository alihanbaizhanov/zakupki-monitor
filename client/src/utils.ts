import type { Purchase } from './types';
import { FINAL_STATUSES } from './types';

export function isOverdue(p: Purchase): boolean {
  if (!p.plannedDate) return false;
  if (FINAL_STATUSES.includes(p.status)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const planned = new Date(p.plannedDate);
  return planned < today;
}

export function formatAmount(n: number): string {
  return new Intl.NumberFormat('ru-RU').format(n || 0);
}
