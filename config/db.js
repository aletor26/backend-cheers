import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';
import configFile from '../config/config.js'; 

const config = configFile.development;

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

console.log({
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
});

