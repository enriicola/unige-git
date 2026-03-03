import path from 'path';
import { createStream } from 'rotating-file-stream';
import { fileURLToPath } from 'url';
import winston from 'winston';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const openAlexStream = createStream('OpenAlexImporter.log', {
  interval: '2d',
  path: __dirname.replace('services', 'log'),
  size: '1M',
  compress: 'gzip',
  maxFiles: 2,
});

const fileLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss.SSS',
    }),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Stream({
      stream: openAlexStream,
    }),
  ],
});

export default fileLogger;
