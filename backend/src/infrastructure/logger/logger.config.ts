import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';

const logDirectory = path.join(process.cwd(), 'storage', 'logs');

// Filter to ignore NestJS bootstrap/system logs
const ignoreNestSystemLogs = winston.format((info) => {
  const systemContexts = [
    'InstanceLoader',
    'RoutesResolver',
    'RouterExplorer',
    'NestFactory',
    'NestApplication',
    'Bootstrap',
  ];

  // Ignore logs from these system contexts
  if (
    info.context &&
    typeof info.context === 'string' &&
    systemContexts.includes(info.context)
  ) {
    return false;
  }

  return info;
});

// Format for console output (colorized)
const consoleFormat = winston.format.combine(
  ignoreNestSystemLogs(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, context, trace }) => {
    const contextStr = context ? `[${context}]` : '';
    const traceStr = trace ? `\n${trace}` : '';
    return `${timestamp} ${level} ${contextStr} ${message}${traceStr}`;
  }),
);

// Format for file output (JSON)
const fileFormat = winston.format.combine(
  ignoreNestSystemLogs(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Daily rotate file transport for all logs
const allLogsTransport = new DailyRotateFile({
  filename: path.join(logDirectory, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: fileFormat,
});

// Daily rotate file transport for error logs
const errorLogsTransport = new DailyRotateFile({
  filename: path.join(logDirectory, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: fileFormat,
});

export const loggerConfig: WinstonModuleOptions = {
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat,
    }),
    // File transports
    allLogsTransport,
    errorLogsTransport,
  ],
  // Exception handling
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDirectory, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: fileFormat,
    }),
  ],
  // Rejection handling (for unhandled promise rejections)
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDirectory, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: fileFormat,
    }),
  ],
};
