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
import { Pedido_Producto } from './models/Pedido_producto.js';

const app = express();
const port = 3000;
app.use(express.json());

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

app.post('/categorias', async (req, res) => {
    try {
        const categoria = await Categoria.create(req.body);
        res.status(201).json(categoria);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
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
    const productos = await Producto.findAll({ limit: 3 });
    const items = productos.map((p, i) => ({ id: i + 1, productoId: p.id, nombre: p.nombre, precio: p.precio, cantidad: 2, subtotal: p.precio * 2 }));
    res.json({ items, total: items.reduce((sum, item) => sum + item.subtotal, 0) });
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
    const productos = await Producto.findAll({ limit: 2 });
    const items = productos.map((p, i) => ({ id: i + 1, productoId: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1, subtotal: p.precio }));
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    res.json({ items, subtotal, envio: 5.00, total: subtotal + 5.00 });
});

app.post('/checkout/completarorden', async (req, res) => {
    const pago = await Pago.create({ metodo: req.body.metodoPago, datos: JSON.stringify(req.body.datosPago), monto: 25.00 });
    const envio = await Envio.create({ metodo: req.body.metodoEnvio, direccion: req.body.direccion });
    const pedido = await Pedido.create({
        numero: `PED${Date.now()}`, 
        fecha_pedido: new Date(), 
        precio_total: 25.00,
        direccion: req.body.direccion, 
        correo: req.body.correo, 
        clienteId: req.body.clienteId, 
        estadoPedidoId: 1, 
        pagoId: pago.id, 
        envioId: envio.id
    });
    res.status(201).json({ mensaje: 'Orden completada', pedido: { id: pedido.id, numero: pedido.numero } });
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
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario || usuario.clave !== clave) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    res.json({ mensaje: 'Login exitoso', usuario });
});

// REGISTRO
app.post('/register', async (req, res) => {
    try {
        const { nombre, correo, clave, direccion, telefono } = req.body;
        const usuario = await Usuario.create({ nombre, correo, clave });
        const cliente = await Cliente.create({ id: usuario.id, direccion, telefono });
        res.status(201).json({ usuario, cliente });
    } catch (err) {
        res.status(400).json({ error: err.message });
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
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'No encontrado' });
    res.json(pedido);
});

// CANCELAR ORDEN
app.put('/pedidos/:id/cancelar', async (req, res) => {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'No encontrado' });
    pedido.estadoPedidoId = 2; // Suponiendo que 2 es "Cancelado"
    await pedido.save();
    res.json({ mensaje: 'Pedido cancelado', pedido });
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
        res.status(500).send("Error del servidor");
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
        res.status(500).send("Error del servidor");
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
app.post("/admin/producto", async (req, res) => {
    try {
        const data = req.body;
        if (data.nombre && data.descripcion && data.precio && data.categoriaId && data.estadoId) {
            const nuevo = await Producto.create(data);
            res.status(201).json(nuevo);
        } else {
            res.status(400).send("Faltan datos para la creacion");
        }
    } catch (error) {
        res.status(500).send("Error del servidor");
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
    const { id, nombre, apellido, page = 1, limit = 10 } = req.query;
    const where = {};
    if (id) where.id = id;
    if (nombre) where.nombre = { [sequelize.Op.like]: `%${nombre}%` };
    if (apellido) where.apellido = { [sequelize.Op.like]: `%${apellido}%` };
    const usuarios = await Usuario.findAndCountAll({
        where,
        offset: (page - 1) * limit,
        limit: parseInt(limit)
    });
    res.json(usuarios);
});

// Desactivar usuario
app.put('/admin/usuarios/:id/desactivar', async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'No encontrado' });
    usuario.activo = false;
    await usuario.save();
    res.json({ mensaje: 'Usuario desactivado', usuario });
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