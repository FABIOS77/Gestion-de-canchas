const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('Resena', {
        calificacion: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
        comentario: { type: DataTypes.TEXT, allowNull: true }
    });
};