import { useEffect, useMemo, useState } from 'react';
import type { Meta, Purchase, Role } from './types';
import { api } from './api';
import { SummaryPanel } from './components/SummaryPanel';
import { FilterBar, applyFilters, emptyFilters, type Filters } from './components/FilterBar';
import { PurchaseTable } from './components/PurchaseTable';
import './App.css';

const ROLE_KEY = 'zakupki_role';

export default function App() {
  const [role, setRole] = useState<Role>(
    () => (localStorage.getItem(ROLE_KEY) as Role) || 'admin',
  );
  const [meta, setMeta] = useState<Meta | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
  }, [role]);

  const load = async () => {
    try {
      const [m, p] = await Promise.all([api.getMeta(), api.getPurchases()]);
      setMeta(m);
      setPurchases(p);
      setError(null);
    } catch {
      setError('Не удалось загрузить данные с сервера. Убедитесь, что сервер запущен.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => applyFilters(purchases, filters), [purchases, filters]);

  const handleAdd = async () => {
    const p = await api.addPurchase();
    setPurchases((prev) => [...prev, p]);
  };

  const handleUpdate = async (id: number, patch: Partial<Purchase>) => {
    setPurchases((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    await api.updatePurchase(id, patch);
  };

  const handleDelete = async (id: number) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
    await api.deletePurchase(id);
  };

  if (loading) return <div className="app-loading">Загрузка…</div>;
  if (error || !meta) return <div className="app-error">{error}</div>;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Система мониторинга статусов закупок</h1>
        <div className="role-switch">
          <span>Роль:</span>
          <button className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>
            Администратор
          </button>
          <button className={role === 'viewer' ? 'active' : ''} onClick={() => setRole('viewer')}>
            Руководитель
          </button>
        </div>
      </header>

      <SummaryPanel purchases={purchases} />

      <FilterBar meta={meta} filters={filters} onChange={setFilters} />

      {role === 'admin' && (
        <div className="toolbar">
          <button className="btn-add" onClick={handleAdd}>+ Добавить закупку</button>
        </div>
      )}

      <PurchaseTable
        purchases={filtered}
        meta={meta}
        role={role}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
