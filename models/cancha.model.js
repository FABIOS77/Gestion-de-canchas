const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('Cancha', {
        nombre: { type: DataTypes.STRING, allowNull: false },
        precio_por_hora: { type: DataTypes.FLOAT, allowNull: false },
        estado: { type: DataTypes.ENUM('activa', 'inactiva'), defaultValue: 'activa' }
    });
};