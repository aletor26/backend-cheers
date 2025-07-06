import { Usuario } from './Usuario.js';
import { Cliente } from './Cliente.js';
import { Administrador } from './Administrador.js';
import { Producto } from './Producto.js';
import { Oferta } from './Oferta.js';
import { Pedido } from './Pedido.js';
import { Pedido_Producto } from './Pedido_Producto.js';
import { Categoria } from './Categoria.js';
import { Estado } from './Estado.js';
import { Estado_Pedido } from './Estado_Pedido.js';
import { Pago } from './Pago.js';
import { Envio } from './Envio.js';

// Herencia (1 a 1)
Cliente.belongsTo(Usuario, { foreignKey: 'id' });
Administrador.belongsTo(Usuario, { foreignKey: 'id' });

// Cliente tiene muchos Pedidos
Cliente.hasMany(Pedido, { foreignKey: 'clienteId' });
Pedido.belongsTo(Cliente, { foreignKey: 'clienteId' });

// Pedido y Producto (muchos a muchos)
Pedido.belongsToMany(Producto, { through: Pedido_Producto, foreignKey: 'pedidoId' });
Producto.belongsToMany(Pedido, { through: Pedido_Producto, foreignKey: 'productoId' });

// Pedido_Producto pertenece a Pedido y Producto
Pedido_Producto.belongsTo(Pedido, { foreignKey: 'pedidoId' });
Pedido_Producto.belongsTo(Producto, { foreignKey: 'productoId' });


// Producto pertenece a Categoria
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId' });
Categoria.hasMany(Producto, { foreignKey: 'categoriaId' });

// Producto tiene un Estado
Producto.belongsTo(Estado, { foreignKey: 'estadoId' });
Estado.hasMany(Producto, { foreignKey: 'estadoId' });

// Oferta tiene un Estado
Oferta.belongsTo(Estado, { foreignKey: 'estadoId' });
Estado.hasMany(Oferta, { foreignKey: 'estadoId' });

// Pedido tiene un Estado_Pedido
Pedido.belongsTo(Estado_Pedido, { foreignKey: 'estadoPedidoId' });
Estado_Pedido.hasMany(Pedido, { foreignKey: 'estadoPedidoId' });

// Pedido tiene un Pago
Pedido.belongsTo(Pago, { foreignKey: 'pagoId' });
Pago.hasMany(Pedido, { foreignKey: 'pagoId' });

// Pedido tiene un Envio
Pedido.belongsTo(Envio, { foreignKey: 'envioId' });
Envio.hasMany(Pedido, { foreignKey: 'envioId' });
