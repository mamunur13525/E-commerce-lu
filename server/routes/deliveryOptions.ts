import { Router, Request, Response } from 'express';
import { DeliveryOptionModel } from '../models/DeliveryOption.js';
import { isMongoConnected, fallbackStore } from '../db.js';

export const deliveryOptionsRouter = Router();

// GET all delivery options
deliveryOptionsRouter.get('/', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected()) {
      const options = await DeliveryOptionModel.find().sort({ price: 1 }).lean();
      return res.json(options);
    } else {
      return res.json(fallbackStore.deliveryOptions || []);
    }
  } catch (err: any) {
    console.error('Error fetching delivery options:', err);
    return res.status(500).json({ error: 'Failed to fetch delivery options', details: err.message });
  }
});

// POST new delivery option
deliveryOptionsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = 'del-' + Date.now().toString(36);
    }

    if (isMongoConnected()) {
      if (data.isDefault) {
        await DeliveryOptionModel.updateMany({}, { $set: { isDefault: false } });
      }
      const created = await DeliveryOptionModel.create(data);
      return res.status(201).json(created);
    } else {
      if (data.isDefault) {
        fallbackStore.deliveryOptions.forEach(d => (d.isDefault = false));
      }
      fallbackStore.deliveryOptions.push(data);
      return res.status(201).json(data);
    }
  } catch (err: any) {
    console.error('Error creating delivery option:', err);
    return res.status(500).json({ error: 'Failed to create delivery option', details: err.message });
  }
});

// PUT update delivery option
deliveryOptionsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected()) {
      if (updates.isDefault) {
        await DeliveryOptionModel.updateMany({ id: { $ne: id } }, { $set: { isDefault: false } });
      }
      const updated = await DeliveryOptionModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
      if (!updated) {
        return res.status(404).json({ error: 'Delivery option not found' });
      }
      return res.json(updated);
    } else {
      const index = fallbackStore.deliveryOptions.findIndex(d => d.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Delivery option not found' });
      }
      if (updates.isDefault) {
        fallbackStore.deliveryOptions.forEach(d => (d.isDefault = false));
      }
      fallbackStore.deliveryOptions[index] = { ...fallbackStore.deliveryOptions[index], ...updates };
      return res.json(fallbackStore.deliveryOptions[index]);
    }
  } catch (err: any) {
    console.error('Error updating delivery option:', err);
    return res.status(500).json({ error: 'Failed to update delivery option', details: err.message });
  }
});

// DELETE delivery option
deliveryOptionsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const deleted = await DeliveryOptionModel.findOneAndDelete({ id });
      if (!deleted) {
        return res.status(404).json({ error: 'Delivery option not found' });
      }
      return res.json({ success: true, message: 'Delivery option deleted from MongoDB' });
    } else {
      const index = fallbackStore.deliveryOptions.findIndex(d => d.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Delivery option not found' });
      }
      fallbackStore.deliveryOptions.splice(index, 1);
      return res.json({ success: true, message: 'Delivery option deleted' });
    }
  } catch (err: any) {
    console.error('Error deleting delivery option:', err);
    return res.status(500).json({ error: 'Failed to delete delivery option', details: err.message });
  }
});
