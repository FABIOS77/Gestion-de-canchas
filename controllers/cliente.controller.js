const db = require('../models');
const { Op } = require('sequelize');

const listarCanchas = async (req, res) => {
    const canchas = await db.Cancha.findAll({
        where: { estado: 'activa' },
        include: db.TipoCancha
    });
    res.render('cliente/canchas/list', { canchas, usuario: req.session.usuario });
};



const crearReserva = async (req, res) => {
    const { horario_id } = req.body;
    const usuario_id = req.session.usuario.id;

    try {
        const horario = await db.Horario.findByPk(horario_id);
        if (!horario || !horario.disponible) {
            return res.redirect('/cliente/canchas');
        }

        await db.Reserva.create({
            usuario_id,
            horario_id,
            estado: 'confirmada'
        });

        horario.disponible = false;
        await horario.save();


        res.redirect('/cliente/reservas');
    } catch (error) {
        console.error(error);
        res.redirect('/cliente/canchas');
    }
};


const misReservas = async (req, res) => {
    const reservas = await db.Reserva.findAll({
        where: { usuario_id: req.session.usuario.id },
        include: [
            {
                model: db.Horario,
                include: [db.Cancha]
            }
        ],
        order: [[db.Horario, 'fecha', 'DESC']]
    });
    res.render('cliente/reservas/list', { reservas, usuario: req.session.usuario });
};
const cancelarReserva = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.session.usuario.id;

    try {
        const reserva = await db.Reserva.findOne({
            where: { id: id, usuario_id: usuario_id },
            include: [db.Horario]
        });

        if (!reserva || reserva.estado === 'cancelada') {
            return res.redirect('/cliente/reservas');
        }

        reserva.estado = 'cancelada';
        await reserva.save();


        if (reserva.Horario) {
            reserva.Horario.disponible = true;
            await reserva.Horario.save();
        }

        res.redirect('/cliente/reservas');
    } catch (error) {
        console.error("Error al cancelar reserva:", error);
        res.redirect('/cliente/reservas');
    }
};

const mostrarFormResena = async (req, res) => {
    const { id } = req.params;
    const reserva = await db.Reserva.findOne({
        where: { id: id, usuario_id: req.session.usuario.id, estado: 'confirmada' },
        include: [
            {
                model: db.Horario,
                include: [db.Cancha]
            }
        ]
    });

    if (!reserva) {
        return res.redirect('/cliente/reservas');
    }

    res.render('cliente/reservas/resena_form', { 
        reserva, 
        usuario: req.session.usuario, 
        error: null, 
        success: null 
    });
};

const guardarResena = async (req, res) => {
    const { reserva_id, cancha_id, calificacion, comentario } = req.body;
    const usuario_id = req.session.usuario.id;

    try {
        if (calificacion < 1 || calificacion > 5) {
             throw new Error("Calificación inválida.");
        }

        await db.Resena.create({
            usuario_id,
            cancha_id,
            calificacion: parseInt(calificacion),
            comentario
        });

        res.redirect('/cliente/reservas');

    } catch (error) {
        console.error("Error al guardar reseña:", error);
        
        const reserva = await db.Reserva.findByPk(reserva_id, {
            include: [{ model: db.Horario, include: [db.Cancha] }]
        });
        
        res.render('cliente/reservas/resena_form', { 
            reserva, 
            usuario: req.session.usuario, 
            error: 'Ocurrió un error al guardar tu reseña.', 
            success: null 
        });
    }
};

const verDisponibilidad = async (req, res) => {
    const { id } = req.params;
    const cancha = await db.Cancha.findByPk(id, { include: db.TipoCancha });

    if (!cancha) return res.redirect('/cliente/canchas');

    const hoy = new Date();
    const hoyString = new Date(hoy.getTime() - (hoy.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    const horarios = await db.Horario.findAll({
        where: { cancha_id: id, disponible: true, fecha: { [Op.gte]: hoyString } },
        order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']]
    });

    const resenas = await db.Resena.findAll({
        where: { cancha_id: id },
        order: [['createdAt', 'DESC']]
    });

    res.render('cliente/canchas/horarios', { cancha, horarios, resenas, usuario: req.session.usuario });
};
module.exports = { listarCanchas, verDisponibilidad, crearReserva, misReservas, cancelarReserva, guardarResena, mostrarFormResena };