import express from 'express';

import userrouter, { users } from './routers/usersrouter.js';
import db from './config/database.js';

const app = express();

await db.authenticate();
console.log('Database connected');

await db.sync();
console.log("Database Synced");

app.use(express.json());

// Routers
app.use('/', userrouter);

app.listen(process.env.PORT, () => 
    console.log(`Server is running on port ${ process.env.PORT }`)
);