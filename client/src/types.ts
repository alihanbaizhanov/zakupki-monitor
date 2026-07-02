export type Role = 'admin' | 'viewer';

export interface StatusDef {
  id: string;
  label: string;
  color: string;
}

export interface Purchase {
  id: number;
  name: string;
  category: string;
  method: string;
  status: string;
  amount: number;
  plannedDate: string;
  supplier: string;
  contractNumber: string;
  deliveryDate: string;
  responsible: string;
  comment: string;
}

export interface Meta {
  statuses: StatusDef[];
  categories: string[];
  methods: string[];
}

export const FINAL_STATUSES = ['done', 'cancelled'];
