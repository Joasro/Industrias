const { validationResult } = require('express-validator');
const Pais = require('../models/pais.js');
const { Op } = require('sequelize');

exports.listar = async (req, res) => {
    try {
        const paises = await Pais.findAll();
        res.json(paises);
    } catch (error) {
        console.error("Error al listar paises:", error);
        res.status(500).json({ error: "Error al obtener paises" });
    }
};

exports.listarPorId = async (req, res) => {
    const validacion = validationResult(req);
    if (validacion.errors.length > 0) {
        console.log(validacion.errors);
        res.status(400).json(validacion.errors);
    } 
    else{ 
        const { codigo_pais } = req.query;
        const lista = await Pais.findAll({
            where: {
                codigo_pais: {
                    [Op.like]: `%${codigo_pais}%`
                }
            }
        });
        res.json(lista);
    }
};

exports.guardar = async (req, res) => {
  const validacion = validationResult(req);
  if (validacion.errors.length > 0) {
    console.log(validacion.errors);
    return res.status(400).json(validacion.errors);
  }

  const { codigo_pais, nombre, pbi_tech, num_empresas_software, exportaciones_ti } = req.body;

  try {
    const nuevoPais = await Pais.create({
      codigo_pais,
      nombre,
      pbi_tech,
      num_empresas_software,
      exportaciones_ti
    });
    res.status(201).json(nuevoPais);
  } catch (error) {
    console.error("Error al guardar pais:", error);
    res.status(500).json({ error: "Error al guardar el pais" });
  }
};

exports.editar = async (req, res) => {
    try {
        const { codigo_pais } = req.query;
        const uppais = await Pais.update(req.body, {
            where: { codigo_pais: codigo_pais }
        });

        if (uppais[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pais no encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Pais actualizado exitosamente'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Error al actualizar el pais',
            error: error.message
        });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const { codigo_pais } = req.query;
        const result = await Pais.destroy({
            where: { codigo_pais: codigo_pais }
    });
        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pais no encontrado'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Pais eliminado exitosamente'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Error al eliminar el pais',
            error: error.message
        });
    }
};