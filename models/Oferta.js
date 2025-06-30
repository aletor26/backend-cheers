import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';

export const Oferta = sequelize.define('Oferta', {
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
    // Se asume que Oferta puede estar asociada a un Estado
    estadoId: { 
        type: DataTypes.INTEGER, allowNull: false 
    } // FK a Estado
}, {
    freezeTableName: true
});