const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pushRouter = require('./routes/push');

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const allowedOrigins = [...new Set(
  [
    process.env.FRONTEND_URL || '',
    ...(process.env.CORS_ORIGINS || '').split(',')
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
)];

const corsOptions = allowedOrigins.length > 0
  ? {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Origin not allowed by CORS'));
      },
      credentials: true
    }
  : { origin: true, credentials: true };

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'baeder-azubi-backend' });
});

app.use('/api/push', pushRouter);

app.use((err, _req, res, _next) => {
  if (err?.message === 'Origin not allowed by CORS') {
    res.status(403).json({ error: err.message });
    return;
  }

  console.error('Backend error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Baeder Azubi backend listening on port ${PORT}`);
});
