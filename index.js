import express from 'express';
import { sequelize } from './config/db.js';
const app = express();
const port = 3000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    startServer();
});

