import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { initDatabase, getDBStatus, reconnectDatabase, clearAllDatabaseData } from './server/db.js';
import { productsRouter } from './server/routes/products.js';
import { ordersRouter } from './server/routes/orders.js';
import { categoriesRouter } from './server/routes/categories.js';
import { couponsRouter } from './server/routes/coupons.js';
import { settingsRouter } from './server/routes/settings.js';
import { reviewsRouter } from './server/routes/reviews.js';
import { deliveryOptionsRouter } from './server/routes/deliveryOptions.js';
import { uploadRouter } from './server/routes/upload.js';
import { seoRouter } from './server/routes/seo.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // SEO sitemap.xml and robots.txt (first, before API / Vite SPA)
  app.use(seoRouter);

  // Health & Database status endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/db/status', async (req: Request, res: Response) => {
    const status = await getDBStatus();
    res.json(status);
  });

  app.post('/api/db/reconnect', async (req: Request, res: Response) => {
    const status = await reconnectDatabase();
    res.json(status);
  });

  // API Routes
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/coupons', couponsRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/reviews', reviewsRouter);
  app.use('/api/delivery-options', deliveryOptionsRouter);
  app.use('/api/upload', uploadRouter);

  // Initialize MongoDB connection & Collections gracefully
  initDatabase().catch(() => {
    // Gracefully handled inside db.ts with in-memory resilient fallback
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
