const express = require('express');
const { body, param, query } = require('express-validator');
const passport = require('../config/passport');
const controladorPais = require('../controllers/controladorPais');
const { route } = require('./rutasAuth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Paises
 *   description: Operaciones relacionadas con los países
 */

/**
 * @swagger
 * /pais:
 *   get:
 *     summary: Obtiene la lista de países
 *     tags: [Paises]
 *     responses:
 *       200:
 *         description: Lista de países
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo_pais:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   pbi_tech:
 *                     type: number
 *                   num_empresas_software:
 *                     type: number
 *                   exportaciones_ti:
 *                     type: number
 */

/**
 * @swagger
 * /pais/buscar:
 *   get:
 *     summary: Busca un país por su código
 *     tags: [Paises]
 *     parameters:
 *       - in: query
 *         name: codigo_pais
 *         schema:
 *           type: string
 *         required: true
 *         description: Código del país
 *     responses:
 *       200:
 *         description: País encontrado
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /pais:
 *   post:
 *     summary: Registra un nuevo país
 *     tags: [Paises]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo_pais
 *               - nombre
 *               - pbi_tech
 *               - num_empresas_software
 *               - exportaciones_ti
 *             properties:
 *               codigo_pais:
 *                 type: string
 *               nombre:
 *                 type: string
 *               pbi_tech:
 *                 type: number
 *               num_empresas_software:
 *                 type: number
 *               exportaciones_ti:
 *                 type: number
 *     responses:
 *       201:
 *         description: País registrado exitosamente
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /pais:
 *   put:
 *     summary: Edita un país existente
 *     tags: [Paises]
 *     parameters:
 *       - in: query
 *         name: codigo_pais
 *         schema:
 *           type: string
 *         required: true
 *         description: Código del país a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - pbi_tech
 *               - num_empresas_software
 *               - exportaciones_ti
 *             properties:
 *               nombre:
 *                 type: string
 *               pbi_tech:
 *                 type: number
 *               num_empresas_software:
 *                 type: number
 *               exportaciones_ti:
 *                 type: number
 *     responses:
 *       200:
 *         description: País actualizado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: País no encontrado
 */

/**
 * @swagger
 * /pais:
 *   delete:
 *     summary: Elimina un país
 *     tags: [Paises]
 *     parameters:
 *       - in: query
 *         name: codigo_pais
 *         schema:
 *           type: string
 *         required: true
 *         description: Código del país a eliminar
 *     responses:
 *       200:
 *         description: País eliminado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: País no encontrado
 */


router.get('/', controladorPais.listar);

router.get('/buscar',
    query('codigo_pais')
        .notEmpty().withMessage('El código del país es obligatorio')
        .isString().withMessage('El código del país debe ser una cadena de texto'),
    controladorPais.listarPorId
);

router.post('/',
    body('codigo_pais')
        .notEmpty().withMessage('El código del país es obligatorio')
        .isString().withMessage('El código del país debe ser una cadena de texto'),
    body('nombre')
        .notEmpty().withMessage('El nombre del país es obligatorio')
        .isString().withMessage('El nombre del país debe ser una cadena de texto'),
    body('pbi_tech')
        .isNumeric().withMessage('El PBI tecnológico debe ser un número'),
    body('num_empresas_software')
        .isNumeric().withMessage('El número de empresas de software debe ser un número'),
    body('exportaciones_ti')
        .isNumeric().withMessage('Las exportaciones TI deben ser un número'),
    passport.authenticate('jwt', { session: false }),
    controladorPais.guardar
);

router.put('/',
    query('codigo_pais')
        .notEmpty().withMessage('El código del país es obligatorio')
        .isString().withMessage('El código del país debe ser una cadena de texto'),
    body('nombre')
        .notEmpty().withMessage('El nombre del país es obligatorio')
        .isString().withMessage('El nombre del país debe ser una cadena de texto'),
    body('pbi_tech')
        .isNumeric().withMessage('El PBI tecnológico debe ser un número'),
    body('num_empresas_software')
        .isNumeric().withMessage('El número de empresas de software debe ser un número'),
    body('exportaciones_ti')
        .isNumeric().withMessage('Las exportaciones TI deben ser un número'),
    passport.authenticate('jwt', { session: false }),
    controladorPais.editar
);

router.delete('/',
    query('codigo_pais')
        .notEmpty().withMessage('El código del país es obligatorio')
        .isString().withMessage('El código del país debe ser una cadena de texto'),
    passport.authenticate('jwt', { session: false }),
    controladorPais.eliminar
);


module.exports = router;