const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('TipoCancha', {
        nombre: { type: DataTypes.STRING, allowNull: false }
    }, { timestamps: false });
};