const { validationResult } = require('express-validator');
const ProductoServicio = require('../models/productoServicio');
const Empresa = require('../models/empresa');
const { Op } = require('sequelize');

ProductoServicio.belongsTo(Empresa, { foreignKey: 'id_empresa' });

exports.listar = async (req, res) => {
    try {
        const productos = await ProductoServicio.findAll({
            include: [{ model: Empresa, attributes: ['nombre'] }]
        });
        res.json(productos);
    } catch (error) {
        console.error("Error al listar productos/servicios:", error);
        res.status(500).json({ error: "Error al obtener productos/servicios" });
    }
};

exports.listarPorId = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_producto } = req.query;
    try {
        const lista = await ProductoServicio.findAll({
            where: {
                id_producto: id_producto
            },
            include: [{ model: Empresa, attributes: ['nombre'] }]
        });
        if (!lista || lista.length === 0) {
            return res.status(404).json({ error: "Producto o servicio no encontrado" });
        }
        res.json(lista);
    } catch (error) {
        console.error("Error al buscar producto/servicio por ID:", error);
        res.status(500).json({ error: "Error al buscar producto/servicio" });
    }
};

exports.guardar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    try {
        const { id_empresa } = req.body;
        // Validar que la empresa exista antes de crear el producto/servicio
        const empresaExiste = await Empresa.findByPk(id_empresa);
        if (!empresaExiste) {
            return res.status(400).json({ error: `La empresa con id ${id_empresa} no existe.` });
        }
        const nuevoProducto = await ProductoServicio.create(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error al guardar producto/servicio:", error);
        res.status(500).json({ error: "Error al guardar el producto/servicio" });
    }
};

exports.editar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_producto } = req.query;
    try {
        const updated = await ProductoServicio.update(req.body, {
            where: { id_producto }
        });
        if (updated[0] === 0) {
            return res.status(404).json({ error: "Producto o servicio no encontrado" });
        }
        res.json({ message: "Producto o servicio actualizado correctamente" });
    } catch (error) {
        console.error("Error al editar producto/servicio:", error);
        res.status(500).json({ error: "Error al editar el producto/servicio" });
    }
};

exports.eliminar = async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json(validacion.errors);
    }
    const { id_producto } = req.query;
    try {
        const eliminado = await ProductoServicio.destroy({
            where: { id_producto }
        });
        if (eliminado === 0) {
            return res.status(404).json({ error: "Producto o servicio no encontrado" });
        }
        res.json({ message: "Producto o servicio eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar producto/servicio:", error);
        res.status(500).json({ error: "Error al eliminar el producto/servicio" });
    }
};
