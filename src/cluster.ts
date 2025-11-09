import cluster from 'cluster';
import os from 'os';
import { db } from './database';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Starting ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    const workerPort = Number(process.env.PORT) + i + 1;
    cluster.fork({ WORKER_PORT: workerPort, WORKER_ID: i + 1 });
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Starting a new worker...');
    
    const workerId = numCPUs + 1;
    const workerPort = Number(process.env.PORT) + workerId;
    cluster.fork({ WORKER_PORT: workerPort, WORKER_ID: workerId });
  });

  cluster.on('message', (worker, message) => {
    if (message.type === 'DB_UPDATE') {
      for (const id in cluster.workers) {
        if (cluster.workers[id] && cluster.workers[id]!.process.pid !== worker.process.pid) {
          cluster.workers[id]!.send({
            type: 'DB_SYNC',
            data: message.data
          });
        }
      }
    }
  });

} else {
  const workerId = process.env.WORKER_ID;
  const workerPort = process.env.WORKER_PORT || (Number(process.env.PORT) + Number(workerId));
  
  process.on('message', (message: any) => {
    if (message.type === 'DB_SYNC') {
      db.setData(message.data);
    }
  });

  const originalCreateUser = db.createUser.bind(db);
  db.createUser = (userData) => {
    const result = originalCreateUser(userData);
    process.send!({ type: 'DB_UPDATE', data: db.getData() });
    return result;
  };

  const originalUpdateUser = db.updateUser.bind(db);
  db.updateUser = (id, userData) => {
    const result = originalUpdateUser(id, userData);
    if (result) {
      process.send!({ type: 'DB_UPDATE', data: db.getData() });
    }
    return result;
  };

  const originalDeleteUser = db.deleteUser.bind(db);
  db.deleteUser = (id) => {
    const result = originalDeleteUser(id);
    if (result) {
      process.send!({ type: 'DB_UPDATE', data: db.getData() });
    }
    return result;
  };

  import('./server').then(module => {
    const server = module.default;
    console.log(`Worker ${workerId} (PID: ${process.pid}) started on port ${workerPort}`);
  });
}
