import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';

export const Pedido = sequelize.define('Pedido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    fecha_pedido: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    precio_total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // Relaciones
    // Se asume que Pedido puede estar asociado a un Cliente, Estado_Pedido, Pago y Envio

    clienteId: { 
        type: DataTypes.INTEGER,
        allowNull: false
    },         // FK a Cliente
    estadoPedidoId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },    // FK a Estado_Pedido
    pagoId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },            // FK a Pago
    envioId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    }            // FK a Envio

}, {
    freezeTableName: true
});