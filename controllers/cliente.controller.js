const db = require('../models');

const listarCanchas = async (req, res) => {
    const canchas = await db.Cancha.findAll({
        where: { estado: 'activa' },
        include: db.TipoCancha
    });
    res.render('cliente/canchas/list', { canchas, usuario: req.session.usuario });
};

module.exports = { listarCanchas };