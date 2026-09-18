import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { initDatabase, db } from './server/db/database.ts';
import apiRouter from './server/routes/index.ts';
import { securityHeadersMiddleware } from './server/middleware/securityHeaders.ts';
import { standardRateLimiter } from './server/middleware/rateLimiter.ts';
import { errorHandlerMiddleware } from './server/middleware/errorHandler.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// 1. Initialize SQLite Database & Repositories
initDatabase();

// 2. Body Parser & Security Middleware
app.use(express.json({ limit: '10mb' }));
app.use(securityHeadersMiddleware);
app.use('/api', standardRateLimiter);

// 3. Mount Modular API Routes
app.use('/api', apiRouter);

// 4. Centralized Error Handler for API
app.use('/api', errorHandlerMiddleware);

// 5. Frontend Integration (Vite Dev Server or Production Static)
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        allowedHosts: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Argentic OS] Server running at http://0.0.0.0:${PORT}`);
    console.log(`[Argentic OS] SQLite WAL Engine Active | Strict Zod Validation Active`);
  });

  // Graceful shutdown
  const handleShutdown = (signal: string) => {
    console.log(`\n[Argentic OS] Received ${signal}. Gracefully closing connections...`);
    server.close(() => {
      try {
        db.close();
        console.log('[Argentic OS] SQLite database connection closed.');
      } catch (err) {
        console.error('[Argentic OS] Error closing DB:', err);
      }
      process.exit(0);
    });
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  console.error('[Argentic OS] Fatal startup error:', err);
  process.exit(1);
});

export default app;
