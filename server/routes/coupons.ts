import { Router, Request, Response } from 'express';
import { CouponModel } from '../models/Coupon.js';
import { isMongoConnected, fallbackStore } from '../db.js';

export const couponsRouter = Router();

// GET all coupons
couponsRouter.get('/', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected()) {
      const coupons = await CouponModel.find().lean();
      return res.json(coupons);
    } else {
      return res.json(fallbackStore.coupons);
    }
  } catch (err: any) {
    console.error('Error fetching coupons:', err);
    return res.status(500).json({ error: 'Failed to fetch coupons', details: err.message });
  }
});

// POST coupon
couponsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.id) data.id = 'coup-' + Date.now().toString(36);
    data.code = (data.code || '').toUpperCase().trim();

    if (isMongoConnected()) {
      const created = await CouponModel.create(data);
      return res.status(201).json(created);
    } else {
      fallbackStore.coupons.push(data);
      return res.status(201).json(data);
    }
  } catch (err: any) {
    console.error('Error creating coupon:', err);
    return res.status(500).json({ error: 'Failed to create coupon', details: err.message });
  }
});

// PUT coupon
couponsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.code) updates.code = updates.code.toUpperCase().trim();

    if (isMongoConnected()) {
      const updated = await CouponModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
      if (!updated) return res.status(404).json({ error: 'Coupon not found' });
      return res.json(updated);
    } else {
      const idx = fallbackStore.coupons.findIndex(c => c.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Coupon not found' });
      fallbackStore.coupons[idx] = { ...fallbackStore.coupons[idx], ...updates };
      return res.json(fallbackStore.coupons[idx]);
    }
  } catch (err: any) {
    console.error('Error updating coupon:', err);
    return res.status(500).json({ error: 'Failed to update coupon', details: err.message });
  }
});

// DELETE coupon
couponsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const deleted = await CouponModel.findOneAndDelete({ id });
      if (!deleted) return res.status(404).json({ error: 'Coupon not found' });
      return res.json({ success: true, message: 'Coupon deleted' });
    } else {
      const idx = fallbackStore.coupons.findIndex(c => c.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Coupon not found' });
      fallbackStore.coupons.splice(idx, 1);
      return res.json({ success: true, message: 'Coupon deleted' });
    }
  } catch (err: any) {
    console.error('Error deleting coupon:', err);
    return res.status(500).json({ error: 'Failed to delete coupon', details: err.message });
  }
});
