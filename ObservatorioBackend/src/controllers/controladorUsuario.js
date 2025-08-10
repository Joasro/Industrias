const { validationResult } = require('express-validator');
const Usuario = require('../models/usuario');
const { Op } = require('sequelize');

exports.listar = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(usuarios);
    } catch (error) {
        console.error("Error al listar usuarios:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

exports.listarPorId = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_usuario } = req.query;
    try {
        const lista = await Usuario.findAll({
            where: {
                id_usuario: id_usuario
            },
            attributes: { exclude: ['password'] }
        });
        if (!lista || lista.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(lista);
    } catch (error) {
        console.error("Error al buscar usuario por ID:", error);
        res.status(500).json({ error: "Error al buscar usuario" });
    }
};

const argon2 = require('argon2');

exports.guardar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { nombre, email, password, rol } = req.body;
    try {
        // Verificar si el correo ya está registrado
        const existe = await Usuario.findOne({ where: { email } });
        if (existe) {
            return res.status(409).json({ error: 'El correo ya está registrado.' });
        }
        const hash = await argon2.hash(password);
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: hash,
            rol
        });
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error("Error al guardar usuario:", error);
        res.status(500).json({ error: "Error al guardar el usuario" });
    }
};

exports.editar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_usuario } = req.query;
    try {
        let datosActualizados = { ...req.body };
        if (req.body.password) {
            datosActualizados.password = await argon2.hash(req.body.password);
        }
        const updatedUsuario = await Usuario.update(datosActualizados, {
            where: { id_usuario: id_usuario }
        });
        if (updatedUsuario[0] === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        console.error("Error al editar usuario:", error);
        res.status(500).json({ error: "Error al editar el usuario" });
    }
};

exports.eliminar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_usuario } = req.query;
    try {
        const deletedUsuario = await Usuario.destroy({
            where: { id_usuario: id_usuario }
        });
        if (deletedUsuario === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error al eliminar el usuario" });
    }
};
