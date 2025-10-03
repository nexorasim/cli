import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// In-memory contact store
const contacts: Record<string, any> = {};

app.post('/contact', (req, res) => {
  const { id, name, phone, email } = req.body;
  contacts[id] = { id, name, phone, email, createdAt: new Date().toISOString() };
  res.json(contacts[id]);
});

app.get('/contact/:id', (req, res) => {
  const c = contacts[req.params.id];
  if (!c) return res.status(404).json({ error: 'not found' });
  res.json(c);
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Business Contacts service listening on ${port}`));
