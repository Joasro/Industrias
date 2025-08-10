const express = require('express');
const controladorFrontend = require('../controllers/controladorFrontend');
const router = express.Router();
/**
 * @swagger
 * /frontend/comparativa-paises:
 *   get:
 *     summary: Comparativa general entre países de la región (indicadores, empresas y productos)
 *     tags: [Frontend]
 *     parameters:
 *       - in: query
 *         name: paises
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         required: false
 *         description: Lista de códigos de país separados por coma (si no se envía, se usan todos)
 *     responses:
 *       200:
 *         description: Comparativa general por país
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pais:
 *                     type: string
 *                   total_empresas:
 *                     type: integer
 *                   total_productos:
 *                     type: integer
 *                   empresas:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Empresa'
 *                   productos:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/ProductoServicio'
 *                   indicadores:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/IndicadorEconomico'
 */
router.get('/comparativa-paises', controladorFrontend.comparativaPaises);


/**
 * @swagger
 * /frontend/eventos-por-fecha:
 *   get:
 *     summary: Filtrar eventos por rango de fechas
 *     tags: [Frontend]
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha de inicio (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha de fin (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Eventos en el rango de fechas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventoSector'
 */
router.get('/eventos-por-fecha', controladorFrontend.eventosPorFecha);


/**
 * @swagger
 * /frontend/empresas-internacionales:
 *   get:
 *     summary: Empresas con presencia internacional (en más de un país)
 *     tags: [Frontend]
 *     responses:
 *       200:
 *         description: Empresas con presencia internacional
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresa'
 */
router.get('/empresas-internacionales', controladorFrontend.empresasInternacionales);

/**
 * @swagger
 * /frontend/top-paises-demanda-tecnologica:
 *   get:
 *     summary: Top países con mayor demanda tecnológica reciente (por productos/servicios creados en los últimos 12 meses)
 *     tags: [Frontend]
 *     responses:
 *       200:
 *         description: Top países con mayor demanda tecnológica
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pais:
 *                     type: string
 *                   total_nuevos_productos:
 *                     type: integer
 */
router.get('/top-paises-demanda-tecnologica', controladorFrontend.topPaisesDemandaTecnologica);


/**
 * @swagger
 * /frontend/productos-por-sector:
 *   get:
 *     summary: Productos/servicios agrupados por sector
 *     tags: [Frontend]
 *     parameters:
 *       - in: query
 *         name: sector
 *         schema:
 *           type: string
 *         required: false
 *         description: "Filtrar por sector específico (Software/IoT/Consultoría u opcional)"
 *     responses:
 *       200:
 *         description: Productos/servicios agrupados por sector
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sector:
 *                     type: string
 *                   productos:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/ProductoServicio'
 */
router.get('/productos-por-sector', controladorFrontend.productosPorSector);


/**
 * @swagger
 * /frontend/ranking-paises-empresas:
 *   get:
 *     summary: Ranking de países por número de empresas tecnológicas
 *     tags: [Frontend]
 *     responses:
 *       200:
 *         description: Ranking de países por empresas tecnológicas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pais:
 *                     type: string
 *                   total_empresas:
 *                     type: integer
 */
router.get('/ranking-paises-empresas', controladorFrontend.rankingPaisesEmpresas);


/**
 * @swagger
 * /frontend/empresas-mayor-crecimiento:
 *   get:
 *     summary: Empresas con mayor crecimiento reciente (por empleados o productos lanzados en el último año)
 *     tags: [Frontend]
 *     responses:
 *       200:
 *         description: Top empresas con mayor crecimiento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresa'
 */
router.get('/empresas-mayor-crecimiento', controladorFrontend.empresasMayorCrecimiento);

/**
 * @swagger
 * /frontend/distribucion-empresas:
 *   get:
 *     summary: Distribución geográfica de empresas (conteo por país)
 *     tags: [Frontend]
 *     responses:
 *       200:
 *         description: Conteo de empresas por país
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo_pais:
 *                     type: string
 *                   total_empresas:
 *                     type: integer
 */
router.get('/distribucion-empresas', controladorFrontend.distribucionEmpresas);

/**
 * @swagger
 * /frontend/comparar-indicadores:
 *   get:
 *     summary: Comparar indicadores económicos de 2 o más países
 *     tags: [Frontend]
 *     parameters:
 *       - in: query
 *         name: paises
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         required: true
 *         description: "Lista de códigos de país separados por coma (ej: HND,CRI,GTM)"
 *     responses:
 *       200:
 *         description: Indicadores económicos comparados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IndicadorEconomico'
 */
router.get('/comparar-indicadores', controladorFrontend.compararIndicadores);


/**
 * @swagger
 * /frontend/indicadores-por-pais:
 *   get:
 *     summary: Indicadores económicos por país
 *     tags: [Frontend]
 *     parameters:
 *       - in: query
 *         name: pais
 *         schema:
 *           type: string
 *         required: true
 *         description: "Código de país (ej: HND)"
 *     responses:
 *       200:
 *         description: Indicadores económicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IndicadorEconomico'
 */
router.get('/indicadores-por-pais', controladorFrontend.indicadoresPorPais);


/**
 * @swagger
 * /frontend/eventos-por-tipo:
 *   get:
 *     summary: Filtrar eventos por tipo (hackeo, inversión, adquisición, etc)
 *     tags: [Frontend]
 *     parameters:
 *       - in: query
 *         name: tipo_evento
 *         schema:
 *           type: string
 *         required: true
 *         description: "Tipo de evento (ej: Hackeo, Inversión, Adquisición, Cierre, Otro)"
 *     responses:
 *       200:
 *         description: Eventos filtrados por tipo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventoSector'
 */
router.get('/eventos-por-tipo', controladorFrontend.eventosPorTipo);

/**
 * @swagger
 * /frontend/empresas-por-tendencia:
 *   get:
 *     summary: Empresas asociadas a una tendencia
 *     tags: [Frontend]
 *     parameters:
 *       - in: query
 *         name: id_tendencia
 *         schema:
 *           type: integer
 *         required: false
 *         description: "ID de la tendencia (opcional)"
 *     responses:
 *       200:
 *         description: Empresas por tendencia
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresa'
 */
router.get('/empresas-por-tendencia', controladorFrontend.empresasPorTendencia);


/**
 * @swagger
 * /frontend/tendencias-emergentes:
 *   get:
 *     summary: Todas las tendencias tecnológicas emergentes
 *     tags: [Frontend]
 *     responses:
 *       200:
 *         description: Lista de tendencias emergentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TendenciaTecnologica'
 */
router.get('/tendencias-emergentes', controladorFrontend.tendenciasEmergentes);

/**
 * @swagger
 * /frontend/productos-mas-demandados:
 *   get:
 *     summary: Top 10 productos o servicios más demandados
 *     tags: [Frontend]
 *     responses:
 *       200:
 *         description: Lista de productos/servicios más demandados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductoServicio'
 */
router.get('/productos-mas-demandados', controladorFrontend.productosMasDemandados);

/**
 * @swagger
 * /frontend/detalle-empresa:
 *   get:
 *     summary: Detalle de empresa con sus productos y eventos
 *     tags: [Frontend]
 *     parameters:
 *       - in: query
 *         name: id_empresa
 *         schema:
 *           type: integer
 *         required: true
 *         description: "ID de la empresa"
 *     responses:
 *       200:
 *         description: Detalle de la empresa, productos y eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 empresa:
 *                   $ref: '#/components/schemas/Empresa'
 *                 productos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductoServicio'
 *                 eventos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EventoSector'
 */
router.get('/detalle-empresa', controladorFrontend.detalleEmpresa);


/**
 * @swagger
 * /frontend/empresas-por-pais-sector:
 *   get:
 *     summary: Filtrar empresas por país y/o sector
 *     tags: [Frontend]
 *     parameters:
 *       - in: query
 *         name: pais
 *         schema:
 *           type: string
 *         required: false
 *         description: "Código de país (ej: HND)"
 *       - in: query
 *         name: sector
 *         schema:
 *           type: string
 *         required: false
 *         description: "Nombre del sector (ej: TI)"
 *     responses:
 *       200:
 *         description: Empresas filtradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresa'
 */
router.get('/empresas-por-pais-sector', controladorFrontend.empresasPorPaisSector);

/**
 * @swagger
 * /frontend/buscar-empresa:
 *   get:
 *     summary: Buscar empresa por nombre, descripción o sector
 *     tags: [Frontend]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: "Palabra clave para buscar en nombre, descripción o sector"
 *     responses:
 *       200:
 *         description: Empresas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresa'
 */
router.get('/buscar-empresa', controladorFrontend.buscarEmpresa);

/**
 * @swagger
 * /frontend/empresas-influyentes:
 *   get:
 *     summary: Top 10 empresas más influyentes (por productos, eventos y empleados)
 *     tags: [Frontend]
 *     responses:
 *       200:
 *         description: Lista de empresas influyentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresa'
 */
router.get('/empresas-influyentes', controladorFrontend.empresasInfluyentes);

module.exports = router;
