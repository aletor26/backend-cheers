import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';
import {Usuario} from './Usuario.js';

export const Cliente = sequelize.define('Cliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }

}, {
    freezeTableName: true
});