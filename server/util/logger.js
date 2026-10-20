import winston from 'winston';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const consoleFormat = combine(
    colorize(),
    timestamp({ format: 'HH:mm:ss' }),
    errors({ stack: true }),
    printf(({ timestamp, level, message, module, stack }) => {
        return `${timestamp} ${level} ${module} ${message}${stack ? `\n${stack}` : ''}`;
    })
);

const fileFormat = combine(
    timestamp(), 
    errors({ stack: true }), 
    json()
);

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL ?? 'debug',
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.File({ filename: 'logs/error.log', 
                                      level: 'error', 
                                      format: fileFormat }),
    ],
});

export default logger;