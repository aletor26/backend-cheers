import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';

export const Estado = sequelize.define('Estado', {
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