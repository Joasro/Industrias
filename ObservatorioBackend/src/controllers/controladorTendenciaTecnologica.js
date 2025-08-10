const { validationResult } = require('express-validator');
const TendenciaTecnologica = require('../models/tendenciatecnologica.js');
const { Op } = require('sequelize');

exports.listar = async (req, res) => {
    try {
        const tendencias = await TendenciaTecnologica.findAll();
        res.json(tendencias);
    } catch (error) {
        console.error("Error al listar tendencias:", error);
        res.status(500).json({ error: "Error al obtener tendencias" });
    }
};

exports.listarPorId = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_tendencia } = req.query;
    try {
        const lista = await TendenciaTecnologica.findAll({
            where: {
                id_tendencia: id_tendencia
            }
        });
        res.json(lista);
    } catch (error) {
        console.error("Error al buscar tendencia:", error);
        res.status(500).json({ error: "Error al buscar tendencia" });
    }
};

exports.guardar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { nombre, descripcion, relevancia_region } = req.body;
    try {
        const nuevaTendencia = await TendenciaTecnologica.create({
            nombre,
            descripcion,
            relevancia_region
        });
        res.status(201).json(nuevaTendencia);
    } catch (error) {
        console.error("Error al guardar tendencia:", error);
        res.status(500).json({ error: "Error al guardar la tendencia" });
    }
};

exports.editar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_tendencia } = req.query;
    try {
        const updatedTendencia = await TendenciaTecnologica.update(req.body, {
            where: { id_tendencia: id_tendencia }
        });
        if (updatedTendencia[0] === 0) {
            return res.status(404).json({ error: "Tendencia no encontrada" });
        }
        res.json({ message: "Tendencia actualizada correctamente" });
    } catch (error) {
        console.error("Error al editar tendencia:", error);
        res.status(500).json({ error: "Error al editar la tendencia" });
    }
};

exports.eliminar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_tendencia } = req.query;
    try {
        const deletedTendencia = await TendenciaTecnologica.destroy({
            where: { id_tendencia: id_tendencia }
        });
        if (deletedTendencia === 0) {
            return res.status(404).json({ error: "Tendencia no encontrada" });
        }
        res.json({ message: "Tendencia eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar tendencia:", error);
        res.status(500).json({ error: "Error al eliminar la tendencia" });
    }
};