import {Sequelize} from 'sequelize';

export const sequelize = new Sequelize('postgres','postgres','alejo',{
    host:'localhost',
    dialect:'postgres'
});