const { validationResult } = require('express-validator');
const RegistroAcceso = require('../models/registroAcceso');
const Usuario = require('../models/usuario');
const { Op } = require('sequelize');

exports.listar = async (req, res) => {
    try {
        const registros = await RegistroAcceso.findAll({
            include: [{ model: Usuario, attributes: ['nombre', 'email'] }]
        });
        res.json(registros);
    } catch (error) {
        console.error("Error al listar registros de acceso:", error);
        res.status(500).json({ error: "Error al obtener registros de acceso" });
    }
};

exports.listarPorId = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_log } = req.query;
    try {
        const registro = await RegistroAcceso.findOne({
            where: { id_log },
            include: [{ model: Usuario, attributes: ['nombre', 'email'] }]
        });
        if (!registro) {
            return res.status(404).json({ error: "Registro de acceso no encontrado" });
        }
        res.json(registro);
    } catch (error) {
        console.error("Error al buscar registro de acceso por ID:", error);
        res.status(500).json({ error: "Error al buscar registro de acceso" });
    }
};

exports.guardar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_usuario, accion } = req.body;
    try {
        const nuevoRegistro = await RegistroAcceso.create({
            id_usuario,
            accion,
            fecha_acceso: new Date()
        });
        res.status(201).json(nuevoRegistro);
    } catch (error) {
        console.error("Error al guardar registro de acceso:", error);
        res.status(500).json({ error: "Error al guardar el registro de acceso" });
    }
};

exports.eliminar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_log } = req.query;
    try {
        const eliminado = await RegistroAcceso.destroy({
            where: { id_log }
        });
        if (eliminado === 0) {
            return res.status(404).json({ error: "Registro de acceso no encontrado" });
        }
        res.json({ message: "Registro de acceso eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar registro de acceso:", error);
        res.status(500).json({ error: "Error al eliminar el registro de acceso" });
    }
};
