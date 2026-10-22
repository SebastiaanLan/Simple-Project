import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userrouter from './routers/usersrouter.js';
import db from './util/database.js';
import logger from './util/logger.js';

const serverLogger = logger.child({ module: 'server' });

const app = express();

await db.authenticate();
serverLogger.info('Database connected');

await db.sync({ alter: true });
serverLogger.info("Database Synced");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
}));

// Routers
app.use('/', userrouter);

app.listen(process.env.PORT, () => 
    serverLogger.info(`Server is running on port ${ process.env.PORT }`)
);