import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { SettingsModel } from '../models/Settings.js';
import { isMongoConnected, fallbackStore } from '../db.js';

export const uploadRouter = Router();

// Helper to get ImageKit credentials from env or DB settings
async function getImageKitCredentials() {
  let urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || '';
  let publicKey = process.env.IMAGEKIT_PUBLIC_KEY || '';
  let privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';

  if (!privateKey) {
    try {
      if (isMongoConnected()) {
        const settings = await SettingsModel.findOne({ key: 'global' }).lean();
        if (settings?.imagekitConfig?.privateKey) {
          privateKey = settings.imagekitConfig.privateKey;
          publicKey = settings.imagekitConfig.publicKey || publicKey;
          urlEndpoint = settings.imagekitConfig.urlEndpoint || urlEndpoint;
        }
      } else if (fallbackStore.settings.imagekitConfig?.privateKey) {
        privateKey = fallbackStore.settings.imagekitConfig.privateKey;
        publicKey = fallbackStore.settings.imagekitConfig.publicKey || publicKey;
        urlEndpoint = fallbackStore.settings.imagekitConfig.urlEndpoint || urlEndpoint;
      }
    } catch {
      // ignore
    }
  }

  return { urlEndpoint, publicKey, privateKey };
}

// GET ImageKit Auth Parameters (token, expire, signature) for client-side direct upload
uploadRouter.get('/imagekit/auth', async (req: Request, res: Response) => {
  try {
    const { privateKey } = await getImageKitCredentials();
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes

    let signature = '';
    if (privateKey) {
      signature = crypto
        .createHmac('sha1', privateKey)
        .update(token + expire)
        .digest('hex');
    }

    return res.json({
      token,
      expire,
      signature,
      hasPrivateKey: Boolean(privateKey),
    });
  } catch (err: any) {
    console.error('Error generating ImageKit auth token:', err);
    return res.status(500).json({ error: 'Failed to generate auth token', details: err.message });
  }
});

// POST ImageKit Upload
uploadRouter.post('/imagekit', async (req: Request, res: Response) => {
  try {
    const { file, fileName = `upload-${Date.now()}.jpg`, folder = '/lumina-store', tags } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'File data or URL is required.' });
    }

    const { urlEndpoint, privateKey } = await getImageKitCredentials();

    // If ImageKit private key is configured, execute real upload to ImageKit REST API
    if (privateKey) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('folder', folder);
      formData.append('useUniqueFileName', 'true');
      if (tags) {
        formData.append('tags', Array.isArray(tags) ? tags.join(',') : tags);
      }

      const basicAuth = Buffer.from(`${privateKey}:`).toString('base64');
      const ikResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
        body: formData,
      });

      const ikData = await ikResponse.json();

      if (!ikResponse.ok) {
        console.error('ImageKit API error:', ikData);
        return res.status(ikResponse.status).json({
          error: ikData.message || 'ImageKit API rejected upload',
          details: ikData,
        });
      }

      return res.json({
        success: true,
        url: ikData.url,
        thumbnailUrl: ikData.thumbnailUrl || ikData.url,
        fileId: ikData.fileId,
        name: ikData.name,
        size: ikData.size,
        height: ikData.height,
        width: ikData.width,
        isLiveImageKit: true,
        endpoint: urlEndpoint,
      });
    }

    // If ImageKit keys are not configured yet, process cleanly for preview & storage
    // If it's a web URL (e.g. pasted URL), return it directly with ImageKit transformation helpers
    let processedUrl = file;
    let isWebUrl = typeof file === 'string' && (file.startsWith('http://') || file.startsWith('https://'));

    if (urlEndpoint && isWebUrl && !file.includes(urlEndpoint)) {
      // If user has urlEndpoint configured, build CDN link
      processedUrl = file;
    }

    return res.json({
      success: true,
      url: processedUrl,
      thumbnailUrl: processedUrl,
      fileId: `ik_preview_${Date.now()}`,
      name: fileName,
      size: typeof file === 'string' && file.startsWith('data:') ? Math.round((file.length * 3) / 4) : 102400,
      isLiveImageKit: false,
      message: 'Processed in preview mode. Add ImageKit API keys in Admin Settings for direct cloud CDN delivery.',
    });
  } catch (err: any) {
    console.error('Image upload failed:', err);
    return res.status(500).json({ error: 'Image upload failed', details: err.message });
  }
});
