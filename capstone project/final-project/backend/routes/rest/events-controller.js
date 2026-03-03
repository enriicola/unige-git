import { Router } from 'express';
import {
  registerEventClient,
  removeEventClient,
  sendEvent,
} from '#root/services/event-stream.js';

const router = Router();

router.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders?.();

  const clientId = registerEventClient({
    res,
    user: req.session?.user || null,
  });

  sendEvent({
    res,
    event: 'connected',
    data: { connected: true },
  });

  req.on('close', () => {
    removeEventClient(clientId);
  });
});

export default router;
