import type { Meta, Purchase } from './types';
import { localApi } from './api.local';

const BASE = '/api';
const IS_STATIC = import.meta.env.VITE_STATIC === 'true';

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`);
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

const remoteApi = {
  getMeta: () => fetch(`${BASE}/meta`).then((r) => json<Meta>(r)),
  getPurchases: () => fetch(`${BASE}/purchases`).then((r) => json<Purchase[]>(r)),
  addPurchase: () =>
    fetch(`${BASE}/purchases`, { method: 'POST' }).then((r) => json<Purchase>(r)),
  updatePurchase: (id: number, patch: Partial<Purchase>) =>
    fetch(`${BASE}/purchases/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }).then((r) => json<Purchase>(r)),
  deletePurchase: (id: number) =>
    fetch(`${BASE}/purchases/${id}`, { method: 'DELETE' }).then((r) => json<void>(r)),
};

export const api = IS_STATIC ? localApi : remoteApi;
