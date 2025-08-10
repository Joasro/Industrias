
const express = require('express');
const { body, query } = require('express-validator');
const passport = require('../config/passport');
const controladorUsuario = require('../controllers/controladorUsuario');
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Operaciones relacionadas con los usuarios
 */

/**
 * @swagger
 * /usuario:
 *   get:
 *     summary: Obtiene la lista de usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */

/**
 * @swagger
 * /usuario/buscar:
 *   get:
 *     summary: Busca un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: id_usuario
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a buscar
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /usuario:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *               - rol
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [admin, analista, lector]
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /usuario:
 *   put:
 *     summary: Edita un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: id_usuario
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [admin, analista, lector]
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /usuario:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: id_usuario
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - password
 *         - rol
 *       properties:
 *         id_usuario:
 *           type: integer
 *           description: ID autoincremental del usuario
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         password:
 *           type: string
 *           description: Contraseña encriptada
 *         rol:
 *           type: string
 *           enum: [admin, analista, lector]
 *           description: Rol del usuario
 *       example:
 *         id_usuario: 1
 *         nombre: "Juan Perez"
 *         email: "juan@ejemplo.com"
 *         password: "hash"
 *         rol: "admin"
*/

router.get('/', passport.authenticate('jwt', { session: false }), controladorUsuario.listar);

router.get('/buscar',
    query('id_usuario')
        .notEmpty().withMessage('El ID del usuario es obligatorio')
        .isInt().withMessage('El ID del usuario debe ser un número entero'),
    passport.authenticate('jwt', { session: false }),
    controladorUsuario.listarPorId
);

router.post('/',
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser una cadena de texto')
        .isLength({ max: 100 }).withMessage('El nombre no puede superar los 100 caracteres'),
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('El email debe ser válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    body('rol')
        .notEmpty().withMessage('El rol es obligatorio')
        .isIn(['admin', 'analista', 'lector']).withMessage('Rol inválido'),
    passport.authenticate('jwt', { session: false }),
    controladorUsuario.guardar
);

router.put('/',
    query('id_usuario')
        .notEmpty().withMessage('El ID del usuario es obligatorio')
        .isInt().withMessage('El ID del usuario debe ser un número entero'),
    body('nombre')
        .optional()
        .isString().withMessage('El nombre debe ser una cadena de texto'),
    body('email')
        .optional()
        .isEmail().withMessage('El email debe ser válido'),
    body('password')
        .optional(),
    body('rol')
        .optional()
        .isIn(['admin', 'analista', 'lector']).withMessage('Rol inválido'),
    passport.authenticate('jwt', { session: false }),
    controladorUsuario.editar
);

router.delete('/',
    query('id_usuario')
        .notEmpty().withMessage('El ID del usuario es obligatorio')
        .isInt().withMessage('El ID del usuario debe ser un número entero'),
    passport.authenticate('jwt', { session: false }),
    controladorUsuario.eliminar
);

module.exports = router;