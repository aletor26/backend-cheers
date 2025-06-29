import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';

export const Pago = sequelize.define('Pago', {
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