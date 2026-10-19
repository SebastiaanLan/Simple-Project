import express from 'express';
import cookieParser from 'cookie-parser';

import userrouter from './routers/usersrouter.js';
import db from './config/database.js';

const app = express();

await db.authenticate();
console.log('Database connected');

await db.sync();
console.log("Database Synced");

app.use(express.json());
app.use(cookieParser());

// Routers
app.use('/', userrouter);

app.listen(process.env.PORT, () => 
    console.log(`Server is running on port ${ process.env.PORT }`)
);