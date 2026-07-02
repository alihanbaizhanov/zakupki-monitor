import type { Purchase } from './types';
import { STATIC_META } from './meta';

const STORAGE_KEY = 'zakupki_local_data';

interface LocalData {
  nextId: number;
  purchases: Purchase[];
}

function readData(): LocalData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { nextId: 1, purchases: [] };
  return JSON.parse(raw);
}

function writeData(data: LocalData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function emptyPurchase(id: number): Purchase {
  return {
    id,
    name: 'Новая закупка',
    category: STATIC_META.categories[0],
    method: STATIC_META.methods[0],
    status: STATIC_META.statuses[0].id,
    amount: 0,
    plannedDate: '',
    supplier: '',
    contractNumber: '',
    deliveryDate: '',
    responsible: '',
    comment: '',
  };
}

export const localApi = {
  getMeta: async () => STATIC_META,
  getPurchases: async () => readData().purchases,
  addPurchase: async () => {
    const data = readData();
    const purchase = emptyPurchase(data.nextId);
    data.nextId += 1;
    data.purchases.push(purchase);
    writeData(data);
    return purchase;
  },
  updatePurchase: async (id: number, patch: Partial<Purchase>) => {
    const data = readData();
    const idx = data.purchases.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Не найдено');
    data.purchases[idx] = { ...data.purchases[idx], ...patch };
    writeData(data);
    return data.purchases[idx];
  },
  deletePurchase: async (id: number) => {
    const data = readData();
    data.purchases = data.purchases.filter((p) => p.id !== id);
    writeData(data);
  },
};
