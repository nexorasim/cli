import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  // Receive ABM events from MSP or provider, validate, and forward to Business Contacts service
  console.log('ABM event', req.body);
  res.json({ status: 'received' });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`ABM Gateway listening on ${port}`));
