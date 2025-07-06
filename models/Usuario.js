import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';

export const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    clave: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true
});