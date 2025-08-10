const { validationResult } = require('express-validator');
const IndicadorEconomico = require('../models/indicadorEconomico');
const Pais = require('../models/pais');

exports.listar = async (req, res) => {
    try {
        const indicadores = await IndicadorEconomico.findAll({
            include: [{ model: Pais, attributes: ['nombre'] }]
        });
        res.json(indicadores);
    } catch (error) {
        console.error('Error al listar indicadores económicos:', error);
        res.status(500).json({ error: 'Error al obtener indicadores económicos' });
    }
};

exports.listarPorId = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_indicador } = req.query;
    try {
        const indicador = await IndicadorEconomico.findOne({
            where: { id_indicador },
            include: [{ model: Pais, attributes: ['nombre'] }]
        });
        if (!indicador) {
            return res.status(404).json({ error: 'Indicador económico no encontrado' });
        }
        res.json(indicador);
    } catch (error) {
        console.error('Error al buscar indicador económico por ID:', error);
        res.status(500).json({ error: 'Error al buscar indicador económico' });
    }
};

exports.guardar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    try {
        const { codigo_pais } = req.body;
        // Validar que el país exista
        const paisExiste = await Pais.findByPk(codigo_pais);
        if (!paisExiste) {
            return res.status(400).json({ error: `El país con código ${codigo_pais} no existe.` });
        }
        const nuevoIndicador = await IndicadorEconomico.create(req.body);
        res.status(201).json(nuevoIndicador);
    } catch (error) {
        console.error('Error al guardar indicador económico:', error);
        res.status(500).json({ error: 'Error al guardar el indicador económico' });
    }
};

exports.editar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_indicador } = req.query;
    try {
        const updated = await IndicadorEconomico.update(req.body, {
            where: { id_indicador }
        });
        if (updated[0] === 0) {
            return res.status(404).json({ error: 'Indicador económico no encontrado' });
        }
        res.json({ message: 'Indicador económico actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar indicador económico:', error);
        res.status(500).json({ error: 'Error al editar el indicador económico' });
    }
};

exports.eliminar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_indicador } = req.query;
    try {
        const eliminado = await IndicadorEconomico.destroy({
            where: { id_indicador }
        });
        if (eliminado === 0) {
            return res.status(404).json({ error: 'Indicador económico no encontrado' });
        }
        res.json({ message: 'Indicador económico eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar indicador económico:', error);
        res.status(500).json({ error: 'Error al eliminar el indicador económico' });
    }
};
