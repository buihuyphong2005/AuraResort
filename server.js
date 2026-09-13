import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './backend/config/db.js';
import apiRoutes from './backend/routes/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const HOST = '0.0.0.0';

async function startServer() {
  const app = express();

  // Connect Database (MongoDB or resilient local fallback)
  await connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logger for API calls
  app.use('/api', (req, res, next) => {
    console.log(`[API] ${req.method} ${req.originalUrl}`);
    next();
  });

  // Backend MVC Layered API Routes
  app.use('/api', apiRoutes);

  // Status endpoint
  app.get('/api/status', (req, res) => {
    res.json({
      status: 'operational',
      database: getDBStatus(),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // Client Static Serving or Vite Middleware
  const clientDistPath = path.resolve(__dirname, 'client', 'dist');
  const rootDistPath = path.resolve(__dirname, 'dist');

  const isProduction = process.env.NODE_ENV === 'production';
  const hasClientDist = fs.existsSync(path.join(clientDistPath, 'index.html'));
  const hasRootDist = fs.existsSync(path.join(rootDistPath, 'index.html'));

  if (hasClientDist) {
    console.log(`📦 Serving frontend from client/dist: ${clientDistPath}`);
    app.use(express.static(clientDistPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  } else if (hasRootDist) {
    console.log(`📦 Serving frontend from dist: ${rootDistPath}`);
    app.use(express.static(rootDistPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(rootDistPath, 'index.html'));
    });
  } else {
    // In dev mode when client/dist has not been built yet, mount Vite middleware
    console.log('⚡ Starting Vite middleware in development mode...');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, HOST, () => {
    console.log(`🚀 AuraResort Full-Stack App running at http://${HOST}:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
