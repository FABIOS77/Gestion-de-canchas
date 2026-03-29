const db = require('../models');

const listar = async (req, res) => {
    const horarios = await db.Horario.findAll({
        include: db.Cancha,
        order: [['fecha', 'DESC'], ['hora_inicio', 'ASC']]
    });
    res.render('admin/horarios/list', { horarios, usuario: req.session.usuario });
};

const mostrarFormulario = async (req, res) => {
    const canchas = await db.Cancha.findAll();
    res.render('admin/horarios/form', { canchas, usuario: req.session.usuario, error: null });
};

const crear = async (req, res) => {
    const { cancha_id, fecha, hora_inicio, hora_fin } = req.body;
    
    try {
        const fechaString = fecha;
        const hoy = new Date();
        const hoyString = new Date(hoy.getTime() - (hoy.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

        if (fechaString < hoyString) {
            const canchas = await db.Cancha.findAll();
            return res.render('admin/horarios/form', { 
                canchas, 
                usuario: req.session.usuario, 
                error: 'No puedes crear un horario para una fecha que ya pasó.' 
            });
        }
        await db.Horario.create({ 
            cancha_id, 
            fecha, 
            hora_inicio, 
            hora_fin, 
            disponible: true
        });
        res.redirect('/admin/horarios');
    } catch (error) {
        console.error("Error al crear horario:", error);
        const canchas = await db.Cancha.findAll();
        res.render('admin/horarios/form', { 
            canchas, 
            usuario: req.session.usuario, 
            error: 'Ocurrió un error inesperado al intentar guardar.' 
        });
    }
};

const eliminar = async (req, res) => {
    const { id } = req.params;
    await db.Horario.destroy({ where: { id } });
    res.redirect('/admin/horarios');
};

module.exports = { listar, mostrarFormulario, crear, eliminar };