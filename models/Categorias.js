import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';

export const Categorias = sequelize.define('Categorias', {
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