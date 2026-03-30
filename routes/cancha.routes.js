const express = require('express');
const router = express.Router();
const canchaController = require('../controllers/cancha.controller');
const { isAuth, isAdmin } = require('../middlewares/auth.middleware');

router.get('/', isAuth, isAdmin, canchaController.listar);
router.get('/create', isAuth, isAdmin, canchaController.mostrarFormulario);
router.get('/edit/:id', isAuth, isAdmin, canchaController.mostrarFormulario);
router.post('/save', isAuth, isAdmin, canchaController.guardar);
router.post('/delete/:id', isAuth, isAdmin, canchaController.eliminar);

module.exports = router;