import dotenv from 'dotenv';
dotenv.config();

console.log('USUARIO:', process.env.DB_USER);
console.log('CLAVE:', process.env.DB_PASSWORD);
