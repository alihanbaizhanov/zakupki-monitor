import type { Meta } from './types';

export const STATIC_META: Meta = {
  statuses: [
    { id: 'planning', label: 'Планирование', color: '#94a3b8' },
    { id: 'announced', label: 'Объявлен', color: '#60a5fa' },
    { id: 'applications', label: 'Приём заявок', color: '#38bdf8' },
    { id: 'review', label: 'Рассмотрение заявок', color: '#818cf8' },
    { id: 'winner', label: 'Определение победителя', color: '#a78bfa' },
    { id: 'contracting', label: 'Заключение договора', color: '#f0abfc' },
    { id: 'contracted', label: 'Договор заключён', color: '#fb923c' },
    { id: 'delivery', label: 'Поставка / исполнение', color: '#facc15' },
    { id: 'done', label: 'Завершено', color: '#4ade80' },
    { id: 'cancelled', label: 'Отменено', color: '#f87171' },
  ],
  categories: ['Товары', 'Работы', 'Услуги'],
  methods: ['Конкурс', 'Аукцион', 'Запрос ценовых предложений', 'Из одного источника'],
};
