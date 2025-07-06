import '../models/Usuario.js';
import '../models/Cliente.js';
import '../models/Administrador.js';
import '../models/Categoria.js';
import '../models/Estado.js';
import '../models/Estado_Pedido.js';
import '../models/Envio.js';
import '../models/Producto.js';
import '../models/Oferta.js';
import '../models/Pago.js';
import '../models/Pedido.js';
import '../models/Pedido_Producto.js';
import '../models/relaciones.js';
import { sequelize } from '../config/db.js';

await sequelize.sync({ force: true }); // ¡CUIDADO! Esto borra y recrea todas las tablas
console.log('Tablas creadas');
process.exit(0);