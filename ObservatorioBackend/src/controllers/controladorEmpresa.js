const { validationResult } = require('express-validator');
const Empresa = require('../models/empresa.js');
const TendenciaTecnologica = require('../models/tendenciatecnologica.js');
const { Op } = require('sequelize');

Empresa.belongsTo(TendenciaTecnologica, { foreignKey: 'id_tendencia' });

exports.listar = async (req, res) => {
    try {
        const empresas = await Empresa.findAll({
            include: [{ model: TendenciaTecnologica, attributes: ['nombre'] }]
        });
        res.json(empresas);
    } catch (error) {
        console.error("Error al listar empresas:", error);
        res.status(500).json({ error: "Error al obtener empresas" });
    }
};

exports.listarPorId = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_empresa } = req.query;
    try {
        const lista = await Empresa.findAll({
            where: {
                id_empresa: {
                    [Op.like]: `%${id_empresa}%`
                }
            },
            include: [{ model: TendenciaTecnologica, attributes: ['nombre'] }]
        });
        res.json(lista);
    } catch (error) {
        console.error("Error al buscar empresa por ID:", error);
        res.status(500).json({ error: "Error al buscar empresa" });
    }
};

exports.guardar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { nombre, pais, sector, anio_fundacion, empleados, sito_web, linkedin, descripcion, id_tendencia } = req.body;
    try {
        const nuevaEmpresa = await Empresa.create({
            nombre,
            pais,
            sector,
            anio_fundacion,
            empleados,
            sito_web,
            linkedin,
            descripcion,
            id_tendencia
        });
        res.status(201).json(nuevaEmpresa);
    } catch (error) {
        console.error("Error al guardar empresa:", error);
        res.status(500).json({ error: "Error al guardar la empresa" });
    }
};

exports.editar = async (req, res) => {
    const validacion = validationResult(req);   
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_empresa } = req.query;       
    try {
        const updatedEmpresa = await Empresa.update(req.body, {
            where: { id_empresa: id_empresa }
        });
        if (updatedEmpresa[0] === 0) {
            return res.status(404).json({ error: "Empresa no encontrada" });
        }
        res.json({ message: "Empresa actualizada correctamente" });
    } catch (error) {
        console.error("Error al editar empresa:", error);
        res.status(500).json({ error: "Error al editar la empresa" });
    }
};

exports.eliminar = async (req, res) => {    
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_empresa } = req.query;
    try {
        const deletedEmpresa = await Empresa.destroy({
            where: { id_empresa: id_empresa }
        }); 
        if (deletedEmpresa === 0) {
            return res.status(404).json({ error: "Empresa no encontrada" });
        }
        res.json({ message: "Empresa eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar empresa:", error);
        res.status(500).json({ error: "Error al eliminar la empresa" });
    }
};
