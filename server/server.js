import express from 'express';

import userrouter, { users } from './routers/usersrouter.js';

const app = express();

app.use(express.json());

// Routers
app.use('/', userrouter);

app.listen(process.env.PORT, () => 
    console.log(`Server is running on port ${ process.env.PORT }`)
);