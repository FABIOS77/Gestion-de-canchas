const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const { isAuth, isCliente } = require('../middlewares/auth.middleware');


router.get('/canchas', isAuth, isCliente, clienteController.listarCanchas);

module.exports = router;