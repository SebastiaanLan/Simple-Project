import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import winston from 'winston';

import userrouter from './routers/usersrouter.js';
import db from './config/database.js';
import logger from './logger.js';

const serverLogger = logger.child({ module: 'server' });

const app = express();

await db.authenticate();
serverLogger.info('Database connected');

await db.sync();
serverLogger.info("Database Synced");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    orgin: 'http://localhost:4200'
}))

// Routers
app.use('/', userrouter);

app.listen(process.env.PORT, () => 
    serverLogger.info(`Server is running on port ${ process.env.PORT }`)
);