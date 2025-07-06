import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';

export const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    url_imagen: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // Relaciones
    // Se asume que Producto puede estar asociado a una Oferta, Categoria y Estado
    categoriaId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        field: 'categoriaId'
    },
    estadoId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        field: 'estadoId'
    }
     // FK a Estado
}, {
    freezeTableName: true
});