import express from 'express';
import { sequelize } from './config/db.js';
import { Usuario } from './models/Usuario.js';
import { Cliente } from './models/Cliente.js';
import { Pedido } from './models/Pedido.js';

const app = express();
const port = 3000;

app.use(express.json());

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