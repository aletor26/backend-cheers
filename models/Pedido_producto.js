import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';

export const Pedido_Producto = sequelize.define('Pedido_Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    // Relaciones
    // Se asume que Pedido_Producto está asociado a un Pedido y un Producto 

    pedidoId: {
        type: DataTypes.INTEGER, allowNull: false
    },   // FK a Pedido
    productoId: {
        type: DataTypes.INTEGER, allowNull: false
    }  // FK a Producto

}, {
    freezeTableName: true
});