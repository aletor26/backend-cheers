import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';

export const Envio = sequelize.define('Envio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dias:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    freezeTableName: true
});