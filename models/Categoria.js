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
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true // Puedes poner false si deseas que sea obligatorio
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true // URL de la imagen
  }
}, {
  freezeTableName: true
});
