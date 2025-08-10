const express = require('express');
const { body, query } = require('express-validator');
const passport = require('../config/passport');
const controladorTendenciaTecnologica = require('../controllers/controladorTendenciaTecnologica');

/**
 * @swagger
 * tags:
 *   name: TendenciasTecnologicas
 *   description: Operaciones relacionadas con las tendencias tecnológicas
 */

/**
 * @swagger
 * /tendencia-tecnologica:
 *   get:
 *     summary: Obtiene la lista de tendencias tecnológicas
 *     tags: [TendenciasTecnologicas]
 *     responses:
 *       200:
 *         description: Lista de tendencias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_tendencia:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   relevancia_region:
 *                     type: string
 *                     enum: [Alta, Media, Baja]
 */

/**
 * @swagger
 * /tendencia-tecnologica/buscar:
 *   get:
 *     summary: Busca una tendencia por ID
 *     tags: [TendenciasTecnologicas]
 *     parameters:
 *       - in: query
 *         name: id_tendencia
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tendencia a buscar
 *     responses:
 *       200:
 *         description: Tendencia encontrada
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /tendencia-tecnologica:
 *   post:
 *     summary: Crea una nueva tendencia tecnológica
 *     tags: [TendenciasTecnologicas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - relevancia_region
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               relevancia_region:
 *                 type: string
 *                 enum: [Alta, Media, Baja]
 *     responses:
 *       201:
 *         description: Tendencia creada
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /tendencia-tecnologica:
 *   put:
 *     summary: Edita una tendencia existente
 *     tags: [TendenciasTecnologicas]
 *     parameters:
 *       - in: query
 *         name: id_tendencia
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tendencia a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - relevancia_region
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               relevancia_region:
 *                 type: string
 *                 enum: [Alta, Media, Baja]
 *     responses:
 *       200:
 *         description: Tendencia actualizada correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Tendencia no encontrada
 */

/**
 * @swagger
 * /tendencia-tecnologica:
 *   delete:
 *     summary: Elimina una tendencia tecnológica
 *     tags: [TendenciasTecnologicas]
 *     parameters:
 *       - in: query
 *         name: id_tendencia
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tendencia a eliminar
 *     responses:
 *       200:
 *         description: Tendencia eliminada correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Tendencia no encontrada
 */

const router = express.Router();

router.get('/', controladorTendenciaTecnologica.listar);
router.get('/buscar',
    query('id_tendencia')
        .notEmpty().withMessage('El ID de la tendencia es obligatorio')
        .isInt().withMessage('El ID de la tendencia debe ser un número entero'),
    controladorTendenciaTecnologica.listarPorId
);
router.post('/',
    body('nombre')
        .notEmpty().withMessage('El nombre de la tendencia es obligatorio')
        .isString().withMessage('El nombre de la tendencia debe ser una cadena de texto'),
    body('descripcion')
        .notEmpty().withMessage('La descripción de la tendencia es obligatoria')
        .isString().withMessage('La descripción de la tendencia debe ser una cadena de texto'),
    body('relevancia_region')
        .notEmpty().withMessage('La relevancia regional de la tendencia es obligatoria')
        .isIn(['Alta', 'Media', 'Baja']).withMessage('La relevancia regional debe ser: Alta, Media o Baja'),
    passport.authenticate('jwt', { session: false }),
    controladorTendenciaTecnologica.guardar
);

router.put('/',
    query('id_tendencia')
        .notEmpty().withMessage('El ID de la tendencia es obligatorio')
        .isInt().withMessage('El ID de la tendencia debe ser un número entero'),
    body('nombre')
        .notEmpty().withMessage('El nombre de la tendencia es obligatorio')
        .isString().withMessage('El nombre de la tendencia debe ser una cadena de texto'),
    body('descripcion')
        .notEmpty().withMessage('La descripción de la tendencia es obligatoria')
        .isString().withMessage('La descripción de la tendencia debe ser una cadena de texto'),
    body('relevancia_region')
        .notEmpty().withMessage('La relevancia regional de la tendencia es obligatoria')
        .isIn(['Alta', 'Media', 'Baja']).withMessage('La relevancia regional debe ser: Alta, Media o Baja'),
    passport.authenticate('jwt', { session: false }),
    controladorTendenciaTecnologica.editar
);

router.delete('/',
    query('id_tendencia')
        .notEmpty().withMessage('El ID de la tendencia es obligatorio')
        .isInt().withMessage('El ID de la tendencia debe ser un número entero'),
    passport.authenticate('jwt', { session: false }),
    controladorTendenciaTecnologica.eliminar
);


module.exports = router;