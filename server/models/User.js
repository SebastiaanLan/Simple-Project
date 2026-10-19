import sequelize from 'sequelize';

import db from '../config/database.js';

export const User = db.define('user', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, name: {
        type: sequelize.STRING,
        allowNull: false
    }, email: {
        type: sequelize.STRING,
        unique: true
    }, password: {
        type: sequelize.STRING,
        allowNull: false
    }
})

export default User;