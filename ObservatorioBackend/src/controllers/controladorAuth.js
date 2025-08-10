const { validationResult } = require('express-validator');
const Usuario = require('../models/usuario');
const RegistroAcceso = require('../models/registroAcceso');
const { Op } = require('sequelize');
const argon2 = require('argon2');
const { getToken } = require('../config/passport');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { usuario, password } = req.body;
    try {
        const buscarUsuario = await Usuario.findOne({
            where: {
                [Op.or]: [
                    { email: usuario },
                    { nombre: usuario }
                ]
            }
        });
        if (!buscarUsuario) {
            return res.status(401).json({ msj: 'Usuario o contraseña incorrectos' });
        }
        const contrasenaValida = await argon2.verify(buscarUsuario.password, password);
        if (!contrasenaValida) {
            // Registrar intento fallido
            await RegistroAcceso.create({
                id_usuario: buscarUsuario.id_usuario,
                accion: 'Intento fallido de inicio de sesión',
                fecha_acceso: new Date()
            });
            return res.status(401).json({ msj: 'Usuario o contraseña incorrectos' });
        }
        // Generar token JWT usando getToken
        const token = getToken({ id: buscarUsuario.id_usuario });
        // Guardar el token en una cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: false,
          maxAge: 30 * 60 * 1000
        });
        // Registrar acceso exitoso
        await RegistroAcceso.create({
            id_usuario: buscarUsuario.id_usuario,
            accion: 'Inicio de sesión',
            fecha_acceso: new Date()
        });
        const data = {
            token: token,
            id_usuario: buscarUsuario.id_usuario,
            nombre: buscarUsuario.nombre,
            email: buscarUsuario.email,
            rol: buscarUsuario.rol
        };
        res.status(200).json({ msj: 'Usuario autenticado', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        // Si el usuario está autenticado, registrar el cierre de sesión
        if (req.user && req.user.id_usuario) {
            await RegistroAcceso.create({
                id_usuario: req.user.id_usuario,
                accion: 'Cierre de sesión',
                fecha_acceso: new Date()
            });
        }
    } catch (error) {
        // No bloquear logout por error de log
    }
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
    });
    return res.status(200).json({ msg: 'Sesión cerrada correctamente' });
};
