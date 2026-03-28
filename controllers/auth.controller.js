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
            
            // REDIRECCIÓN CONDICIONAL SEGÚN ROL
            if (usuario.rol === 'admin') {
                return res.redirect('/admin/canchas');
            } else {
                return res.redirect('/cliente/canchas'); // Preparando para la parte de cliente
            }
        }
        res.render('auth/login', { error: 'Credenciales incorrectas' });
    } catch (error) {
        console.error(error);
        res.render('auth/login', { error: 'Error interno del servidor' });
    }
};

// 3. Mostrar formulario de Registro
const showRegister = (req, res) => {
    if (req.session.usuario) return res.redirect('/canchas');
    res.render('auth/register', { error: null });
};

// 4. Procesar el Registro (la que ya tenías)
// 4. Procesar el Registro
const register = async (req, res) => {
    try {
        const { nombre, email, contraseña } = req.body;

        // NUEVO: 1. Verificamos si el usuario ya existe en la BD
        const usuarioExistente = await db.Usuario.findOne({ where: { email } });
        
        if (usuarioExistente) {
            // Si ya existe, recargamos la vista de registro pasándole un mensaje de error claro
            return res.render('auth/register', { error: 'Este correo electrónico ya está registrado. Intenta iniciar sesión.' });
        }

        // 2. Si el correo no existe, procedemos a encriptar y guardar
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

// 5. Cerrar Sesión
const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};

// Exportamos TODAS las funciones para que el router las pueda usar
module.exports = {
    showLogin,
    login,
    showRegister,
    register,
    logout
};