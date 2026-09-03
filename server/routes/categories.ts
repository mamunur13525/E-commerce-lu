import { Router, Request, Response } from 'express';
import { CategoryModel } from '../models/Category.js';
import { isMongoConnected, fallbackStore } from '../db.js';

export const categoriesRouter = Router();

// GET all categories
categoriesRouter.get('/', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected()) {
      const categories = await CategoryModel.find().lean();
      return res.json(categories);
    } else {
      return res.json(fallbackStore.categories);
    }
  } catch (err: any) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
  }
});

// POST category
categoriesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.id) data.id = 'cat-' + Date.now().toString(36);
    if (!data.slug) data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (isMongoConnected()) {
      const created = await CategoryModel.create(data);
      return res.status(201).json(created);
    } else {
      fallbackStore.categories.push(data);
      return res.status(201).json(data);
    }
  } catch (err: any) {
    console.error('Error creating category:', err);
    return res.status(500).json({ error: 'Failed to create category', details: err.message });
  }
});

// PUT category
categoriesRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected()) {
      const updated = await CategoryModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
      if (!updated) return res.status(404).json({ error: 'Category not found' });
      return res.json(updated);
    } else {
      const idx = fallbackStore.categories.findIndex(c => c.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Category not found' });
      fallbackStore.categories[idx] = { ...fallbackStore.categories[idx], ...updates };
      return res.json(fallbackStore.categories[idx]);
    }
  } catch (err: any) {
    console.error('Error updating category:', err);
    return res.status(500).json({ error: 'Failed to update category', details: err.message });
  }
});

// DELETE category
categoriesRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const deleted = await CategoryModel.findOneAndDelete({ id });
      if (!deleted) return res.status(404).json({ error: 'Category not found' });
      return res.json({ success: true, message: 'Category deleted' });
    } else {
      const idx = fallbackStore.categories.findIndex(c => c.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Category not found' });
      fallbackStore.categories.splice(idx, 1);
      return res.json({ success: true, message: 'Category deleted' });
    }
  } catch (err: any) {
    console.error('Error deleting category:', err);
    return res.status(500).json({ error: 'Failed to delete category', details: err.message });
  }
});
