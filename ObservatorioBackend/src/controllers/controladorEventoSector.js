const { validationResult } = require('express-validator');
const EventoSector = require('../models/eventoSector');
const Empresa = require('../models/empresa');

exports.listar = async (req, res) => {
    try {
        const eventos = await EventoSector.findAll({
            include: [{ model: Empresa, attributes: ['nombre'] }]
        });
        res.json(eventos);
    } catch (error) {
        console.error('Error al listar eventos de sector:', error);
        res.status(500).json({ error: 'Error al obtener eventos de sector' });
    }
};

exports.listarPorId = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_evento } = req.query;
    try {
        const evento = await EventoSector.findOne({
            where: { id_evento },
            include: [{ model: Empresa, attributes: ['nombre'] }]
        });
        if (!evento) {
            return res.status(404).json({ error: 'Evento de sector no encontrado' });
        }
        res.json(evento);
    } catch (error) {
        console.error('Error al buscar evento de sector por ID:', error);
        res.status(500).json({ error: 'Error al buscar evento de sector' });
    }
};

exports.guardar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    try {
        const { empresa_relacionada } = req.body;
        // Validar que la empresa relacionada exista si se envía
        if (empresa_relacionada) {
            const empresaExiste = await Empresa.findByPk(empresa_relacionada);
            if (!empresaExiste) {
                return res.status(400).json({ error: `La empresa con id ${empresa_relacionada} no existe.` });
            }
        }
        // pais_afectado se guarda directamente, no se valida contra modelo Pais
        const nuevoEvento = await EventoSector.create(req.body);
        res.status(201).json(nuevoEvento);
    } catch (error) {
        console.error('Error al guardar evento de sector:', error);
        res.status(500).json({ error: 'Error al guardar el evento de sector' });
    }
};

exports.editar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_evento } = req.query;
    try {
        const updated = await EventoSector.update(req.body, {
            where: { id_evento }
        });
        if (updated[0] === 0) {
            return res.status(404).json({ error: 'Evento de sector no encontrado' });
        }
        res.json({ message: 'Evento de sector actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar evento de sector:', error);
        res.status(500).json({ error: 'Error al editar el evento de sector' });
    }
};

exports.eliminar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_evento } = req.query;
    try {
        const eliminado = await EventoSector.destroy({
            where: { id_evento }
        });
        if (eliminado === 0) {
            return res.status(404).json({ error: 'Evento de sector no encontrado' });
        }
        res.json({ message: 'Evento de sector eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar evento de sector:', error);
        res.status(500).json({ error: 'Error al eliminar el evento de sector' });
    }
};
