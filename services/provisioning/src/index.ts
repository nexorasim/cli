import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

const app = express();
app.use(bodyParser.json());

// Simple in-memory store for demo/testing
const store: Record<string, any> = {};

app.post('/provision', async (req, res) => {
  const { eid, iccid, profile } = req.body;
  const id = uuidv4();
  const lpaUrl = `esim://provision/${id}`;
  const qr = await QRCode.toDataURL(lpaUrl);
  store[id] = { id, eid, iccid, profile, status: 'provisioned', createdAt: new Date().toISOString() };
  res.json({ id, lpaUrl, qr });
});

app.get('/query/:id', (req, res) => {
  const entry = store[req.params.id];
  if (!entry) return res.status(404).json({ error: 'not found' });
  res.json(entry);
});

app.post('/swap', (req, res) => {
  const { id, newIccid } = req.body;
  const entry = store[id];
  if (!entry) return res.status(404).json({ error: 'not found' });
  entry.iccid = newIccid;
  entry.updatedAt = new Date().toISOString();
  res.json(entry);
});

app.post('/suspend', (req, res) => {
  const { id } = req.body;
  const entry = store[id];
  if (!entry) return res.status(404).json({ error: 'not found' });
  entry.status = 'suspended';
  res.json(entry);
});

app.post('/resume', (req, res) => {
  const { id } = req.body;
  const entry = store[id];
  if (!entry) return res.status(404).json({ error: 'not found' });
  entry.status = 'active';
  res.json(entry);
});

app.post('/revoke', (req, res) => {
  const { id } = req.body;
  const entry = store[id];
  if (!entry) return res.status(404).json({ error: 'not found' });
  entry.status = 'revoked';
  res.json(entry);
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Provisioning service listening on ${port}`));
