import { getQueue, initializeQueue } from './code-execution-queue.js';
import { runCode } from './code-runner.js';

const WORKER_CONCURRENCY = parseInt(
  process.env.CODE_EXECUTION_CONCURRENCY || '5',
  10
);

let workerStarted = false;

export async function startWorker() {
  if (workerStarted) {
    return;
  }

  const queue = await initializeQueue();

  if (typeof queue.onComplete === 'function') {
    queue.onComplete('execute-code', () => {});
  }

  if (typeof queue.onFail === 'function') {
    queue.onFail('execute-code', (job) => {
      console.error(
        `[WORKER] Job ${job.id} failed:`,
        job.output?.message || 'Unknown error'
      );
    });
  }

  if (typeof queue.onError === 'function') {
    queue.onError((error) => {
      console.error('[WORKER] Queue error:', error);
    });
  }

  try {
    queue.work(
      'execute-code',
      {
        teamSize: WORKER_CONCURRENCY,
        teamConcurrency: WORKER_CONCURRENCY,
      },
      async (job) => {
        const actualJob = Array.isArray(job) && job.length > 0 ? job[0] : job;

        const jobData = actualJob?.data || {};
        const { code, language, input, userId, submissionId, matchId } =
          jobData;
        const jobId = actualJob?.id;
        const startTime = Date.now();

        try {
          if (!code || !language) {
            console.error('[WORKER] Missing code or language:', {
              code: !!code,
              language: !!language,
            });
            throw new Error('Code and language are required');
          }

          const result = await runCode(code, language, input || '');

          const executionTime = Date.now() - startTime;

          return {
            success: result.success,
            stdout: result.stdout,
            stderr: result.stderr,
            exitCode: result.exitCode,
            executionTime,
            timestamp: new Date().toISOString(),
            userId,
            submissionId,
            matchId,
          };
        } catch (error) {
          const executionTime = Date.now() - startTime;
          console.error('[WORKER] Job failed:', {
            jobId,
            error: error.message,
            executionTime,
          });
          throw new Error(
            `Code execution failed: ${error.message}. Execution time: ${executionTime}ms`
          );
        }
      }
    );
  } catch (error) {
    console.error('[WORKER] Error starting worker:', error);
    throw error;
  }

  workerStarted = true;
}

export async function stopWorker() {
  if (!workerStarted) {
    return;
  }

  const queue = getQueue();
  if (queue) {
    await queue.stop();
    workerStarted = false;
  }
}
