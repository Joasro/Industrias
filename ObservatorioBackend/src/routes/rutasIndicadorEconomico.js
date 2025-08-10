const express = require('express');
const { body, param, query } = require('express-validator');
const passport = require('../config/passport');
const controladorIndicadorEconomico = require('../controllers/controladorIndicadorEconomico');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: IndicadoresEconomicos
 *   description: Operaciones relacionadas con indicadores económicos
 */

/**
 * @swagger
 * /indicador-economico:
 *   get:
 *     summary: Obtiene la lista de indicadores económicos
 *     tags: [IndicadoresEconomicos]
 *     responses:
 *       200:
 *         description: Lista de indicadores económicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IndicadorEconomico'
 */

/**
 * @swagger
 * /indicador-economico/buscar:
 *   get:
 *     summary: Busca un indicador económico por ID
 *     tags: [IndicadoresEconomicos]
 *     parameters:
 *       - in: query
 *         name: id_indicador
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del indicador económico a buscar
 *     responses:
 *       200:
 *         description: Indicador económico encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IndicadorEconomico'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Indicador económico no encontrado
 */

/**
 * @swagger
 * /indicador-economico:
 *   post:
 *     summary: Crea un nuevo indicador económico
 *     tags: [IndicadoresEconomicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - anio
 *               - codigo_pais
 *             properties:
 *               anio:
 *                 type: integer
 *               pib:
 *                 type: number
 *               inflacion:
 *                 type: number
 *               inversion_ti:
 *                 type: number
 *               codigo_pais:
 *                 type: string
 *     responses:
 *       201:
 *         description: Indicador económico creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IndicadorEconomico'
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /indicador-economico:
 *   put:
 *     summary: Edita un indicador económico existente
 *     tags: [IndicadoresEconomicos]
 *     parameters:
 *       - in: query
 *         name: id_indicador
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del indicador económico a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               anio:
 *                 type: integer
 *               pib:
 *                 type: number
 *               inflacion:
 *                 type: number
 *               inversion_ti:
 *                 type: number
 *               codigo_pais:
 *                 type: string
 *     responses:
 *       200:
 *         description: Indicador económico actualizado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Indicador económico no encontrado
 */

/**
 * @swagger
 * /indicador-economico:
 *   delete:
 *     summary: Elimina un indicador económico
 *     tags: [IndicadoresEconomicos]
 *     parameters:
 *       - in: query
 *         name: id_indicador
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del indicador económico a eliminar
 *     responses:
 *       200:
 *         description: Indicador económico eliminado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Indicador económico no encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     IndicadorEconomico:
 *       type: object
 *       required:
 *         - anio
 *         - codigo_pais
 *       properties:
 *         id_indicador:
 *           type: integer
 *           description: ID autoincremental del indicador
 *         anio:
 *           type: integer
 *           description: Año del indicador
 *         pib:
 *           type: number
 *           description: Producto Interno Bruto
 *         inflacion:
 *           type: number
 *           description: Inflación
 *         inversion_ti:
 *           type: number
 *           description: Inversión en TI
 *         codigo_pais:
 *           type: string
 *           description: Código del país
 *         Pais:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *       example:
 *         id_indicador: 1
 *         anio: 2025
 *         pib: 1000000.00
 *         inflacion: 3.5
 *         inversion_ti: 50000.00
 *         codigo_pais: "ARG"
 *         Pais:
 *           nombre: "Argentina"
 */

router.get('/', controladorIndicadorEconomico.listar);

router.get('/buscar',
    query('id_indicador')
        .notEmpty().withMessage('El ID del indicador es obligatorio')
        .isInt().withMessage('El ID debe ser un número entero'),
    controladorIndicadorEconomico.listarPorId
);

router.post('/',
    body('anio')
        .notEmpty().withMessage('El año es obligatorio')
        .isInt().withMessage('El año debe ser un número entero'),
    body('pib')
        .optional()
        .isNumeric().withMessage('El PIB debe ser un número'),
    body('inflacion')
        .optional()
        .isNumeric().withMessage('La inflación debe ser un número'),
    body('inversion_ti')
        .optional()
        .isNumeric().withMessage('La inversión TI debe ser un número'),
    body('codigo_pais')
        .notEmpty().withMessage('El código del país es obligatorio')
        .isString().withMessage('El código del país debe ser una cadena de texto')
        .isLength({ min: 3, max: 3 }).withMessage('El código del país debe tener 3 caracteres'),
    passport.authenticate('jwt', { session: false }),
    controladorIndicadorEconomico.guardar
);

router.put('/',
    query('id_indicador')
        .notEmpty().withMessage('El ID del indicador es obligatorio')
        .isInt().withMessage('El ID debe ser un número entero'),
    body('anio')
        .optional()
        .isInt().withMessage('El año debe ser un número entero'),
    body('pib')
        .optional()
        .isNumeric().withMessage('El PIB debe ser un número'),
    body('inflacion')
        .optional()
        .isNumeric().withMessage('La inflación debe ser un número'),
    body('inversion_ti')
        .optional()
        .isNumeric().withMessage('La inversión TI debe ser un número'),
    body('codigo_pais')
        .optional()
        .isString().withMessage('El código del país debe ser una cadena de texto')
        .isLength({ min: 3, max: 3 }).withMessage('El código del país debe tener 3 caracteres'),
    passport.authenticate('jwt', { session: false }),
    controladorIndicadorEconomico.editar
);

router.delete('/',
    query('id_indicador')
        .notEmpty().withMessage('El ID del indicador es obligatorio')
        .isInt().withMessage('El ID debe ser un número entero'),
    passport.authenticate('jwt', { session: false }),
    controladorIndicadorEconomico.eliminar
);

module.exports = router;