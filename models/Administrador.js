import {sequelize} from '../config/db.js';
import {DataTypes} from 'sequelize';
import {Usuario} from './Usuario.js';

export const Administrador = sequelize.define('Administrador', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Usuario,
            key: 'id'
        }
    }
}, {
    freezeTableName: true
});