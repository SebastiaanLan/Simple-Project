import sequelize, { Sequelize } from 'sequelize';

import db from '../util/database.js';

export const User = db.define('user', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, name: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 32]
        }
    }, email: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    }, phone: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            is: /^[+]?[- ()0-9]{6,20}$/
        }
    }, password: {
        type: sequelize.STRING,
        allowNull: false
    }
})

export default User;