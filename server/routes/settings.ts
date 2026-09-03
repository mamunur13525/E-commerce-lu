import { Router, Request, Response } from 'express';
import { SettingsModel } from '../models/Settings.js';
import { isMongoConnected, fallbackStore } from '../db.js';

export const settingsRouter = Router();

// GET settings
settingsRouter.get('/', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected()) {
      let settings = await SettingsModel.findOne({ key: 'global' }).lean();
      if (!settings) {
        settings = await SettingsModel.create({ ...fallbackStore.settings, key: 'global' });
      }
      return res.json(settings);
    } else {
      return res.json(fallbackStore.settings);
    }
  } catch (err: any) {
    console.error('Error fetching settings:', err);
    return res.status(500).json({ error: 'Failed to fetch settings', details: err.message });
  }
});

// PUT settings
settingsRouter.put('/', async (req: Request, res: Response) => {
  try {
    const updates = req.body;

    if (isMongoConnected()) {
      const updated = await SettingsModel.findOneAndUpdate(
        { key: 'global' },
        { $set: updates },
        { new: true, upsert: true }
      ).lean();
      return res.json(updated);
    } else {
      fallbackStore.settings = { ...fallbackStore.settings, ...updates };
      return res.json(fallbackStore.settings);
    }
  } catch (err: any) {
    console.error('Error updating settings:', err);
    return res.status(500).json({ error: 'Failed to update settings', details: err.message });
  }
});
