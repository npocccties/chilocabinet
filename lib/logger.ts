import { NextApiRequest } from "next";
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

export const loggerError = (req: NextApiRequest, message: string, ...args: any[]) => {
  const userName = getBasicAuthUser(req);
  return logger.error(args, `[${userName}] ${message}`);
};

export const loggerWarn = (req: NextApiRequest, message: string, ...args: any[]) => {
  const userName = getBasicAuthUser(req);
  return logger.warn(args, `[${userName}] ${message}`);
};

export const loggerInfo = (req: NextApiRequest, message: string, ...args: any[]) => {
  const userName = getBasicAuthUser(req);
  return logger.info(args, `[${userName}] ${message}`);
};

export const loggerDebug = (req: NextApiRequest, message: string, ...args: any[]) => {
  const userName = getBasicAuthUser(req);
  return logger.debug(args, `[${userName}] ${message}`);
};

export const getBasicAuthUser = (req: NextApiRequest): string => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return 'Unknown';
  }
  const base64Credentials = authHeader.split(' ')[1];
  const decodedCredentials = atob(base64Credentials);
  return decodedCredentials.split(':')[0];
}
