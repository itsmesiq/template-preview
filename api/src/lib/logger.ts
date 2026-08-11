import type { FastifyServerOptions } from 'fastify';

export const logger: FastifyServerOptions['logger'] =
    process.env.NODE_ENV === 'production'
        ? { level: 'info' }
        : {
              level: 'info',
              transport: {
                  target: 'pino-pretty',
                  options: {
                      colorize: true,
                      translateTime: 'HH:MM:ss',
                      ignore: 'pid,hostname',
                      singleLine: true,
                  },
              },
          };
