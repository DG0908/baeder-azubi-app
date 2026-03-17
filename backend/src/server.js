const express = require('express');
const cors = require('cors');
require('dotenv').config();

const adminRouter = require('./routes/admin');
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

const allowedOriginPatterns = [
  /^https:\/\/([a-z0-9-]+\.)*smartbaden\.de$/i,
  /^https:\/\/([a-z0-9-]+\.)*vercel\.app$/i,
  /^http:\/\/localhost(?::\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(?::\d+)?$/i
];

const isAllowedOrigin = (origin) => (
  !origin
  || allowedOrigins.includes(origin)
  || allowedOriginPatterns.some((pattern) => pattern.test(origin))
);

const corsOptions = allowedOrigins.length > 0
  ? {
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Origin not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      optionsSuccessStatus: 204
    }
  : {
      origin: true,
      credentials: true,
      methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      optionsSuccessStatus: 204
    };

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'baeder-azubi-backend' });
});

app.use('/api/admin', adminRouter);
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
