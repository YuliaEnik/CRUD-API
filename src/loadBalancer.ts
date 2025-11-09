import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import os from 'os';

const app = express();
const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 4000;

let currentWorker = 0;
const workers = Array.from({ length: numCPUs }, (_, i) => 
  `http://localhost:${Number(PORT) + i + 1}`
);

app.use('/api', (req, res, next) => {
  const target = workers[currentWorker % workers.length];
  currentWorker++;
  
  const proxy = createProxyMiddleware({
    target,
    changeOrigin: false,
  });
  
  proxy(req, res, next);
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Application error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});

export default app;
