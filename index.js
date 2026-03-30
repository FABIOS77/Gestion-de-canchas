const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./models');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;
const authRoutes = require('./routes/auth.routes');
const tipoCanchaRoutes = require('./routes/tipoCancha.routes');
const canchaRoutes = require('./routes/cancha.routes');
const clienteRoutes = require('./routes/cliente.routes');
const horarioRoutes = require('./routes/horario.routes');
const reservaRoutes = require('./routes/reserva.routes');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secreto_admin_123',
    resave: false,
    saveUninitialized: false
}));

app.use('/auth', authRoutes);
app.use('/admin/tipos', tipoCanchaRoutes);
app.use('/admin/canchas', canchaRoutes);
app.use('/admin/horarios', horarioRoutes);
app.use('/cliente', clienteRoutes);
app.use('/admin/reservas', reservaRoutes);





app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

const showRegister = (req, res) => {
    if (req.session.usuario) {
        if (req.session.usuario.rol === 'admin') return res.redirect('/admin/canchas');
        return res.redirect('/cliente/canchas');
    }
    res.render('auth/register', { error: null });
};

db.sequelize.sync({ force: false }).then(async () => {
    console.log("Base de datos sincronizada.");
    
    const adminCount = await db.Usuario.count({ where: { rol: 'admin' } });
    if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await db.Usuario.create({
            nombre: 'Administrador General',
            email: 'admin@sistema.com',
            contraseña: hashedPassword,
            rol: 'admin'
        });
        console.log("Admin creado: admin@sistema.com / admin123");
    }

    app.listen(port, () => {
        console.log(`Servidor en http://localhost:${port}`);
    });
});