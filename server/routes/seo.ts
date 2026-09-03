import { Router, Request, Response } from 'express';
import { ProductModel } from '../models/Product.js';
import { isMongoConnected, fallbackStore } from '../db.js';

export const seoRouter = Router();

// Dynamic sitemap.xml
seoRouter.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    let products: any[] = [];
    if (isMongoConnected()) {
      products = await ProductModel.find({ inStock: true }).select('id slug updatedAt createdAt').lean();
    } else {
      products = fallbackStore.products;
    }

    const staticRoutes = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/shop', priority: '0.9', changefreq: 'daily' },
      { path: '/track-order', priority: '0.6', changefreq: 'monthly' },
      { path: '/cart', priority: '0.5', changefreq: 'weekly' },
    ];

    const today = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${route.path}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Product pages
    for (const prod of products) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/product/${prod.slug || prod.id}</loc>\n`;
      xml += `    <lastmod>${(prod.updatedAt || prod.createdAt || today).toString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    return res.send(xml);
  } catch (err: any) {
    console.error('Error generating sitemap.xml:', err);
    return res.status(500).send('Error generating sitemap');
  }
});

// robots.txt
seoRouter.get('/robots.txt', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.header('Content-Type', 'text/plain');
  return res.send(robots);
});
