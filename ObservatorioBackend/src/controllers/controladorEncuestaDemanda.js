const { validationResult } = require('express-validator');
const EncuestaDemanda = require('../models/encuestaDemanda');
const ProductoServicio = require('../models/productoServicio');

exports.listar = async (req, res) => {
    try {
        const encuestas = await EncuestaDemanda.findAll({
            include: [{ model: ProductoServicio, attributes: ['nombre'] }]
        });
        res.json(encuestas);
    } catch (error) {
        console.error('Error al listar encuestas de demanda:', error);
        res.status(500).json({ error: 'Error al obtener encuestas de demanda' });
    }
};

exports.listarPorId = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_encuesta } = req.query;
    try {
        const encuesta = await EncuestaDemanda.findOne({
            where: { id_encuesta },
            include: [{ model: ProductoServicio, attributes: ['nombre'] }]
        });
        if (!encuesta) {
            return res.status(404).json({ error: 'Encuesta de demanda no encontrada' });
        }
        res.json(encuesta);
    } catch (error) {
        console.error('Error al buscar encuesta de demanda por ID:', error);
        res.status(500).json({ error: 'Error al buscar encuesta de demanda' });
    }
};

exports.guardar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    try {
        const { id_producto } = req.body;
        // Validar que el producto/servicio exista
        const productoExiste = await ProductoServicio.findByPk(id_producto);
        if (!productoExiste) {
            return res.status(400).json({ error: `El producto/servicio con id ${id_producto} no existe.` });
        }
        const nuevaEncuesta = await EncuestaDemanda.create(req.body);
        res.status(201).json(nuevaEncuesta);
    } catch (error) {
        console.error('Error al guardar encuesta de demanda:', error);
        res.status(500).json({ error: 'Error al guardar la encuesta de demanda' });
    }
};

exports.editar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_encuesta } = req.query;
    try {
        const updated = await EncuestaDemanda.update(req.body, {
            where: { id_encuesta }
        });
        if (updated[0] === 0) {
            return res.status(404).json({ error: 'Encuesta de demanda no encontrada' });
        }
        res.json({ message: 'Encuesta de demanda actualizada correctamente' });
    } catch (error) {
        console.error('Error al editar encuesta de demanda:', error);
        res.status(500).json({ error: 'Error al editar la encuesta de demanda' });
    }
};

exports.eliminar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_encuesta } = req.query;
    try {
        const eliminado = await EncuestaDemanda.destroy({
            where: { id_encuesta }
        });
        if (eliminado === 0) {
            return res.status(404).json({ error: 'Encuesta de demanda no encontrada' });
        }
        res.json({ message: 'Encuesta de demanda eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar encuesta de demanda:', error);
        res.status(500).json({ error: 'Error al eliminar la encuesta de demanda' });
    }
};
