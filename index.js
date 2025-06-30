import express from 'express';
import { sequelize } from './config/db.js';
import { Usuario } from './models/Usuario.js';
import { Cliente } from './models/Cliente.js';
import { Pedido } from './models/Pedido.js';
import { Producto } from './models/Producto.js';
import { Categoria } from './models/Categoria.js';
import { Oferta } from './models/Oferta.js';

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

// ------------------------------ ALUMNO 6 -----------------------------


// Listar usuarios (con filtros y paginación)
app.get('/admin/usuarios', async (req, res) => {
    const { id, nombre, apellido, page = 1, limit = 10 } = req.query;
    const where = {};
    if (id) where.id = id;
    if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
    if (apellido) where.apellido = { [Op.like]: `%${apellido}%` };
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
    if (numero) where.numero = { [Op.like]: `%${numero}%` };
    // Para filtrar por nombre/apellido del cliente:
    let include = [];
    if (nombre || apellido) {
        include.push({
            model: Cliente,
            include: [{ model: Usuario, where: {
                ...(nombre && { nombre: { [Op.like]: `%${nombre}%` } }),
                ...(apellido && { apellido: { [Op.like]: `%${apellido}%` } })
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