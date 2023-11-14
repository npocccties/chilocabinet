import pino from "pino";

const pinoConfig = {
  level: process.env.LOG_LEVEL,
  formatters: {
    level: (label: string) => {
      return {
        level: label,
      };
    },
  },
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}"`,
  browser: {
    asObject: true,
  },
};

const logger = pino(pinoConfig);

export const loggerError = (message: string, ...args: any[]) => {
  return logger.error(args, message);
};

export const loggerWarn = (message: string, ...args: any[]) => {
  return logger.warn(args, message);
};

export const loggerInfo = (message: string, ...args: any[]) => {
  return logger.info(args, message);
};

export const loggerDebug = (message: string, ...args: any[]) => {
  return logger.debug(args, message);
};
