import type { Purchase } from '../types';
import { FINAL_STATUSES } from '../types';
import { isOverdue, formatAmount } from '../utils';

export function SummaryPanel({ purchases }: { purchases: Purchase[] }) {
  const total = purchases.length;
  const inProgress = purchases.filter((p) => !FINAL_STATUSES.includes(p.status)).length;
  const overdue = purchases.filter(isOverdue).length;
  const done = purchases.filter((p) => p.status === 'done').length;
  const totalAmount = purchases.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const items = [
    { label: 'Всего закупок', value: total },
    { label: 'В работе', value: inProgress },
    { label: 'Просрочено', value: overdue, warn: overdue > 0 },
    { label: 'Завершено', value: done },
    { label: 'Сумма, тенге', value: formatAmount(totalAmount) },
  ];

  return (
    <div className="summary-panel">
      {items.map((it) => (
        <div className={`summary-card${it.warn ? ' warn' : ''}`} key={it.label}>
          <div className="summary-value">{it.value}</div>
          <div className="summary-label">{it.label}</div>
        </div>
      ))}
    </div>
  );
}
