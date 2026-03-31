const db = require('../models');
const bcrypt = require('bcryptjs');

const showLogin = (req, res) => {
    if (req.session.usuario) {
        if (req.session.usuario.rol === 'admin') {
            return res.redirect('/admin/canchas');
        } else {
            return res.redirect('/cliente/canchas');
        }
    }
    res.render('auth/login', { error: null });
};


const login = async (req, res) => {
    try {
        const { email, contraseña } = req.body;
        const usuario = await db.Usuario.findOne({ where: { email } });

        if (usuario && await bcrypt.compare(contraseña, usuario.contraseña)) {

            req.session.usuario = {
                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol
            };
            
    
            if (usuario.rol === 'admin') {
                return res.redirect('/admin/canchas');
            } else {
                return res.redirect('/cliente/canchas'); 
            }
        }
        res.render('auth/login', { error: 'Credenciales incorrectas' });
    } catch (error) {
        console.error(error);
        res.render('auth/login', { error: 'Error interno del servidor' });
    }
};

const showRegister = (req, res) => {
    if (req.session.usuario) return res.redirect('/canchas');
    res.render('auth/register', { error: null });
};


const register = async (req, res) => {
    try {
        const { nombre, email, contraseña } = req.body;
        const usuarioExistente = await db.Usuario.findOne({ where: { email } });
        
        if (usuarioExistente) {
            return res.render('auth/register', { error: 'Este correo electrónico ya está registrado. Intenta iniciar sesión.' });
        }
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        
        await db.Usuario.create({ 
            nombre, 
            email, 
            contraseña: hashedPassword, 
            rol: 'cliente' 
        });
        
        res.redirect('/auth/login');
    } catch (error) {
        console.error("Error en el registro:", error);
        res.render('auth/register', { error: 'Ocurrió un error inesperado al registrar el usuario.' });
    }
};

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};

module.exports = {
    showLogin,
    login,
    showRegister,
    register,
    logout
};