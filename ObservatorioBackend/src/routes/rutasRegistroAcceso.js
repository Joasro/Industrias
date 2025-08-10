const express = require('express');
const { body, query } = require('express-validator');
const passport = require('../config/passport');
const controladorRegistroAcceso = require('../controllers/controladorRegistrosAcceso');
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: RegistrosAcceso
 *   description: Operaciones relacionadas con los registros de acceso
 */

/**
 * @swagger
 * /registro-acceso:
 *   get:
 *     summary: Obtiene la lista de registros de acceso
 *     tags: [RegistrosAcceso]
 *     responses:
 *       200:
 *         description: Lista de registros de acceso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RegistroAcceso'
 */

/**
 * @swagger
 * /registro-acceso/buscar:
 *   get:
 *     summary: Busca un registro de acceso por ID
 *     tags: [RegistrosAcceso]
 *     parameters:
 *       - in: query
 *         name: id_log
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del registro de acceso a buscar
 *     responses:
 *       200:
 *         description: Registro de acceso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroAcceso'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Registro de acceso no encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegistroAcceso:
 *       type: object
 *       required:
 *         - id_usuario
 *         - accion
 *       properties:
 *         id_log:
 *           type: integer
 *           description: ID autoincremental del registro
 *         id_usuario:
 *           type: integer
 *           description: ID del usuario relacionado
 *         fecha_acceso:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del acceso
 *         accion:
 *           type: string
 *           description: Acción realizada
 *       example:
 *         id_log: 1
 *         id_usuario: 2
 *         fecha_acceso: "2025-08-05T23:59:00Z"
 *         accion: "Inicio de sesión"
*/

router.get('/', passport.authenticate('jwt', { session: false }), controladorRegistroAcceso.listar);

router.get('/buscar',
    query('id_log')
        .notEmpty().withMessage('El ID del registro es obligatorio')
        .isInt().withMessage('El ID debe ser un número entero'),
    passport.authenticate('jwt', { session: false }),
    controladorRegistroAcceso.listarPorId
);

module.exports = router;