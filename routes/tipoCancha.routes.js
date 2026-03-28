const express = require('express');
const router = express.Router();
const tipoCanchaController = require('../controllers/tipoCancha.controller');
const { isAuth, isAdmin } = require('../middlewares/auth.middleware');

// Todas estas rutas estarán protegidas en el index.js, pero las aseguramos aquí también
router.get('/', isAuth, isAdmin, tipoCanchaController.listar);
router.get('/create', isAuth, isAdmin, tipoCanchaController.mostrarFormulario);
router.get('/edit/:id', isAuth, isAdmin, tipoCanchaController.mostrarFormulario);
router.post('/save', isAuth, isAdmin, tipoCanchaController.guardar);
router.post('/delete/:id', isAuth, isAdmin, tipoCanchaController.eliminar);

module.exports = router;