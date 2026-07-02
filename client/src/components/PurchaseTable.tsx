import type { Meta, Purchase, Role } from '../types';
import { EditableCell } from './EditableCell';
import { isOverdue, formatAmount } from '../utils';

export function PurchaseTable({
  purchases,
  meta,
  role,
  onUpdate,
  onDelete,
}: {
  purchases: Purchase[];
  meta: Meta;
  role: Role;
  onUpdate: (id: number, patch: Partial<Purchase>) => void;
  onDelete: (id: number) => void;
}) {
  const isAdmin = role === 'admin';
  const statusOptions = meta.statuses.map((s) => ({ value: s.id, label: s.label }));
  const categoryOptions = meta.categories.map((c) => ({ value: c, label: c }));
  const methodOptions = meta.methods.map((m) => ({ value: m, label: m }));

  return (
    <div className="table-wrap">
      <table className="purchase-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Наименование</th>
            <th>Категория</th>
            <th>Способ закупки</th>
            <th>Статус</th>
            <th>Сумма, тенге</th>
            <th>Плановая дата</th>
            <th>Поставщик</th>
            <th>№ договора</th>
            <th>Дата поставки</th>
            <th>Ответственный</th>
            <th>Комментарий</th>
            {isAdmin && <th></th>}
          </tr>
        </thead>
        <tbody>
          {purchases.map((p) => {
            const status = meta.statuses.find((s) => s.id === p.status);
            const overdue = isOverdue(p);
            return (
              <tr key={p.id} className={overdue ? 'row-overdue' : ''}>
                <td>{p.id}</td>
                <td>
                  <EditableCell value={p.name} type="text" editable={isAdmin}
                    onSave={(v) => onUpdate(p.id, { name: String(v) })} />
                </td>
                <td>
                  <EditableCell value={p.category} type="select" options={categoryOptions} editable={isAdmin}
                    onSave={(v) => onUpdate(p.id, { category: String(v) })} />
                </td>
                <td>
                  <EditableCell value={p.method} type="select" options={methodOptions} editable={isAdmin}
                    onSave={(v) => onUpdate(p.id, { method: String(v) })} />
                </td>
                <td>
                  <EditableCell
                    value={p.status}
                    type="select"
                    options={statusOptions}
                    editable={isAdmin}
                    displayNode={
                      <span className="status-badge" style={{ backgroundColor: status?.color }}>
                        {status?.label ?? p.status}
                      </span>
                    }
                    onSave={(v) => onUpdate(p.id, { status: String(v) })}
                  />
                </td>
                <td>
                  <EditableCell value={p.amount} type="number" editable={isAdmin}
                    displayValue={formatAmount(p.amount)}
                    onSave={(v) => onUpdate(p.id, { amount: Number(v) })} />
                </td>
                <td>
                  <EditableCell value={p.plannedDate} type="date" editable={isAdmin}
                    displayNode={
                      <span>
                        {p.plannedDate || '—'}
                        {overdue && <span className="overdue-icon" title="Просрочено"> ⚠</span>}
                      </span>
                    }
                    onSave={(v) => onUpdate(p.id, { plannedDate: String(v) })} />
                </td>
                <td>
                  <EditableCell value={p.supplier} type="text" editable={isAdmin}
                    onSave={(v) => onUpdate(p.id, { supplier: String(v) })} />
                </td>
                <td>
                  <EditableCell value={p.contractNumber} type="text" editable={isAdmin}
                    onSave={(v) => onUpdate(p.id, { contractNumber: String(v) })} />
                </td>
                <td>
                  <EditableCell value={p.deliveryDate} type="date" editable={isAdmin}
                    displayValue={p.deliveryDate || '—'}
                    onSave={(v) => onUpdate(p.id, { deliveryDate: String(v) })} />
                </td>
                <td>
                  <EditableCell value={p.responsible} type="text" editable={isAdmin}
                    onSave={(v) => onUpdate(p.id, { responsible: String(v) })} />
                </td>
                <td>
                  <EditableCell value={p.comment} type="text" editable={isAdmin}
                    onSave={(v) => onUpdate(p.id, { comment: String(v) })} />
                </td>
                {isAdmin && (
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => {
                        if (confirm(`Удалить закупку "${p.name}"?`)) onDelete(p.id);
                      }}
                    >
                      Удалить
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
          {purchases.length === 0 && (
            <tr>
              <td colSpan={isAdmin ? 13 : 12} className="empty-row">Нет закупок по заданным фильтрам</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
