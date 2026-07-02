import type { Meta } from '../types';

export interface Filters {
  search: string;
  category: string;
  method: string;
  status: string;
  plannedFrom: string;
  plannedTo: string;
  deliveryFrom: string;
  deliveryTo: string;
}

export const emptyFilters: Filters = {
  search: '',
  category: '',
  method: '',
  status: '',
  plannedFrom: '',
  plannedTo: '',
  deliveryFrom: '',
  deliveryTo: '',
};

export function FilterBar({
  meta,
  filters,
  onChange,
}: {
  meta: Meta;
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="filter-bar">
      <input
        className="filter-search"
        placeholder="Поиск: наименование, поставщик, № договора, ответственный, комментарий"
        value={filters.search}
        onChange={(e) => set('search', e.target.value)}
      />
      <select value={filters.category} onChange={(e) => set('category', e.target.value)}>
        <option value="">Категория: все</option>
        {meta.categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select value={filters.method} onChange={(e) => set('method', e.target.value)}>
        <option value="">Способ закупки: все</option>
        {meta.methods.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <select value={filters.status} onChange={(e) => set('status', e.target.value)}>
        <option value="">Статус: все</option>
        {meta.statuses.map((s) => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>
      <label className="filter-date">
        Плановая дата
        <span>
          <input type="date" value={filters.plannedFrom} onChange={(e) => set('plannedFrom', e.target.value)} />
          –
          <input type="date" value={filters.plannedTo} onChange={(e) => set('plannedTo', e.target.value)} />
        </span>
      </label>
      <label className="filter-date">
        Дата поставки
        <span>
          <input type="date" value={filters.deliveryFrom} onChange={(e) => set('deliveryFrom', e.target.value)} />
          –
          <input type="date" value={filters.deliveryTo} onChange={(e) => set('deliveryTo', e.target.value)} />
        </span>
      </label>
      <button className="btn-reset" onClick={() => onChange(emptyFilters)}>
        Сбросить фильтры
      </button>
    </div>
  );
}

export function applyFilters(purchases: import('../types').Purchase[], f: Filters) {
  return purchases.filter((p) => {
    if (f.search) {
      const q = f.search.toLowerCase();
      const haystack = [p.name, p.supplier, p.contractNumber, p.responsible, p.comment]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (f.category && p.category !== f.category) return false;
    if (f.method && p.method !== f.method) return false;
    if (f.status && p.status !== f.status) return false;
    if (f.plannedFrom && (!p.plannedDate || p.plannedDate < f.plannedFrom)) return false;
    if (f.plannedTo && (!p.plannedDate || p.plannedDate > f.plannedTo)) return false;
    if (f.deliveryFrom && (!p.deliveryDate || p.deliveryDate < f.deliveryFrom)) return false;
    if (f.deliveryTo && (!p.deliveryDate || p.deliveryDate > f.deliveryTo)) return false;
    return true;
  });
}
