import express from 'express';
import { sequelize } from './config/db.js';
import { Usuario } from './models/Usuario.js';
import { Cliente } from './models/Cliente.js';
import { Pedido } from './models/Pedido.js';
import { Producto } from './models/Producto.js';
import { Categoria } from './models/Categoria.js';
import { Oferta } from './models/Oferta.js';
import { Pago } from './models/Pago.js';
import { Envio } from './models/Envio.js';
import { Estado_Pedido } from './models/Estado_Pedido.js';
import { Pedido_Producto } from './models/Pedido_Producto.js';
import { Estado } from './models/Estado.js';
import { Administrador } from './models/Administrador.js';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

// Importar relaciones después de que todos los modelos estén definidos
import './models/relaciones.js';

// ------------------------------ ALUMNO 1 -----------------------------

// PRODUCTOS
app.get('/productos', async (req, res) => {
    const productos = await Producto.findAll();
    res.json(productos);
});

app.get('/productos/:id', async (req, res) => {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'No encontrado' });
    res.json(producto);
});

app.post('/productos', async (req, res) => {
    try {
        const producto = await Producto.create(req.body);
        res.status(201).json(producto);
    } catch (err) {
        console.error('Error al crear producto:', err); // 👈 Agrega esto
        res.status(400).json({ error: err.message });    
    }
});

app.put('/productos/:id', async (req, res) => {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'No encontrado' });
    try {
        await producto.update(req.body);
        res.json(producto);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/productos/:id', async (req, res) => {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'No encontrado' });
    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado' });
});

// CATEGORIAS
app.get('/categorias', async (req, res) => {
    const categorias = await Categoria.findAll();
    res.json(categorias);
});

app.get('/categorias/:id', async (req, res) => {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'No encontrado' });
    res.json(categoria);
});



app.put('/categorias/:id', async (req, res) => {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'No encontrado' });
    try {
        await categoria.update(req.body);
        res.json(categoria);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/categorias/:id', async (req, res) => {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'No encontrado' });
    await categoria.destroy();
    res.json({ mensaje: 'Categoría eliminada' });
});

// OFERTAS
app.get('/ofertas', async (req, res) => {
    const ofertas = await Oferta.findAll();
    res.json(ofertas);
});

app.get('/ofertas/:id', async (req, res) => {
    const oferta = await Oferta.findByPk(req.params.id);
    if (!oferta) return res.status(404).json({ error: 'No encontrado' });
    res.json(oferta);
});

// ------------------------------ ALUMNO 2 -----------------------------

// 5. CARRITO DE COMPRAS
app.get('/carrito/:clienteId', async (req, res) => {
    try {
        // Obtener productos del carrito del cliente        
        const productos = await Producto.findAll(); 
                
        const items = productos.map((p, i) => ({ 
            id: i + 1, 
            productoId: p.id, 
            nombre: p.nombre, 
            precio: p.precio, 
            cantidad: 1, // Cantidad por defecto
            subtotal: p.precio
        }));
        
        const total = items.reduce((sum, item) => sum + item.subtotal, 0);
        res.json({ items, total });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

app.post('/carrito', async (req, res) => {
    const producto = await Producto.findByPk(req.body.productoId);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(201).json({ mensaje: 'Producto agregado al carrito', producto });
});

app.put('/carrito/:clienteId/:itemId', async (req, res) => {
    const { cantidad } = req.body;
    if (!cantidad || cantidad < 1) return res.status(400).json({ error: 'Cantidad inválida' });
    res.json({ mensaje: 'Cantidad actualizada', cantidad });
});

app.delete('/carrito/:clienteId/:itemId', async (req, res) => {
    const { itemId } = req.params;
    if (!itemId) return res.status(404).json({ error: 'Item no encontrado' });
    res.json({ mensaje: 'Item eliminado del carrito' });
});

// ITEMS GUARDADOS
app.get('/guardados/:clienteId', async (req, res) => {
    const productos = await Producto.findAll({ limit: 2 });
    const items = productos.map((p, i) => ({ id: i + 1, productoId: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 }));
    res.json(items);
});

app.delete('/guardados/:clienteId/:itemId', async (req, res) => {
    const { itemId } = req.params;
    if (!itemId) return res.status(404).json({ error: 'Item no encontrado' });
    res.json({ mensaje: 'Item eliminado de guardados' });
});

// 6. CHECKOUT
app.get('/checkout/:clienteId', async (req, res) => {
    try {
        const metodosEnvio = await Envio.findAll();
        if (metodosEnvio.length === 0) {
            return res.status(500).json({ error: 'No hay métodos de envío configurados' });
        }
        const envioDefault = metodosEnvio[0].precio;
        res.json({ 
            metodosEnvio, 
            envio: envioDefault
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener datos del checkout' });
    }
});


app.post('/checkout/completarorden', async (req, res) => {
    try {
        const { 
            metodoPago, 
            datosPago, 
            metodoEnvioId, 
            correo, 
            clienteId, 
            subtotal, 
            items,
            shippingDetails 
        } = req.body;
        
        // Validaciones básicas
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No hay productos en el carrito' });
        }
        
        if (!metodoEnvioId) {
            return res.status(400).json({ error: 'Método de envío requerido' });
        }

        // Validar método de envío
        const metodoEnvio = await Envio.findByPk(metodoEnvioId);
        if (!metodoEnvio) {
            return res.status(400).json({ error: 'Método de envío no válido' });
        }

        // 🔍 Validar existencia de productos
        for (const item of items) {
            const productoExiste = await Producto.findByPk(item.id);
            if (!productoExiste) {
                return res.status(400).json({ error: `El producto con ID ${item.id} no existe.` });
            }
        }

        const precioEnvio = metodoEnvio.precio;
        const precioTotal = subtotal + precioEnvio;

        // Crear el pago
        // ✅ Buscar el tipo de pago (qr o credit card)
        const pago = await Pago.findOne({ where: { nombre: metodoPago } });
        if (!pago) {
        return res.status(400).json({ error: 'Método de pago no válido' });
        }


        // Crear el pedido
        const pedido = await Pedido.create({
            numero: `PED${Date.now()}`, 
            fecha_pedido: new Date(), 
            precio_total: precioTotal,
            direccion: shippingDetails?.address || '', 
            correo: correo, 
            clienteId: clienteId, 
            estadoPedidoId: 1, 
            pagoId: pago.id, 
            envioId: metodoEnvioId
        });

        // Crear relación Pedido_Producto
        const pedidoProductos = items.map(item => ({
            pedidoId: pedido.id,
            productoId: item.id,
            cantidad: item.quantity,
            precio_unitario: item.price
        }));

        await Pedido_Producto.bulkCreate(pedidoProductos);

        // Éxito
        res.status(201).json({ 
            mensaje: 'Orden completada exitosamente', 
            pedido: { 
                id: pedido.id, 
                numero: pedido.numero 
            },
            resumen: {
                itemsCount: items.length,
                subtotal: subtotal,
                precioEnvio: precioEnvio,
                precioTotal: precioTotal
            },
            metodoEnvio: {
                id: metodoEnvio.id,
                nombre: metodoEnvio.nombre,
                dias: metodoEnvio.dias,
                precio: metodoEnvio.precio
            }
        });

    } catch (error) {
        console.error('Error al completar orden:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la orden' });
    }
});

app.get('/generarqr/:pedidoId', async (req, res) => {
    const pedido = await Pedido.findByPk(req.params.pedidoId);
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json({ qrCode: `data:image/png;base64,${Buffer.from(JSON.stringify({ pedidoId: pedido.id, numero: pedido.numero })).toString('base64')}` });
});

// 7. PEDIDO COMPLETADO
app.get('/pedidocompletado/:pedidoId', async (req, res) => {
    const pedido = await Pedido.findByPk(req.params.pedidoId, {
        include: [{ model: Pedido_Producto, include: [Producto] }, { model: Cliente, include: [Usuario] }, { model: Pago }, { model: Envio }, { model: Estado_Pedido }]
    });
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
});


//------------------------------ALUMNO 3 -----------------------------
// LOGIN


app.post('/login', async (req, res) => {
  const { correo, clave } = req.body;

  const usuario = await Usuario.findOne({
    where: { correo },
    include: [{ model: Estado, attributes: ['id', 'nombre'] }]
  });

  if (!usuario || usuario.clave !== clave) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // Verificar si el usuario está activo
  if (usuario.estadoid !== 1) {
    return res.status(403).json({ error: 'Usuario inactivo' });
  }

  // Buscar en tabla Administrador
  const esAdmin = await Administrador.findOne({ where: { id: usuario.id } });
  const rol = esAdmin ? 'admin' : 'customer';

  res.json({
    mensaje: 'Login exitoso',
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      activo: usuario.estadoid === 1,
      rol // 👈 Este campo es fundamental para el frontend
    }
  });
});


// REGISTRO
app.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, correo, clave, direccion, telefono, dni } = req.body;
    // ✅ Verificar si el correo ya existe
    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const usuario = await Usuario.create({ nombre, apellido, correo, clave });
    const cliente = await Cliente.create({ id: usuario.id, direccion, telefono, dni }); // ✅ ahora sí incluye dni


    const rol = 'customer';

    res.status(201).json({
      mensaje: 'Registro exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        activo: usuario.estadoid === 1,
        rol
      }
    });
  } catch (err) {
    console.error('Error en /register:', err);
    res.status(400).json({ error: 'Error al registrar usuario' });
  }
});


// RESUMEN DE ÓRDENES DEL USUARIO
app.get('/clientes/:id/pedidos', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const pedidos = await Pedido.findAndCountAll({
        where: { clienteId: req.params.id },
        offset: (page - 1) * limit,
        limit: parseInt(limit),
        order: [['fecha_pedido', 'DESC']]
    });
    res.json(pedidos);
});

// DETALLE DE ORDEN
app.get('/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
            include: [
        {
            model: Cliente,
            include: {
            model: Usuario,
            attributes: ['nombre', 'apellido', 'correo'] // ✅ sin 'telefono'
            },
            attributes: ['direccion', 'telefono', 'dni'] // ✅ aquí sí puedes pedir teléfono
        },
        {
            model: Producto,
            through: { attributes: ['cantidad'] }
        },
            Envio,
            Pago,
            Estado_Pedido
        ]
    });

    if (!pedido) {
      console.log('❌ Pedido no encontrado o relaciones vacías:', req.params.id);
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json(pedido);
  } catch (error) {
    console.error('💥 Error al obtener el pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// CANCELAR ORDEN
app.put('/pedidos/:id/cancelar', async (req, res) => {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'No encontrado' });
    pedido.estadoPedidoId = 2; // Suponiendo que 2 es "Cancelado"
    await pedido.save();
    res.json({ mensaje: 'Pedido cancelado', pedido });
});
// ------------------------------ ALUMNO 4 -----------------------------
// Obtener lista de categorías


// Agregar nueva categoría
app.post('/categorias', async (req, res) => {
  const { name, description, image } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Nombre de categoría requerido' });
  }
  try {
    const existe = await Categoria.findOne({ where: { name } });
    if (existe) {
      return res.status(409).json({ error: 'La categoría ya existe' });
    }
    const nuevaCategoria = await Categoria.create({ name, description, image, active: true });
    res.status(201).json(nuevaCategoria);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// Listar todas las órdenes de un usuario por id
app.get('/usuarios/:id/ordenes', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    const ordenes = await Orden.findAll({ where: { userId: id } });
    res.json(ordenes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

// Obtener detalle de un pedido de un cliente por id
app.get('/usuarios/:id/ordenes/:ordenId', async (req, res) => {
    const { id, ordenId } = req.params;
    try {
      const pedido = await Pedido.findOne({
        where: { id: ordenId, clienteId: id },
        include: [
          // Productos del pedido (muchos a muchos)
          {
            model: Producto,
            through: {
              attributes: ['cantidad'] // Incluye la cantidad desde Pedido_Producto
            }
          },
          // Cliente
          { model: Cliente, include: [{ model: Usuario }] },
          // Estado del pedido
          { model: Estado_Pedido },
          // Pago
          { model: Pago },
          // Envío
          { model: Envio }
        ]
      });
      if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
      res.json(pedido);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener el pedido' });
    }
  });

// Obtener datos del usuario por id
app.get('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id, {
      attributes: ['id', 'nombre', 'apellido', 'correo', 'estadoid', 'createdAt'],
      include: [{ model: Estado, attributes: ['id', 'nombre'] }]
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Editar datos del usuario por id
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, dni } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    usuario.nombre = nombre ?? usuario.nombre;
    usuario.apellido = apellido ?? usuario.apellido;
    usuario.email = email ?? usuario.email;
    usuario.dni = dni ?? usuario.dni;

    await usuario.save();
    res.json({ mensaje: 'Datos actualizados correctamente', usuario });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Recuperar contraseña (olvidada)
app.post('/forgot-password', async (req, res) => {
  const { correo, nueva } = req.body;

  if (!correo || !nueva) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    usuario.clave = nueva;
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
});


// ------------------------------ ALUMNO 5 -----------------------------
// Lista de productos (mantenimiento, paginación, filtro, activar/desactivar)
app.get("/admin/productos", async (req, res) => {
    try {
        const { nombre, id, soloActivos } = req.query;
        const where = {};
        
        if (nombre) where.nombre = { [sequelize.Op.like]: `%${nombre}%` };
        if (id) where.id = id;
        if (soloActivos === "true") where.estadoId = 1; // Asumiendo que estadoId 1 = activo
        
        const productos = await Producto.findAll({ where });
        res.json({ productos, total: productos.length });
    } catch (error) {
       res.status(500).json({ error: "Error del servidor" });
    }
});

app.put("/admin/producto/:id/activar", async (req, res) => {
    try {
        const id = req.params.id;
        const producto = await Producto.findByPk(id);
        if (producto) {
            producto.estadoId = 1; // Activo
            await producto.save();
            res.json(producto);
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

app.put("/admin/producto/:id/desactivar", async (req, res) => {
    try {
        const id = req.params.id;
        const producto = await Producto.findByPk(id);
        if (producto) {
            producto.estadoId = 2;
            await producto.save();
            res.json(producto);
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
});

// Agregar producto
app.post('/admin/producto', async (req, res) => {
  try {
    // Paso 1: Obtener el último ID si es necesario
    const ultimo = await Producto.max('id');
    const nuevoId = (ultimo || 0) + 1;

    // Paso 2: Crear el producto con ese ID si es necesario
    const producto = await Producto.create({
      id: nuevoId, // 👈 lo seteamos manualmente
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      url_imagen: req.body.url_imagen,
      categoriaId: req.body.categoriaId,
      estadoId: req.body.estadoId
    });

    res.status(201).json(producto);
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(400).json({ error: err.message });
  }
});


// Detalle de producto (ver, modificar)
app.get("/admin/producto/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const producto = await Producto.findByPk(id);
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
});

app.put("/admin/producto/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const producto = await Producto.findByPk(id);
        if (producto) {
            await producto.update(data);
            res.json(producto);
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
});


// ------------------------------ ALUMNO 6 -----------------------------

// Listar usuarios (con filtros y paginación)
app.get('/admin/usuarios', async (req, res) => {
    const { id, nombre, apellido, estadoid, page = 1, limit = 10 } = req.query;
    const where = {};
    if (id) where.id = id;
    if (nombre) where.nombre = { [sequelize.Op.like]: `%${nombre}%` };
    if (apellido) where.apellido = { [sequelize.Op.like]: `%${apellido}%` };
    if (estadoid) where.estadoid = estadoid;
    
    const usuarios = await Usuario.findAndCountAll({
        where,
        include: [{ model: Estado, attributes: ['id', 'nombre'] }],
        offset: (page - 1) * limit,
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']]
    });
    res.json(usuarios);
});

// Desactivar usuario
app.put('/admin/usuarios/:id/desactivar', async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'No encontrado' });
    usuario.estadoid = 2; // Inactivo
    await usuario.save();
    res.json({ mensaje: 'Usuario desactivado', usuario });
});

// Activar usuario
app.put('/admin/usuarios/:id/activar', async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'No encontrado' });
    usuario.estadoid = 1; // Activo
    await usuario.save();
    res.json({ mensaje: 'Usuario activado', usuario });
});

// Detalle de usuario y sus órdenes
app.get('/admin/usuarios/:id', async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'No encontrado' });
    const pedidos = await Pedido.findAll({
        where: { clienteId: usuario.id },
        limit: 10,
        order: [['fecha_pedido', 'DESC']]
    });
    res.json({ usuario, pedidos });
});

// Listar órdenes (con filtros y paginación)
app.get('/admin/pedidos', async (req, res) => {
    const { numero, nombre, apellido, page = 1, limit = 10 } = req.query;
    const where = {};
    if (numero) where.numero = { [sequelize.Op.like]: `%${numero}%` };
    // Para filtrar por nombre/apellido del cliente:
    let include = [];
    if (nombre || apellido) {
        include.push({
            model: Cliente,
            include: [{ model: Usuario, where: {
                ...(nombre && { nombre: { [sequelize.Op.like]: `%${nombre}%` } }),
                ...(apellido && { apellido: { [sequelize.Op.like]: `%${apellido}%` } })
            }}]
        });
    }
    const pedidos = await Pedido.findAndCountAll({
        where,
        include,
        offset: (page - 1) * limit,
        limit: parseInt(limit),
        order: [['fecha_pedido', 'DESC']]
    });
    res.json(pedidos);
});

// Detalle de orden (admin)
app.get('/admin/pedidos/:id', async (req, res) => {
    const pedido = await Pedido.findByPk(req.params.id, {
        include: [
            { model: Pedido_Producto, include: [Producto] },
            { model: Cliente, include: [Usuario] }
        ]
    });
    if (!pedido) return res.status(404).json({ error: 'No encontrado' });
    res.json(pedido);
});

// Cancelar orden (admin)
app.put('/admin/pedidos/:id/cancelar', async (req, res) => {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'No encontrado' });
    pedido.estadoPedidoId = 2; // Suponiendo que 2 es "Cancelado"
    await pedido.save();
    res.json({ mensaje: 'Pedido cancelado', pedido });
});


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