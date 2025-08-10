const express = require('express');
const { body, param, query } = require('express-validator');
const passport = require('../config/passport');
const controladorEventoSector = require('../controllers/controladorEventoSector');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: EventosSector
 *   description: Operaciones relacionadas con eventos de sector
 */

/**
 * @swagger
 * /evento-sector:
 *   get:
 *     summary: Obtiene la lista de eventos de sector
 *     tags: [EventosSector]
 *     responses:
 *       200:
 *         description: Lista de eventos de sector
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventoSector'
 */

/**
 * @swagger
 * /evento-sector/buscar:
 *   get:
 *     summary: Busca un evento de sector por ID
 *     tags: [EventosSector]
 *     parameters:
 *       - in: query
 *         name: id_evento
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del evento de sector a buscar
 *     responses:
 *       200:
 *         description: Evento de sector encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventoSector'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Evento de sector no encontrado
 */

/**
 * @swagger
 * /evento-sector:
 *   post:
 *     summary: Crea un nuevo evento de sector
 *     tags: [EventosSector]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - tipo_evento
 *               - fecha
 *               - pais_afectado
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               tipo_evento:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *               pais_afectado:
 *                 type: string
 *                 description: Código de país afectado (CHAR(3))
 *               empresa_relacionada:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Evento de sector creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventoSector'
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /evento-sector:
 *   put:
 *     summary: Edita un evento de sector existente
 *     tags: [EventosSector]
 *     parameters:
 *       - in: query
 *         name: id_evento
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del evento de sector a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               tipo_evento:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *               pais_afectado:
 *                 type: string
 *                 description: Código de país afectado (CHAR(3))
 *               empresa_relacionada:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Evento de sector actualizado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Evento de sector no encontrado
 */

/**
 * @swagger
 * /evento-sector:
 *   delete:
 *     summary: Elimina un evento de sector
 *     tags: [EventosSector]
 *     parameters:
 *       - in: query
 *         name: id_evento
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del evento de sector a eliminar
 *     responses:
 *       200:
 *         description: Evento de sector eliminado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Evento de sector no encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EventoSector:
 *       type: object
 *       required:
 *         - titulo
 *         - tipo_evento
 *         - fecha
 *         - pais_afectado
 *       properties:
 *         id_evento:
 *           type: integer
 *           description: ID autoincremental del evento
 *         titulo:
 *           type: string
 *           description: Título del evento
 *         descripcion:
 *           type: string
 *           description: Descripción
 *         tipo_evento:
 *           type: string
 *           description: Tipo de evento
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha del evento
 *         pais_afectado:
 *           type: string
 *           description: País afectado por el evento
 *         empresa_relacionada:
 *           type: integer
 *           description: ID de la empresa relacionada
 *         Empresa:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *       example:
 *         id_evento: 1
 *         titulo: "Inversión en IA"
 *         descripcion: "Gran inversión en inteligencia artificial."
 *         tipo_evento: "Inversión"
 *         fecha: "2025-08-05"
 *         pais_afectado: "ARG"
 *         empresa_relacionada: 2
 *         Empresa:
 *           nombre: "Empresa S.A."
 */

router.get('/', controladorEventoSector.listar);

router.get('/buscar',
    query('id_evento')
        .notEmpty().withMessage('El ID del evento es obligatorio')
        .isInt().withMessage('El ID debe ser un número entero'),
    controladorEventoSector.listarPorId
);

router.post('/',
    body('titulo')
        .notEmpty().withMessage('El título es obligatorio')
        .isString().withMessage('El título debe ser una cadena de texto')
        .isLength({ max: 255 }).withMessage('El título no puede superar los 255 caracteres'),
    body('tipo_evento')
        .notEmpty().withMessage('El tipo de evento es obligatorio')
        .isIn(['Inversión', 'Hackeo', 'Adquisición', 'Cierre', 'Otro']).withMessage('Tipo de evento no válido'),
    body('fecha')
        .notEmpty().withMessage('La fecha es obligatoria')
        .isISO8601().withMessage('La fecha debe ser válida'),
    body('pais_afectado')
        .notEmpty().withMessage('El país afectado es obligatorio')
        .isString().withMessage('El país afectado debe ser una cadena de texto')
        .isLength({ min: 3, max: 3 }).withMessage('El país afectado debe tener 3 caracteres'),
    body('empresa_relacionada')
        .optional()
        .isInt().withMessage('El ID de la empresa debe ser un número entero'),
    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser una cadena de texto'),
    passport.authenticate('jwt', { session: false }),
    controladorEventoSector.guardar
);

router.put('/',
    query('id_evento')
        .notEmpty().withMessage('El ID del evento es obligatorio')
        .isInt().withMessage('El ID debe ser un número entero'),
    body('titulo')
        .optional()
        .isString().withMessage('El título debe ser una cadena de texto')
        .isLength({ max: 255 }).withMessage('El título no puede superar los 255 caracteres'),
    body('tipo_evento')
        .optional()
        .isIn(['Inversión', 'Hackeo', 'Adquisición', 'Cierre', 'Otro']).withMessage('Tipo de evento no válido'),
    body('fecha')
        .optional()
        .isISO8601().withMessage('La fecha debe ser válida'),
    body('pais_afectado')
        .optional()
        .isString().withMessage('El país afectado debe ser una cadena de texto')
        .isLength({ min: 3, max: 3 }).withMessage('El país afectado debe tener 3 caracteres'),
    body('empresa_relacionada')
        .optional()
        .isInt().withMessage('El ID de la empresa debe ser un número entero'),
    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser una cadena de texto'),
    passport.authenticate('jwt', { session: false }),
    controladorEventoSector.editar
);

router.delete('/',
    query('id_evento')
        .notEmpty().withMessage('El ID del evento es obligatorio')
        .isInt().withMessage('El ID debe ser un número entero'),
    passport.authenticate('jwt', { session: false }),
    controladorEventoSector.eliminar
);

module.exports = router;