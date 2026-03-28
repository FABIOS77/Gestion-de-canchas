const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('Reserva', {
        estado: { type: DataTypes.ENUM('confirmada', 'cancelada'), defaultValue: 'confirmada' }
    });
};