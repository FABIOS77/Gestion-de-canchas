const db = require('../models');

const listarTodas = async (req, res) => {
    const reservas = await db.Reserva.findAll({
        include: [
            db.Usuario,
            { model: db.Horario, include: [db.Cancha] }
        ],
        order: [['createdAt', 'DESC']]
    });
    res.render('admin/reservas/list', { reservas, usuario: req.session.usuario });
};

const cambiarEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await db.Reserva.update({ estado }, { where: { id } });
    res.redirect('/admin/reservas');
};

const listarResenas = async (req, res) => {
    const resenas = await db.Resena.findAll({
        include: [db.Cancha, db.Usuario],
        order: [['createdAt', 'DESC']]
    });
    res.render('admin/resenas/list', { resenas, usuario: req.session.usuario });
};

module.exports = { listarTodas, cambiarEstado, listarResenas };