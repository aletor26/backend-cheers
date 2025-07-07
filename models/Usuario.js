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
    },
    estadoid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 1 = Activo por defecto
        references: {
            model: 'Estado',
            key: 'id'
        }
    }
}, {
    freezeTableName: true
});