import dotenv from 'dotenv';
dotenv.config();
import { sequelize } from '../config/db.js';
import fs from 'fs/promises';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const insertFiles = [
  'Usuario.sql',
  'Categoria.sql',
  'Estado.sql',
  'Estado_Pedido.sql',
  'Envio.sql',
  'Cliente.sql',
  'Administrador.sql',
  'Productos.sql',
  'Oferta.sql'
];

const runInserts = async () => {
  try {
    for (const fileName of insertFiles) {
      const filePath = path.resolve(__dirname, 'inserts', fileName);
      const sql = await fs.readFile(filePath, 'utf8');
      await sequelize.query(sql);
      console.log(`✅ Ejecutado: ${fileName}`);
    }

    console.log('\n🎉 Todos los inserts fueron ejecutados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando inserts:', error);
    process.exit(1);
  }
};

runInserts();
