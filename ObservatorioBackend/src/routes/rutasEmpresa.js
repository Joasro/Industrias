const express = require('express');
const { body, query } = require('express-validator');
const passport = require('../config/passport');
const controladorEmpresa = require('../controllers/controladorEmpresa');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Empresas
 *   description: Operaciones relacionadas con las empresas
 */

/**
 * @swagger
 * /empresa:
 *   get:
 *     summary: Obtiene la lista de empresas
 *     tags: [Empresas]
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_empresa:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   pais:
 *                     type: string
 *                   sector:
 *                     type: string
 *                   anio_fundacion:
 *                     type: integer
 *                   empleados:
 *                     type: integer
 *                   sito_web:
 *                     type: string
 *                   linkedin:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   id_tendencia:
 *                     type: integer
 *                   TendenciaTecnologica:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 */

/**
 * @swagger
 * /empresa/buscar:
 *   get:
 *     summary: Busca una empresa por ID
 *     tags: [Empresas]
 *     parameters:
 *       - in: query
 *         name: id_empresa
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la empresa a buscar
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /empresa:
 *   post:
 *     summary: Crea una nueva empresa
 *     tags: [Empresas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - pais
 *               - sector
 *             properties:
 *               nombre:
 *                 type: string
 *               pais:
 *                 type: string
 *               sector:
 *                 type: string
 *               anio_fundacion:
 *                 type: integer
 *               empleados:
 *                 type: integer
 *               sito_web:
 *                 type: string
 *               linkedin:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               id_tendencia:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Empresa creada correctamente
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /empresa:
 *   put:
 *     summary: Edita una empresa existente
 *     tags: [Empresas]
 *     parameters:
 *       - in: query
 *         name: id_empresa
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la empresa a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               pais:
 *                 type: string
 *               sector:
 *                 type: string
 *               anio_fundacion:
 *                 type: integer
 *               empleados:
 *                 type: integer
 *               sito_web:
 *                 type: string
 *               linkedin:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               id_tendencia:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Empresa actualizada correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Empresa no encontrada
 */

/**
 * @swagger
 * /empresa:
 *   delete:
 *     summary: Elimina una empresa
 *     tags: [Empresas]
 *     parameters:
 *       - in: query
 *         name: id_empresa
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la empresa a eliminar
 *     responses:
 *       200:
 *         description: Empresa eliminada correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Empresa no encontrada
 */


router.get('/', controladorEmpresa.listar);

router.get('/buscar',
    query('id_empresa')
        .notEmpty().withMessage('El ID de la empresa es obligatorio')
        .isInt().withMessage('El ID de la empresa debe ser un número entero'),
    controladorEmpresa.listarPorId
);

router.post('/',
    body('nombre')
        .notEmpty().withMessage('El nombre de la empresa es obligatorio')
        .isString().withMessage('El nombre de la empresa debe ser una cadena de texto'),
    body('pais')
        .notEmpty().withMessage('El país de la empresa es obligatorio')
        .isString().withMessage('El país de la empresa debe ser una cadena de texto'),
    body('sector')
        .notEmpty().withMessage('El sector de la empresa es obligatorio')
        .isString().withMessage('El sector de la empresa debe ser una cadena de texto'),
    body('anio_fundacion')
        .optional()
        .isInt().withMessage('El año de fundación debe ser un número entero'),
    body('empleados')
        .optional()
        .isInt().withMessage('El número de empleados debe ser un número entero'),
    body('sito_web')
        .optional()
        .isURL().withMessage('El sitio web debe ser una URL válida'),
    body('linkedin')
        .optional()
        .isURL().withMessage('El LinkedIn debe ser una URL válida'),
    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser una cadena de texto'),
        passport.authenticate('jwt', { session: false }),
    controladorEmpresa.guardar
);
router.put('/',
    query('id_empresa')
        .notEmpty().withMessage('El ID de la empresa es obligatorio')
        .isInt().withMessage('El ID de la empresa debe ser un número entero'),
    body('nombre')
        .notEmpty().withMessage('El nombre de la empresa es obligatorio')
        .isString().withMessage('El nombre de la empresa debe ser una cadena de texto'),
    body('pais')
        .notEmpty().withMessage('El país de la empresa es obligatorio')
        .isString().withMessage('El país de la empresa debe ser una cadena de texto'),
    body('sector')
        .notEmpty().withMessage('El sector de la empresa es obligatorio')
        .isString().withMessage('El sector de la empresa debe ser una cadena de texto'),
    body('anio_fundacion')  
        .optional()
        .isInt().withMessage('El año de fundación debe ser un número entero'),
    body('empleados')
        .optional()
        .isInt().withMessage('El número de empleados debe ser un número entero'),
    body('sito_web')
        .optional()
        .isURL().withMessage('El sitio web debe ser una URL válida'),
    body('linkedin')    
        .optional()
        .isURL().withMessage('El LinkedIn debe ser una URL válida'),
    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser una cadena de texto'),
    passport.authenticate('jwt', { session: false }),
    controladorEmpresa.editar
);  
router.delete('/',
    query('id_empresa')
        .notEmpty().withMessage('El ID de la empresa es obligatorio')
        .isInt().withMessage('El ID de la empresa debe ser un número entero'),
    passport.authenticate('jwt', { session: false }),
    controladorEmpresa.eliminar
);

module.exports = router;