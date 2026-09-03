import { Router, Request, Response } from 'express';
import { ReviewModel } from '../models/Review.js';
import { isMongoConnected, fallbackStore } from '../db.js';

export const reviewsRouter = Router();

// GET all reviews
reviewsRouter.get('/', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected()) {
      const reviews = await ReviewModel.find().sort({ createdAt: -1 }).lean();
      return res.json(reviews);
    } else {
      return res.json(fallbackStore.reviews);
    }
  } catch (err: any) {
    console.error('Error fetching reviews:', err);
    return res.status(500).json({ error: 'Failed to fetch reviews', details: err.message });
  }
});

// POST review
reviewsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.id) data.id = 'fb-rev-' + Date.now().toString(36);

    if (isMongoConnected()) {
      const created = await ReviewModel.create(data);
      return res.status(201).json(created);
    } else {
      fallbackStore.reviews.unshift(data);
      return res.status(201).json(data);
    }
  } catch (err: any) {
    console.error('Error creating review:', err);
    return res.status(500).json({ error: 'Failed to create review', details: err.message });
  }
});

// PUT review
reviewsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected()) {
      const updated = await ReviewModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
      if (!updated) return res.status(404).json({ error: 'Review not found' });
      return res.json(updated);
    } else {
      const idx = fallbackStore.reviews.findIndex(r => r.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Review not found' });
      fallbackStore.reviews[idx] = { ...fallbackStore.reviews[idx], ...updates };
      return res.json(fallbackStore.reviews[idx]);
    }
  } catch (err: any) {
    console.error('Error updating review:', err);
    return res.status(500).json({ error: 'Failed to update review', details: err.message });
  }
});

// DELETE review
reviewsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const deleted = await ReviewModel.findOneAndDelete({ id });
      if (!deleted) return res.status(404).json({ error: 'Review not found' });
      return res.json({ success: true, message: 'Review deleted' });
    } else {
      const idx = fallbackStore.reviews.findIndex(r => r.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Review not found' });
      fallbackStore.reviews.splice(idx, 1);
      return res.json({ success: true, message: 'Review deleted' });
    }
  } catch (err: any) {
    console.error('Error deleting review:', err);
    return res.status(500).json({ error: 'Failed to delete review', details: err.message });
  }
});
