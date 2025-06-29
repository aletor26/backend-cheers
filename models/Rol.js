import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';

export const Rol = sequelize.define('Rol', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true
});