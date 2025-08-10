const express = require('express');
const { body, param, query } = require('express-validator');
const passport = require('../config/passport');
const controladorEncuestaDemanda = require('../controllers/controladorEncuestaDemanda');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: EncuestasDemanda
 *   description: Operaciones relacionadas con encuestas de demanda
 */

/**
 * @swagger
 * /encuesta-demanda:
 *   get:
 *     summary: Obtiene la lista de encuestas de demanda
 *     tags: [EncuestasDemanda]
 *     responses:
 *       200:
 *         description: Lista de encuestas de demanda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EncuestaDemanda'
 */

/**
 * @swagger
 * /encuesta-demanda/buscar:
 *   get:
 *     summary: Busca una encuesta de demanda por ID
 *     tags: [EncuestasDemanda]
 *     parameters:
 *       - in: query
 *         name: id_encuesta
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la encuesta de demanda a buscar
 *     responses:
 *       200:
 *         description: Encuesta de demanda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EncuestaDemanda'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Encuesta de demanda no encontrada
 */

/**
 * @swagger
 * /encuesta-demanda:
 *   post:
 *     summary: Crea una nueva encuesta de demanda
 *     tags: [EncuestasDemanda]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - porcentaje_demanda
 *               - anio
 *               - id_producto
 *             properties:
 *               porcentaje_demanda:
 *                 type: number
 *               anio:
 *                 type: integer
 *               id_producto:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Encuesta de demanda creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EncuestaDemanda'
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /encuesta-demanda:
 *   put:
 *     summary: Edita una encuesta de demanda existente
 *     tags: [EncuestasDemanda]
 *     parameters:
 *       - in: query
 *         name: id_encuesta
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la encuesta de demanda a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               porcentaje_demanda:
 *                 type: number
 *               anio:
 *                 type: integer
 *               id_producto:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Encuesta de demanda actualizada correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Encuesta de demanda no encontrada
 */

/**
 * @swagger
 * /encuesta-demanda:
 *   delete:
 *     summary: Elimina una encuesta de demanda
 *     tags: [EncuestasDemanda]
 *     parameters:
 *       - in: query
 *         name: id_encuesta
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la encuesta de demanda a eliminar
 *     responses:
 *       200:
 *         description: Encuesta de demanda eliminada correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Encuesta de demanda no encontrada
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EncuestaDemanda:
 *       type: object
 *       required:
 *         - porcentaje_demanda
 *         - anio
 *         - id_producto
 *       properties:
 *         id_encuesta:
 *           type: integer
 *           description: ID autoincremental de la encuesta
 *         porcentaje_demanda:
 *           type: number
 *           description: Porcentaje de demanda
 *         anio:
 *           type: integer
 *           description: Año de la encuesta
 *         id_producto:
 *           type: integer
 *           description: ID del producto/servicio relacionado
 *         ProductoServicio:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *       example:
 *         id_encuesta: 1
 *         porcentaje_demanda: 75.5
 *         anio: 2025
 *         id_producto: 2
 *         ProductoServicio:
 *           nombre: "Producto X"
 */

router.get('/', controladorEncuestaDemanda.listar);

router.get('/buscar',
    query('id_encuesta')
        .notEmpty().withMessage('El ID de la encuesta es obligatorio')
        .isInt().withMessage('El ID debe ser un número entero'),
    controladorEncuestaDemanda.listarPorId
);

router.post('/',
    body('porcentaje_demanda')
        .notEmpty().withMessage('El porcentaje de demanda es obligatorio')
        .isFloat({ min: 0, max: 100 }).withMessage('El porcentaje debe estar entre 0 y 100'),
    body('anio')
        .notEmpty().withMessage('El año es obligatorio')
        .isInt({ min: 1900, max: 2100 }).withMessage('El año debe ser válido'),
    body('id_producto')
        .notEmpty().withMessage('El ID del producto/servicio es obligatorio')
        .isInt().withMessage('El ID debe ser un número entero'),
    passport.authenticate('jwt', { session: false }),
    controladorEncuestaDemanda.guardar
);

router.put('/',
    query('id_encuesta')
        .notEmpty().withMessage('El ID de la encuesta es obligatorio')
        .isInt().withMessage('El ID debe ser un número entero'),
    body('porcentaje_demanda')
        .optional()
        .isFloat({ min: 0, max: 100 }).withMessage('El porcentaje debe estar entre 0 y 100'),
    body('anio')
        .optional()
        .isInt({ min: 1900, max: 2100 }).withMessage('El año debe ser válido'),
    body('id_producto')
        .optional()
        .isInt().withMessage('El ID debe ser un número entero'),
    passport.authenticate('jwt', { session: false }),
    controladorEncuestaDemanda.editar
);

router.delete('/',
    query('id_encuesta')
        .notEmpty().withMessage('El ID de la encuesta es obligatorio')
        .isInt().withMessage('El ID debe ser un número entero'),
    passport.authenticate('jwt', { session: false }),
    controladorEncuestaDemanda.eliminar
);

module.exports = router;
