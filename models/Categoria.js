import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';

export const Categoria = sequelize.define('Categoria', {
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