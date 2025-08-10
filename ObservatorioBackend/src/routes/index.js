const express = require('express');
const router = express.Router();

const rutasAuth = require('./rutasAuth');
const rutasRegistroAcceso = require('./rutasRegistroAcceso');
const rutasEmpresa = require('./rutasEmpresa');

const rutasEncuestaDemanda = require('./rutasEncuestaDemanda');
const rutasEventoSector = require('./rutasEventoSector');
const rutasIndicadorEconomico = require('./rutasIndicadorEconomico');
const rutasPais = require('./rutasPais');
const rutasProductoServicio = require('./rutasProductoServicio');
const rutasTendenciaTecnologica = require('./rutasTendenciaTecnologica');
const rutasUsuario = require('./rutasUsuario');
const rutasFrontend = require('./rutasFrontend');

//Montar las rutas con prefijos
router.use('/auth', rutasAuth);
router.use('/registro-acceso', rutasRegistroAcceso);
router.use('/empresa', rutasEmpresa);
router.use('/encuesta-demanda', rutasEncuestaDemanda);
router.use('/evento-sector', rutasEventoSector);
router.use('/indicador-economico', rutasIndicadorEconomico);
router.use('/pais', rutasPais);
router.use('/producto-servicio', rutasProductoServicio);
router.use('/tendencia-tecnologica', rutasTendenciaTecnologica);
router.use('/usuario', rutasUsuario);
router.use('/frontend', rutasFrontend);

// Exportar el router
module.exports = router;