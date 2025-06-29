import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';

export const Estado_Pedido = sequelize.define('Estado', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Activo'
    }
}, {
    freezeTableName: true
});