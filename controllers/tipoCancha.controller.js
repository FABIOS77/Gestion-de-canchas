const db = require('../models');
const listar = async (req, res) => {
    const tipos = await db.TipoCancha.findAll();
    res.render('admin/tipos/list', { tipos, usuario: req.session.usuario });
};

const mostrarFormulario = async (req, res) => {
    const { id } = req.params;
    let tipo = null;
    if (id) {
        tipo = await db.TipoCancha.findByPk(id);
    }
    res.render('admin/tipos/form', { tipo, usuario: req.session.usuario });
};

const guardar = async (req, res) => {
    const { id, nombre } = req.body;
    if (id) {
        await db.TipoCancha.update({ nombre }, { where: { id } });
    } else {
        await db.TipoCancha.create({ nombre });
    }
    res.redirect('/admin/tipos');
};

const eliminar = async (req, res) => {
    const { id } = req.params;
    await db.TipoCancha.destroy({ where: { id } });
    res.redirect('/admin/tipos');
};

module.exports = { listar, mostrarFormulario, guardar, eliminar };