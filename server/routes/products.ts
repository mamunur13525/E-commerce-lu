import { Router, Request, Response } from 'express';
import { ProductModel } from '../models/Product.js';
import { isMongoConnected, fallbackStore } from '../db.js';

export const productsRouter = Router();

// GET all products with filtering, search, sorting
productsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, inStock, sort } = req.query;

    if (isMongoConnected()) {
      const query: any = {};
      if (category && category !== 'all') {
        query.category = category;
      }
      if (inStock === 'true') {
        query.inStock = true;
      }
      if (search) {
        query.$or = [
          { name: { $regex: String(search), $options: 'i' } },
          { description: { $regex: String(search), $options: 'i' } },
          { tags: { $in: [new RegExp(String(search), 'i')] } },
        ];
      }

      let sortOptions: any = { createdAt: -1 };
      if (sort === 'price-low') sortOptions = { price: 1 };
      if (sort === 'price-high') sortOptions = { price: -1 };
      if (sort === 'rating') sortOptions = { rating: -1 };

      const products = await ProductModel.find(query).sort(sortOptions).lean();
      return res.json(products);
    } else {
      let filtered = [...fallbackStore.products];
      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
      }
      if (inStock === 'true') {
        filtered = filtered.filter(p => p.inStock);
      }
      if (search) {
        const q = String(search).toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
      if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
      if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

      return res.json(filtered);
    }
  } catch (err: any) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

// GET single product by ID or Slug
productsRouter.get('/:idOrSlug', async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;

    if (isMongoConnected()) {
      const product = await ProductModel.findOne({
        $or: [{ id: idOrSlug }, { slug: idOrSlug }],
      }).lean();

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json(product);
    } else {
      const product = fallbackStore.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json(product);
    }
  } catch (err: any) {
    console.error('Error fetching product:', err);
    return res.status(500).json({ error: 'Failed to fetch product', details: err.message });
  }
});

// POST create a new product
productsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    if (!productData.id) {
      productData.id = 'prod-' + Date.now().toString(36);
    }
    if (!productData.slug) {
      productData.slug = (productData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (!productData.createdAt) {
      productData.createdAt = new Date().toISOString();
    }

    if (isMongoConnected()) {
      const created = await ProductModel.create(productData);
      return res.status(201).json(created);
    } else {
      fallbackStore.products.unshift(productData);
      return res.status(201).json(productData);
    }
  } catch (err: any) {
    console.error('Error creating product:', err);
    return res.status(500).json({ error: 'Failed to create product', details: err.message });
  }
});

// PUT update product
productsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected()) {
      const updated = await ProductModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
      if (!updated) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json(updated);
    } else {
      const index = fallbackStore.products.findIndex(p => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
      }
      fallbackStore.products[index] = { ...fallbackStore.products[index], ...updates };
      return res.json(fallbackStore.products[index]);
    }
  } catch (err: any) {
    console.error('Error updating product:', err);
    return res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
});

// DELETE product
productsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const deleted = await ProductModel.findOneAndDelete({ id });
      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json({ success: true, message: 'Product deleted from MongoDB' });
    } else {
      const index = fallbackStore.products.findIndex(p => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
      }
      fallbackStore.products.splice(index, 1);
      return res.json({ success: true, message: 'Product deleted' });
    }
  } catch (err: any) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ error: 'Failed to delete product', details: err.message });
  }
});

// POST product review comment
productsRouter.post('/:id/comment', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comment = req.body;

    if (isMongoConnected()) {
      const updated = await ProductModel.findOneAndUpdate(
        { id },
        {
          $push: { comments: { $each: [comment], $position: 0 } },
          $inc: { reviewCount: 1 },
        },
        { new: true }
      ).lean();

      if (!updated) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(201).json(updated);
    } else {
      const index = fallbackStore.products.findIndex(p => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
      }
      const p = fallbackStore.products[index];
      p.comments = [comment, ...(p.comments || [])];
      p.reviewCount = (p.reviewCount || 0) + 1;
      return res.status(201).json(p);
    }
  } catch (err: any) {
    console.error('Error adding product comment:', err);
    return res.status(500).json({ error: 'Failed to add comment', details: err.message });
  }
});

