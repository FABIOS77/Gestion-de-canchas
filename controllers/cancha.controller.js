const db = require('../models');

const listar = async (req, res) => {
    // Incluimos el TipoCancha para poder mostrar su nombre en la tabla
    const canchas = await db.Cancha.findAll({ include: db.TipoCancha });
    res.render('admin/canchas/list', { canchas, usuario: req.session.usuario });
};

const mostrarFormulario = async (req, res) => {
    const { id } = req.params;
    let cancha = null;
    if (id) {
        cancha = await db.Cancha.findByPk(id);
    }
    // Necesitamos pasar los tipos de cancha para el <select>
    const tipos = await db.TipoCancha.findAll();
    res.render('admin/canchas/form', { cancha, tipos, usuario: req.session.usuario });
};

const guardar = async (req, res) => {
    const { id, nombre, tipo_id, precio_por_hora, estado } = req.body;
    if (id) {
        await db.Cancha.update({ nombre, tipo_id, precio_por_hora, estado }, { where: { id } });
    } else {
        await db.Cancha.create({ nombre, tipo_id, precio_por_hora, estado });
    }
    res.redirect('/admin/canchas');
};

const eliminar = async (req, res) => {
    const { id } = req.params;
    await db.Cancha.destroy({ where: { id } });
    res.redirect('/admin/canchas');
};

module.exports = { listar, mostrarFormulario, guardar, eliminar };