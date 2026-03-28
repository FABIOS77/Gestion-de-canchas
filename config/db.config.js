const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
});

sequelize.authenticate()
    .then(() => console.log('Conexión a la Base de Datos establecida.'))
    .catch((error) => console.error('Error al conectar:', error));

module.exports = { sequelize, Sequelize };