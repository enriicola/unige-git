import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import session from 'express-session';
import apiRouter from '#root/routes/index.js';
import errorInit from '#root/services/express-error.js';
import models from '#root/models/init-models.js';
import {
  scheduleActivePhaseOneChallenges,
  scheduleActivePhaseTwoChallenges,
} from '#root/services/challenge-scheduler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isTestEnv =
  process.env.NODE_ENV === 'test' || process.env.ENVIRONMENT === 'test';
const disableAccessLogs = isTestEnv || process.env.DISABLE_HTTP_LOGS === 'true';

const app = express();

const createAccessLogStream = () => {
  if (isTestEnv) return process.stdout;

  try {
    const logDirectory = path.join(__dirname, 'log');
    fs.mkdirSync(logDirectory, { recursive: true });

    return createStream('access.log', {
      interval: '1d', // rotate daily
      path: logDirectory,
    });
  } catch (error) {
    console.error('Failed to initialize file access logger, using stdout.', {
      error,
    });
    return process.stdout;
  }
};

const accessLogStream = createAccessLogStream();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: true, // reflect request origin
    credentials: true,
  })
);
if (!disableAccessLogs)
  app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET || 'test-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
);

app.use(apiRouter);

await models.init();
if (process.env.NODE_ENV !== 'test') {
  try {
    await scheduleActivePhaseOneChallenges();
    await scheduleActivePhaseTwoChallenges();
  } catch (error) {
    console.error('Failed to schedule coding phase end timers:', error);
  }
}

let queueInitialized = false;
if (process.env.ENABLE_CODE_EXECUTION_QUEUE !== 'false') {
  try {
    const { initializeQueue } =
      await import('#root/services/code-execution-queue.js');
    await initializeQueue();
    queueInitialized = true;
  } catch (error) {
    console.error('Failed to initialize code execution queue:', error);
  }
}

// Only start worker if queue was successfully initialized
if (queueInitialized && process.env.ENABLE_CODE_EXECUTION_WORKER !== 'false') {
  try {
    const { startWorker } =
      await import('#root/services/code-execution-worker.js');
    await startWorker();
  } catch (error) {
    console.error('Failed to start code execution worker:', error);
  }
}

errorInit(app);

export default app;
