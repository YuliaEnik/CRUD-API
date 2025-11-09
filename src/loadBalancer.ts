import http from 'http';
import httpProxy from 'http-proxy';
import os from 'os';

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 4000;

const workers = Array.from({ length: numCPUs }, (_, i) => 
  `http://localhost:${Number(PORT) + i + 1}`
);

let currentWorker = 0;
const proxy = httpProxy.createProxyServer();

const server = http.createServer((req, res) => {
  const target = workers[currentWorker % workers.length];
  currentWorker++;
  
  proxy.web(req, res, { target, changeOrigin: false });
});

proxy.on('error', (err, req, res: any) => {
  console.error('Proxy error:', err);
  if (res && !res.headersSent) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Service unavailable' }));
  }
});

server.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});

export default server;
