import winston, { createLogger, format, transports } from "winston";

import DailyRotateFile from "winston-daily-rotate-file";

const transport = new DailyRotateFile({
  filename: "BE-app-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

export const logger = createLogger({
  level: "info",
  format: format.combine(
    winston.format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    winston.format.json(),
  ),
  transports: [transport, new transports.Console()],
});
