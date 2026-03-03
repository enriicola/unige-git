import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const LANGUAGE_CONFIGS = {
  python: {
    command: 'python3',
    extension: '.py',
    timeout: 10000,
  },
  javascript: {
    command: 'node',
    extension: '.js',
    timeout: 10000,
  },
  cpp: {
    // command is unused when compileFirst=true; actual compile/run is built below
    command: 'g++',
    extension: '.cpp',
    timeout: 15000,
    compileFirst: true,
  },
  c: {
    command: 'gcc',
    extension: '.c',
    timeout: 15000,
    compileFirst: true,
  },
  java: {
    command: 'javac',
    extension: '.java',
    timeout: 20000,
    compileFirst: true,
  },
};

const DOCKER_IMAGE = process.env.CODE_RUNNER_IMAGE || 'judge0/compilers:latest';

const getTempBase = () => {
  return tmpdir();
};

export async function runCode(code, language, input = '', options = {}) {
  const config = LANGUAGE_CONFIGS[language.toLowerCase()];
  if (!config) {
    if (process.env.NODE_ENV !== 'test')
      console.error('[CODE RUNNER] Unsupported language:', language);
    throw new Error(
      `Unsupported language: ${language}. Supported: ${Object.keys(LANGUAGE_CONFIGS).join(', ')}`
    );
  }

  const tempBase = getTempBase();
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const codeFile = join(tempBase, `code-${uniqueId}${config.extension}`);
  const inputFile = join(tempBase, `input-${uniqueId}.txt`);
  const codeFileName = `code-${uniqueId}${config.extension}`;
  const inputFileName = `input-${uniqueId}.txt`;
  const cidFile = join(tempBase, `cid-${uniqueId}.txt`); // Container ID file

  try {
    await writeFile(codeFile, code, 'utf8');

    if (input) {
      await writeFile(inputFile, input, 'utf8');
    }

    return new Promise((resolve) => {
      const getContainerId = async () => {
        try {
          const { readFile } = await import('fs/promises');
          const cid = await readFile(cidFile, 'utf8');
          return cid.trim();
        } catch {
          return null;
        }
      };

      const killContainer = async (containerId) => {
        if (!containerId) return;
        try {
          const { spawn: spawnKill } = await import('child_process');
          const killProcess = spawnKill('docker', ['kill', containerId], {
            stdio: 'ignore',
          });
          killProcess.on('error', () => {});
        } catch {
          // Ignore errors - container already removed, which is expected
        }
      };

      const dockerArgs = [
        'run',
        '--rm',
        '--cidfile',
        cidFile,
        '--network',
        'none',
        '--memory=128m',
        '--cpus=0.5',
        '--read-only',
        '--tmpfs',
        '/tmp:rw,exec,nosuid,size=10m',
        '-i',
        DOCKER_IMAGE,
        'sh',
        '-c',
      ];

      let execCommand;
      const codeFilePath = `/tmp/${codeFileName}`;
      const inputFilePath = `/tmp/${inputFileName}`;

      let setupCommand = `cat > ${codeFilePath}`;
      if (input) {
        setupCommand += ` && echo '${input.replace(/'/g, "'\\''")}' > ${inputFilePath}`;
      }

      if (config.compileFirst) {
        const outputName = `/tmp/output-${uniqueId}`;
        // Build compile + run command per language to avoid fragile split logic
        if (language.toLowerCase() === 'cpp') {
          execCommand = `${setupCommand} && g++ ${codeFilePath} -o ${outputName} && ${outputName}${input ? ` < ${inputFilePath}` : ''}`;
        } else if (language.toLowerCase() === 'c') {
          execCommand = `${setupCommand} && gcc ${codeFilePath} -o ${outputName} && ${outputName}${input ? ` < ${inputFilePath}` : ''}`;
        } else if (language.toLowerCase() === 'java') {
          // Expect class Main for Java code in tests; compile then run
          // Place compiled classes in /tmp and run with classpath /tmp
          // Move/compile the file as /tmp/Main.java
          execCommand = `${setupCommand} && sed -n 'w /tmp/Main.java' ${codeFilePath} >/dev/null 2>&1 || cp ${codeFilePath} /tmp/Main.java && javac /tmp/Main.java && java -cp /tmp Main${input ? ` < ${inputFilePath}` : ''}`;
        } else {
          // Fallback (should not happen with current configs)
          execCommand = `${setupCommand}`;
        }
      } else {
        if (input) {
          execCommand = `${setupCommand} && ${config.command} ${codeFilePath} < ${inputFilePath}`;
        } else {
          execCommand = `${setupCommand} && ${config.command} ${codeFilePath}`;
        }
      }

      dockerArgs.push(execCommand);

      const dockerProcess = spawn('docker', dockerArgs, {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      dockerProcess.stdin.write(code, 'utf8', () => {
        dockerProcess.stdin.end();
      });

      setTimeout(() => {
        if (!dockerProcess.stdin.destroyed) {
          dockerProcess.stdin.destroy();
        }
      }, 100);

      let stdout = '';
      let stderr = '';
      let timeoutId;
      let resolved = false;
      // Determine effective timeout in this order:
      // 1) per-call option
      // 2) test override via env (for API tests to shorten loops)
      // 3) language default
      const testTimeoutEnv = process.env.CODE_RUNNER_TEST_TIMEOUT_MS;
      const envTimeout =
        testTimeoutEnv && !Number.isNaN(parseInt(testTimeoutEnv, 10))
          ? parseInt(testTimeoutEnv, 10)
          : undefined;
      const effectiveTimeout =
        options && typeof options.timeoutMs === 'number'
          ? options.timeoutMs
          : (envTimeout ?? config.timeout);

      timeoutId = setTimeout(async () => {
        if (!resolved) {
          resolved = true;
          if (!dockerProcess.stdin.destroyed) {
            dockerProcess.stdin.destroy();
          }
          dockerProcess.kill('SIGKILL');

          const containerId = await getContainerId();
          if (containerId) {
            await killContainer(containerId);
          }

          cleanup(codeFile, inputFile, cidFile).catch(() => {});
          resolve({
            success: false,
            stdout: '',
            stderr: 'Execution timeout',
            exitCode: 124,
          });
        }
      }, effectiveTimeout);

      dockerProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      dockerProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      dockerProcess.on('close', async (code) => {
        if (resolved) {
          return;
        }
        resolved = true;
        clearTimeout(timeoutId);

        const containerId = await getContainerId();
        if (containerId) {
          setTimeout(async () => {
            try {
              const { execSync } = await import('child_process');
              execSync(
                `docker ps --filter id=${containerId} --format "{{.ID}}"`,
                { stdio: 'ignore' }
              );
              await killContainer(containerId);
            } catch {
              // Ignore errors - container already removed, which is expected
            }
          }, 1000);
        }

        await cleanup(codeFile, inputFile, cidFile);

        const result = {
          success: code === 0,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: code || 0,
        };

        resolve(result);
      });

      dockerProcess.on('error', async (error) => {
        console.error('[CODE RUNNER] Docker process error:', error.message);
        if (resolved) return;
        resolved = true;
        clearTimeout(timeoutId);

        if (!dockerProcess.stdin.destroyed) {
          dockerProcess.stdin.destroy();
        }

        const containerId = await getContainerId();
        if (containerId) {
          await killContainer(containerId);
        }

        await cleanup(codeFile, inputFile, cidFile);

        resolve({
          success: false,
          stdout: '',
          stderr: `Docker error: ${error.message}`,
          exitCode: 1,
          error: error.message,
        });
      });

      dockerProcess.stdin.on('error', () => {});
    });
  } catch (error) {
    await cleanup(codeFile, inputFile, cidFile);
    throw error;
  }
}

async function cleanup(codeFile, inputFile, cidFile) {
  try {
    await unlink(codeFile).catch(() => {});
    if (inputFile) {
      await unlink(inputFile).catch(() => {});
    }
    if (cidFile) {
      await unlink(cidFile).catch(() => {});
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

export function getSupportedLanguages() {
  return Object.keys(LANGUAGE_CONFIGS);
}
