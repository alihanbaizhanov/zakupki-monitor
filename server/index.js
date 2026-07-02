import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { STATUSES, CATEGORIES, METHODS } from './statuses.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data', 'purchases.json');

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { nextId: 1, purchases: [] };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function emptyPurchase(id) {
  return {
    id,
    name: 'Новая закупка',
    category: CATEGORIES[0],
    method: METHODS[0],
    status: STATUSES[0].id,
    amount: 0,
    plannedDate: '',
    supplier: '',
    contractNumber: '',
    deliveryDate: '',
    responsible: '',
    comment: '',
  };
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/meta', (req, res) => {
  res.json({ statuses: STATUSES, categories: CATEGORIES, methods: METHODS });
});

app.get('/api/purchases', (req, res) => {
  const data = readData();
  res.json(data.purchases);
});

app.post('/api/purchases', (req, res) => {
  const data = readData();
  const purchase = emptyPurchase(data.nextId);
  data.nextId += 1;
  data.purchases.push(purchase);
  writeData(data);
  res.status(201).json(purchase);
});

app.patch('/api/purchases/:id', (req, res) => {
  const id = Number(req.params.id);
  const data = readData();
  const idx = data.purchases.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Не найдено' });
  const allowedFields = [
    'name', 'category', 'method', 'status', 'amount', 'plannedDate',
    'supplier', 'contractNumber', 'deliveryDate', 'responsible', 'comment',
  ];
  for (const key of Object.keys(req.body)) {
    if (allowedFields.includes(key)) {
      data.purchases[idx][key] = req.body[key];
    }
  }
  writeData(data);
  res.json(data.purchases[idx]);
});

app.delete('/api/purchases/:id', (req, res) => {
  const id = Number(req.params.id);
  const data = readData();
  const idx = data.purchases.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Не найдено' });
  data.purchases.splice(idx, 1);
  writeData(data);
  res.status(204).end();
});

const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
