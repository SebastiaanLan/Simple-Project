import sequelize from 'sequelize';

export const db = new sequelize('SimpleProject', 'dev', 'devpass', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
});

export default db;