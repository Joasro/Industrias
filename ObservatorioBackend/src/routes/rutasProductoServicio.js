const express = require('express');
const { body, query } = require('express-validator');
const passport = require('../config/passport');
const controladorProductoServicio = require('../controllers/controladorProductoServicio');
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: ProductosServicios
 *   description: Operaciones relacionadas con productos y servicios
 */

/**
 * @swagger
 * /producto-servicio:
 *   get:
 *     summary: Obtiene la lista de productos y servicios
 *     tags: [ProductosServicios]
 *     responses:
 *       200:
 *         description: Lista de productos y servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductoServicio'
 */

/**
 * @swagger
 * /producto-servicio/buscar:
 *   get:
 *     summary: Busca un producto o servicio por ID
 *     tags: [ProductosServicios]
 *     parameters:
 *       - in: query
 *         name: id_producto
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto o servicio a buscar
 *     responses:
 *       200:
 *         description: Producto o servicio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductoServicio'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Producto o servicio no encontrado
 */

/**
 * @swagger
 * /producto-servicio:
 *   post:
 *     summary: Crea un nuevo producto o servicio
 *     tags: [ProductosServicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_empresa
 *               - nombre
 *               - tipo
 *             properties:
 *               id_empresa:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               tipo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha_lanzamiento:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Producto o servicio creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductoServicio'
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /producto-servicio:
 *   put:
 *     summary: Edita un producto o servicio existente
 *     tags: [ProductosServicios]
 *     parameters:
 *       - in: query
 *         name: id_producto
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto o servicio a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               tipo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha_lanzamiento:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Producto o servicio actualizado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Producto o servicio no encontrado
 */

/**
 * @swagger
 * /producto-servicio:
 *   delete:
 *     summary: Elimina un producto o servicio
 *     tags: [ProductosServicios]
 *     parameters:
 *       - in: query
 *         name: id_producto
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto o servicio a eliminar
 *     responses:
 *       200:
 *         description: Producto o servicio eliminado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Producto o servicio no encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductoServicio:
 *       type: object
 *       required:
 *         - id_empresa
 *         - nombre
 *         - tipo
 *       properties:
 *         id_producto:
 *           type: integer
 *           description: ID autoincremental del producto o servicio
 *         id_empresa:
 *           type: integer
 *           description: ID de la empresa relacionada
 *         nombre:
 *           type: string
 *           description: Nombre del producto o servicio
 *         tipo:
 *           type: string
 *           description: Tipo de producto o servicio
 *         descripcion:
 *           type: string
 *           description: Descripción
 *         fecha_lanzamiento:
 *           type: string
 *           format: date
 *           description: Fecha de lanzamiento
 *         Empresa:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *       example:
 *         id_producto: 1
 *         id_empresa: 2
 *         nombre: "Producto X"
 *         tipo: "Servicio"
 *         descripcion: "Descripción del producto o servicio"
 *         fecha_lanzamiento: "2025-08-05"
 *         Empresa:
 *           nombre: "Empresa S.A."
 */


router.get('/', controladorProductoServicio.listar);

router.get('/buscar',
    query('id_producto')
        .notEmpty().withMessage('El ID del producto es obligatorio')
        .isInt().withMessage('El ID debe ser un número entero'),
    controladorProductoServicio.listarPorId
);

router.post('/',
    body('id_empresa')
        .notEmpty().withMessage('El ID de la empresa es obligatorio')
        .isInt().withMessage('El ID de la empresa debe ser un número entero'),
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser una cadena de texto')
        .isLength({ max: 255 }).withMessage('El nombre no puede superar los 255 caracteres'),
    body('tipo')
        .notEmpty().withMessage('El tipo es obligatorio')
        .isString().withMessage('El tipo debe ser una cadena de texto')
        .isLength({ max: 100 }).withMessage('El tipo no puede superar los 100 caracteres'),
    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser una cadena de texto'),
    body('fecha_lanzamiento')
        .optional()
        .isISO8601().withMessage('La fecha de lanzamiento debe ser una fecha válida'),
        passport.authenticate('jwt', { session: false }),
    controladorProductoServicio.guardar
);

router.put('/',
    query('id_producto')
        .notEmpty().withMessage('El ID del producto es obligatorio')
        .isInt().withMessage('El ID debe ser un número entero'),
    body('nombre')
        .optional()
        .isString().withMessage('El nombre debe ser una cadena de texto')
        .isLength({ max: 255 }).withMessage('El nombre no puede superar los 255 caracteres'),
    body('tipo')
        .optional()
        .isString().withMessage('El tipo debe ser una cadena de texto')
        .isLength({ max: 100 }).withMessage('El tipo no puede superar los 100 caracteres'),
    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser una cadena de texto'),
    body('fecha_lanzamiento')
        .optional()
        .isISO8601().withMessage('La fecha de lanzamiento debe ser una fecha válida'),
    passport.authenticate('jwt', { session: false }),
    controladorProductoServicio.editar
);

router.delete('/',
    query('id_producto')
        .notEmpty().withMessage('El ID del producto es obligatorio')
        .isInt().withMessage('El ID debe ser un número entero'),
    passport.authenticate('jwt', { session: false }),
    controladorProductoServicio.eliminar
);

module.exports = router;
