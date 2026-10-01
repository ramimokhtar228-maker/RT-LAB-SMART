import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DB_FILE_PATH = path.join(__dirname, 'central_lab_database.json');

// Realtime SSE connected clients
const sseClients: Response[] = [];

function notifyAllClients(event: string, payload: any) {
  const data = JSON.stringify({ event, payload, timestamp: Date.now() });
  for (let i = sseClients.length - 1; i >= 0; i--) {
    const res = sseClients[i];
    try {
      res.write(`data: ${data}\n\n`);
    } catch {
      sseClients.splice(i, 1);
    }
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // API 1: Health
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      lab: 'RT LAB - معامل رامي مختار',
      connectedDevicesCount: sseClients.length,
      serverTime: new Date().toISOString()
    });
  });

  // API 2: Load Central Lab Database
  app.get('/api/database', (_req, res) => {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return res.json({ success: true, data: JSON.parse(raw) });
      }
      return res.json({ success: true, data: null });
    } catch (e: any) {
      console.error('Error reading central database:', e);
      return res.status(500).json({ success: false, error: e.message });
    }
  });

  // API 3: Save & Broadcast to ALL Devices
  app.post('/api/database', (req, res) => {
    try {
      const payload = req.body;
      if (!payload) {
        return res.status(400).json({ success: false, error: 'No data provided' });
      }

      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(payload, null, 2), 'utf-8');
      
      // Notify all other machines in real time!
      notifyAllClients('database_updated', {
        action: payload.lastAction || 'update',
        senderDeviceId: req.headers['x-device-id'] || 'unknown',
        timestamp: Date.now()
      });

      return res.json({
        success: true,
        message: 'تم الحفظ والمزامنة الفورية مع جميع الأجهزة المتصلة بنجاح',
        connectedDevices: sseClients.length
      });
    } catch (e: any) {
      console.error('Error saving central database:', e);
      return res.status(500).json({ success: false, error: e.message });
    }
  });

  // API 4: Realtime Server-Sent Events (SSE) Stream for Instant Multi-Device Sync
  app.get('/api/sync/stream', (req: Request, res: Response) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    res.write(`data: ${JSON.stringify({ event: 'connected', clientsCount: sseClients.length + 1 })}\n\n`);
    sseClients.push(res);

    // Heartbeat every 20 seconds
    const interval = setInterval(() => {
      try {
        res.write(`data: ${JSON.stringify({ event: 'ping', time: Date.now() })}\n\n`);
      } catch {
        clearInterval(interval);
      }
    }, 20000);

    req.on('close', () => {
      clearInterval(interval);
      const idx = sseClients.indexOf(res);
      if (idx !== -1) {
        sseClients.splice(idx, 1);
      }
    });
  });

  // Setup Vite in Dev mode or Serve Built files in Prod
  const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER || fs.existsSync(path.join(__dirname, 'dist'));

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RT LAB LIS Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
