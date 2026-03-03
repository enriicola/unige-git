import { PgBoss } from 'pg-boss';
import databaseConfig from '#root/config/database.js';

const getConnectionString = () => {
  const { user, password, name, options } = databaseConfig;
  const { host, port } = options;

  const encodedPassword = password ? encodeURIComponent(password) : '';
  const passwordPart = encodedPassword ? `:${encodedPassword}` : '';
  return `postgresql://${user}${passwordPart}@${host}:${port || 5432}/${name}`;
};

let codeExecutionQueue = null;

export async function initializeQueue() {
  if (codeExecutionQueue) {
    return codeExecutionQueue;
  }

  codeExecutionQueue = new PgBoss({
    connectionString: getConnectionString(),
    schema: 'pgboss',
    retryLimit: parseInt(process.env.QUEUE_RETRY_LIMIT || '3', 10),
    retryDelay: parseInt(process.env.QUEUE_RETRY_DELAY || '2000', 10),
    retryBackoff: process.env.QUEUE_RETRY_BACKOFF !== 'false',
    deleteAfterHours: parseFloat(
      process.env.QUEUE_DELETE_AFTER_HOURS || '0.25'
    ), // Default: 15 minutes
    deleteAfterHoursArchived: parseFloat(
      process.env.QUEUE_DELETE_ARCHIVED_HOURS || '0.5'
    ), // Default: 30 minutes
  });

  await codeExecutionQueue.start();
  await codeExecutionQueue.createQueue('execute-code');

  return codeExecutionQueue;
}

export async function enqueueCodeExecution(jobData, options = {}) {
  if (!codeExecutionQueue) {
    await initializeQueue();
  }

  const {
    code,
    language,
    input = '',
    userId = null,
    submissionId = null,
    matchId = null,
    priority = 0,
  } = jobData;

  const sendOptions = {
    priority,
    retryLimit: options.retryLimit || 3,
    retryDelay: options.retryDelay || 2000,
    ...options,
  };

  if (submissionId) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(submissionId)) {
      sendOptions.id = submissionId;
    }
  }

  const job = await codeExecutionQueue.send(
    'execute-code',
    {
      code,
      language,
      input,
      userId,
      submissionId,
      matchId,
      timestamp: new Date().toISOString(),
    },
    sendOptions
  );

  return { id: job };
}

export function getQueue() {
  return codeExecutionQueue;
}

export async function getJobStatus(jobId) {
  if (!codeExecutionQueue) {
    await initializeQueue();
  }

  const job = await codeExecutionQueue.getJobById('execute-code', jobId);

  if (!job) {
    return {
      status: 'not_found',
      message: 'Job not found',
    };
  }

  const stateMap = {
    created: 'queued',
    retry: 'queued',
    active: 'processing',
    completed: 'completed',
    expired: 'failed',
    cancelled: 'cancelled',
    failed: 'failed',
  };

  const status = stateMap[job.state] || job.state;

  return {
    status,
    jobId: job.id,
    result: job.output || null,
    error:
      job.state === 'failed'
        ? { message: job.output?.message || 'Job failed' }
        : null,
    createdOn: job.createdon,
    startedOn: job.startedon,
    completedOn: job.completedon,
  };
}
