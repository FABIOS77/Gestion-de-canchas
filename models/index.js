const { sequelize, Sequelize } = require('../config/db.config');

const Usuario = require('./usuario.model')(sequelize);
const TipoCancha = require('./tipoCancha.model')(sequelize);
const Cancha = require('./cancha.model')(sequelize);
const Horario = require('./horario.model')(sequelize);
const Reserva = require('./reserva.model')(sequelize);
const Resena = require('./resena.model')(sequelize);

// --- RELACIONES ---
TipoCancha.hasMany(Cancha, { foreignKey: 'tipo_id' });
Cancha.belongsTo(TipoCancha, { foreignKey: 'tipo_id' });

Cancha.hasMany(Horario, { foreignKey: 'cancha_id' });
Horario.belongsTo(Cancha, { foreignKey: 'cancha_id' });

Usuario.hasMany(Reserva, { foreignKey: 'usuario_id' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Horario.hasOne(Reserva, { foreignKey: 'horario_id' });
Reserva.belongsTo(Horario, { foreignKey: 'horario_id' });

Usuario.hasMany(Resena, { foreignKey: 'usuario_id' });
Resena.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Cancha.hasMany(Resena, { foreignKey: 'cancha_id' });
Resena.belongsTo(Cancha, { foreignKey: 'cancha_id' });

module.exports = {
    sequelize, Sequelize, Usuario, TipoCancha, Cancha, Horario, Reserva, Resena
};