const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horario.controller');
const { isAuth, isAdmin } = require('../middlewares/auth.middleware');

router.get('/', isAuth, isAdmin, horarioController.listar);
router.get('/create', isAuth, isAdmin, horarioController.mostrarFormulario);
router.post('/create', isAuth, isAdmin, horarioController.crear);
router.post('/delete/:id', isAuth, isAdmin, horarioController.eliminar);

module.exports = router;