import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface VoiceAiConfig {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  provider: 'twilio' | 'vapi' | 'bland' | 'retell' | 'simulator';
  autoConfirmOnKey1: boolean;
  autoCancelOnKey2: boolean;
  botLanguage: 'bn-BD' | 'en-US';
  webhookSecret: string;
  isEnabled: boolean;
}

const ROOT_IMAGE_DIR = path.join(process.cwd(), "src", "image");
const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|svg|gif|ico|avif|bmp|mp4|webm|mov|ogg)$/i;
const ALLOWED_CATEGORIES = new Set(['books', 'electronics', 'superstore', 'fashion', 'kids', 'general', 'home', 'campaigns', 'site', 'landing']);

const voiceAiConfig: VoiceAiConfig = {
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || 'AC_demo_rokomari_voice_ai_sid_9982',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ? '***configured***' : 'demo_token_hidden',
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || '+8801737166595',
  provider: 'twilio',
  autoConfirmOnKey1: true,
  autoCancelOnKey2: true,
  botLanguage: 'bn-BD',
  webhookSecret: 'rk_voice_sec_998123',
  isEnabled: true,
};

interface CallLog {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  status: 'Ringing' | 'In Progress' | 'Confirmed' | 'Cancelled' | 'Failed' | 'No Answer';
  durationSeconds: number;
  transcript: string[];
  timestamp: string;
}

const callLogsStore: CallLog[] = [
  {
    id: 'call_9012',
    orderId: 'RM-542103',
    customerName: 'আরিফুল ইসলাম',
    phone: '01711223344',
    status: 'Confirmed',
    durationSeconds: 42,
    transcript: [
      '🤖 AI Bot: আসসালামু আলাইকুম, আমি রকমারি ডটকম থেকে কল করেছি। আরিফুল ইসলাম স্যার, আপনার অর্ডার RM-542103 কনফার্ম করতে ১ চাপুন, বাতিল করতে ২ চাপুন।',
      '👤 Customer: [Pressed 1]',
      '🤖 AI Bot: ধন্যবাদ! আপনার ৩৫০ টাকার অর্ডারটি সফলভাবে কনফার্ম করা হয়েছে। ধন্যবাদ রকমারির সাথেই থাকুন।'
    ],
    timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString('bn-BD')
  }
];

function sanitizeCategory(category?: string): string {
  const value = (category || 'general').toString().trim().toLowerCase();
  const clean = value.replace(/[^a-z0-9_-]/g, '');
  return ALLOWED_CATEGORIES.has(clean) ? clean : 'general';
}

function sanitizeAssetType(assetType?: string): string {
  const value = (assetType || 'general').toString().trim().toLowerCase();
  const clean = value.replace(/[^a-z0-9_-]/g, '');
  return clean || 'general';
}

function ensureImageDir(category?: string, assetType?: string) {
  const targetCategory = sanitizeCategory(category);
  const targetType = sanitizeAssetType(assetType);
  const fullDir = path.join(ROOT_IMAGE_DIR, targetCategory, targetType);
  fs.mkdirSync(fullDir, { recursive: true });
  return { targetCategory, targetType, fullDir };
}

function getRelativePathFromRoot(filePath: string) {
  return path.relative(ROOT_IMAGE_DIR, filePath).split(path.sep).join('/');
}

function listFilesRecursively(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const result: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...listFilesRecursively(fullPath));
    } else if (IMAGE_EXTENSIONS.test(entry.name)) {
      result.push(fullPath);
    }
  }

  return result;
}

function safeDeleteTarget(uploadedPath: string) {
  const resolvedRoot = path.resolve(ROOT_IMAGE_DIR);
  const resolvedPath = path.resolve(ROOT_IMAGE_DIR, uploadedPath);
  if (!resolvedPath.startsWith(resolvedRoot)) {
    throw new Error('Invalid file path');
  }
  return resolvedPath;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  fs.mkdirSync(ROOT_IMAGE_DIR, { recursive: true });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use('/src/image', express.static(ROOT_IMAGE_DIR));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/voice-ai/config', (_req, res) => {
    res.json({
      success: true,
      config: {
        ...voiceAiConfig,
        twilioAuthToken: voiceAiConfig.twilioAuthToken ? '••••••••' : '',
      },
    });
  });

  app.put('/api/voice-ai/config', (req, res) => {
    const body = req.body || {};
    Object.assign(voiceAiConfig, body);
    res.json({ success: true, config: voiceAiConfig });
  });

  app.get('/api/voice-ai/call-logs', (_req, res) => {
    res.json({ success: true, logs: callLogsStore });
  });

  app.post('/api/upload-image', (req, res) => {
    try {
      const { image, filename, category, assetType, prefix = 'img' } = req.body || {};
      if (!image || typeof image !== 'string') {
        res.status(400).json({ success: false, error: 'No image data provided' });
        return;
      }

      let mimeType = 'image/png';
      let base64Data = image;
      const match = image.match(/^data:([^;,]+);base64,([\s\S]+)$/);
      if (match && match.length === 3) {
        mimeType = match[1].toLowerCase();
        base64Data = match[2];
      }

      if (!mimeType.startsWith('image/')) {
        res.status(400).json({ success: false, error: 'Only image files are allowed' });
        return;
      }

      const buffer = Buffer.from(base64Data, 'base64');
      if (buffer.length === 0 || buffer.length > 10 * 1024 * 1024) {
        res.status(400).json({ success: false, error: 'Image size must be between 1 byte and 10 MB' });
        return;
      }

      const { fullDir } = ensureImageDir(category, assetType || 'products');
      const ext = path.extname(filename || '').toLowerCase() || '.png';
      const safeName = (filename ? path.parse(filename).name : 'image').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30) || 'image';
      const finalName = `${(prefix || 'img').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20)}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}${ext}`;
      const fullPath = path.join(fullDir, finalName);
      fs.writeFileSync(fullPath, buffer);

      const relativePath = getRelativePathFromRoot(fullPath);
      res.json({
        success: true,
        message: 'Image successfully saved in src/image/category folder',
        url: `/src/image/${relativePath}`,
        filename: relativePath,
        size: buffer.length,
        path: `src/image/${relativePath}`
      });
    } catch (err: any) {
      console.error('Error saving image:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to save image' });
    }
  });

  app.post('/api/upload-video', (req, res) => {
    try {
      const { video, filename, category, assetType, prefix = 'video' } = req.body || {};
      if (!video || typeof video !== 'string') {
        res.status(400).json({ success: false, error: 'No video data provided' });
        return;
      }

      let mimeType = 'video/mp4';
      let base64Data = video;
      const match = video.match(/^data:([^;,]+);base64,([\s\S]+)$/);
      if (match && match.length === 3) {
        mimeType = match[1].toLowerCase();
        base64Data = match[2];
      }

      if (!mimeType.startsWith('video/')) {
        res.status(400).json({ success: false, error: 'Only video files are allowed' });
        return;
      }

      const buffer = Buffer.from(base64Data, 'base64');
      if (buffer.length === 0 || buffer.length > 45 * 1024 * 1024) {
        res.status(400).json({ success: false, error: 'Video size must be between 1 byte and 45 MB' });
        return;
      }

      const { fullDir } = ensureImageDir(category, assetType || 'videos');
      const ext = path.extname(filename || '').toLowerCase() || '.mp4';
      const safeName = (filename ? path.parse(filename).name : 'video').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30) || 'video';
      const finalName = `${(prefix || 'video').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20)}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}${ext}`;
      const fullPath = path.join(fullDir, finalName);
      fs.writeFileSync(fullPath, buffer);

      const relativePath = getRelativePathFromRoot(fullPath);
      res.json({
        success: true,
        message: 'Video successfully saved in src/image/category folder',
        url: `/src/image/${relativePath}`,
        filename: relativePath,
        size: buffer.length,
        path: `src/image/${relativePath}`
      });
    } catch (err: any) {
      console.error('Error saving video:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to save video' });
    }
  });

  app.get('/api/images', (_req, res) => {
    try {
      const files = listFilesRecursively(ROOT_IMAGE_DIR);
      const items = files
        .map(file => {
          const stats = fs.statSync(file);
          const relativePath = getRelativePathFromRoot(file);
          return {
            filename: relativePath,
            url: `/src/image/${relativePath}`,
            size: stats.size,
            mtime: stats.mtime.toISOString(),
            isVideo: /\.(mp4|webm|mov|ogg)$/i.test(file),
          };
        })
        .sort((a, b) => new Date(b.mtime).getTime() - new Date(a.mtime).getTime());

      res.json({ success: true, count: items.length, images: items });
    } catch (err: any) {
      console.error('Error listing images:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to list images' });
    }
  });

  app.delete('/api/images/*', (req, res) => {
    try {
      const relativePath = decodeURIComponent(req.params[0] || '');
      if (!relativePath) {
        res.status(400).json({ success: false, error: 'No image path provided' });
        return;
      }

      const targetPath = safeDeleteTarget(relativePath.replace(/^\/+/, ''));
      if (!fs.existsSync(targetPath) || !targetPath.startsWith(path.resolve(ROOT_IMAGE_DIR))) {
        res.status(404).json({ success: false, error: 'File not found' });
        return;
      }

      fs.unlinkSync(targetPath);
      res.json({ success: true, message: 'File deleted' });
    } catch (err: any) {
      console.error('Error deleting image:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to delete image' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Kenakata server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
