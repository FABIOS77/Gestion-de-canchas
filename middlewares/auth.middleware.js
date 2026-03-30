const isAuth = (req, res, next) => {
    if (req.session.usuario) {
        return next();
    }
    res.redirect('/auth/login');
};

const isAdmin = (req, res, next) => {
    if (req.session.usuario && req.session.usuario.rol === 'admin') {
        return next();
    }
    res.status(403).send('Acceso denegado. Área exclusiva para Administradores.');
};

const isCliente = (req, res, next) => {
    if (req.session.usuario && req.session.usuario.rol === 'cliente') {
        return next();
    }
    res.status(403).send('Acceso denegado. Área exclusiva para Clientes.');
};

module.exports = { isAuth, isAdmin, isCliente };