const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');
const { isAuth, isAdmin } = require('../middlewares/auth.middleware');

router.get('/', isAuth, isAdmin, reservaController.listarTodas);
router.post('/cambiar-estado/:id', isAuth, isAdmin, reservaController.cambiarEstado);
router.get('/resenas', isAuth, isAdmin, reservaController.listarResenas);

module.exports = router;