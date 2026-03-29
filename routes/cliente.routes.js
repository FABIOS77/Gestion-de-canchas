const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const { isAuth, isCliente } = require('../middlewares/auth.middleware');


router.get('/canchas', isAuth, isCliente, clienteController.listarCanchas);
router.get('/canchas/:id/horarios', isAuth, isCliente, clienteController.verDisponibilidad);
router.post('/reservar', isAuth, isCliente, clienteController.crearReserva);
router.get('/reservas', isAuth, isCliente, clienteController.misReservas);
router.post('/reservar/cancelar/:id', isAuth, isCliente, clienteController.cancelarReserva);
router.get('/reservas/resena/:id', isAuth, isCliente, clienteController.mostrarFormResena);
router.post('/reservas/resena', isAuth, isCliente, clienteController.guardarResena);

module.exports = router;