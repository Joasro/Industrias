const Empresa = require('../models/empresa');
const IndicadorEconomico = require('../models/indicadorEconomico');
const TendenciaTecnologica = require('../models/tendenciatecnologica');
const ProductoServicio = require('../models/productoServicio');
const EventoSector = require('../models/eventoSector');

exports.comparativaPaises = async (req, res) => {
    // Comparativa general entre países de la región
    const { paises } = req.query;
    let listaPaises = [];
    if (paises) {
        listaPaises = Array.isArray(paises) ? paises : paises.split(',').map(p => p.trim()).filter(Boolean);
    }
    try {
        // Empresas por país
        const whereEmp = listaPaises.length ? { pais: listaPaises } : {};
        const empresas = await Empresa.findAll({
            where: whereEmp,
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        // Productos por país (vía empresa)
        const productos = await ProductoServicio.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [{ model: Empresa, attributes: ['id_empresa', 'pais'] }]
        });

        // Indicadores económicos por país
        const whereInd = listaPaises.length ? { codigo_pais: listaPaises } : {};
        const indicadores = await IndicadorEconomico.findAll({ where: whereInd });

        // Agrupar y armar comparativa
        const paisesSet = listaPaises.length
            ? listaPaises
            : Array.from(new Set([
                ...empresas.map(e => e.pais),
                ...productos.map(p => p.Empresa?.pais).filter(Boolean),
                ...indicadores.map(i => i.codigo_pais)
            ]));

        const resultado = paisesSet.map(pais => {
            const empresasPais = empresas.filter(e => e.pais === pais);
            const productosPais = productos.filter(p => p.Empresa && p.Empresa.pais === pais);
            return {
                pais,
                total_empresas: empresasPais.length,
                total_productos: productosPais.length,
                empresas: empresasPais,
                productos: productosPais,
                indicadores: indicadores.filter(i => i.codigo_pais === pais)
            };
        });
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener comparativa de países', detalle: error.message });
    }
};
exports.eventosPorFecha = async (req, res) => {
    // Filtrar eventos por rango de fechas
    const { fecha_inicio, fecha_fin } = req.query;
    if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({ error: 'Debe enviar fecha_inicio y fecha_fin en formato YYYY-MM-DD' });
    }
    try {
        const { Op } = require('sequelize');
        const eventos = await EventoSector.findAll({
            where: {
                fecha: {
                    [Op.gte]: fecha_inicio,
                    [Op.lte]: fecha_fin
                }
            }
        });
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ error: 'Error al filtrar eventos por fecha', detalle: error.message });
    }
};

exports.empresasInternacionales = async (req, res) => {
    // Empresas con presencia internacional (en más de un país)
    try {
        const { Op, fn, col, literal } = require('sequelize');
        // Agrupar por nombre y obtener todos los países asociados
        const empresas = await Empresa.findAll({
            attributes: [
                'nombre',
                [fn('COUNT', fn('DISTINCT', col('pais'))), 'total_paises'],
                [fn('ARRAY_AGG', fn('DISTINCT', col('pais'))), 'paises'],
                [fn('MIN', col('id_empresa')), 'id_empresa']
            ],
            group: ['nombre'],
            having: literal('COUNT(DISTINCT pais) > 1')
        });
        // Traer detalles de la empresa usando el id_empresa mínimo de cada grupo
        const ids = empresas.map(e => e.get('id_empresa'));
        const detalles = await Empresa.findAll({ where: { id_empresa: ids } });
        // Unir detalles y países
        const resultado = empresas.map(e => {
            const detalle = detalles.find(d => d.id_empresa === e.get('id_empresa'));
            return {
                ...detalle?.toJSON(),
                nombre: e.get('nombre'),
                paises: e.get('paises')
            };
        });
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener empresas internacionales', detalle: error.message });
    }
};


exports.topPaisesDemandaTecnologica = async (req, res) => {
    // Top países con mayor demanda tecnológica reciente (por productos/servicios creados en los últimos 12 meses)
    try {
        const ahora = new Date();
        const hace12Meses = new Date(ahora);
        hace12Meses.setMonth(ahora.getMonth() - 12);
        const { Op } = require('sequelize');

        // Traer productos creados en los últimos 12 meses junto con la empresa y país
        const productos = await ProductoServicio.findAll({
            where: {
                createdAt: {
                    [Op.gte]: hace12Meses
                }
            },
            include: [{ model: Empresa, attributes: ['pais'] }]
        });

        // Agrupar por país
        const conteoPorPais = {};
        productos.forEach(p => {
            const pais = p.Empresa ? p.Empresa.pais : 'Sin país';
            conteoPorPais[pais] = (conteoPorPais[pais] || 0) + 1;
        });

        // Formatear y ordenar resultado
        const resultado = Object.entries(conteoPorPais)
            .map(([pais, total_nuevos_productos]) => ({ pais, total_nuevos_productos }))
            .sort((a, b) => b.total_nuevos_productos - a.total_nuevos_productos)
            .slice(0, 10);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener top países con mayor demanda tecnológica', detalle: error.message });
    }
};

exports.productosPorSector = async (req, res) => {
    // Productos/servicios agrupados por sector
    const { sector } = req.query;
    try {
        // Traer todos los productos y empresas asociadas
        const productos = await ProductoServicio.findAll({
            include: [{ model: Empresa, attributes: ['sector'] }]
        });

        // Agrupar productos por sector
        const agrupados = {};
        productos.forEach(p => {
            const sectorEmpresa = p.Empresa ? p.Empresa.sector : 'Sin sector';
            if (sector && sectorEmpresa !== sector) return;
            if (!agrupados[sectorEmpresa]) agrupados[sectorEmpresa] = [];
            agrupados[sectorEmpresa].push(p);
        });

        // Formatear respuesta
        const resultado = Object.entries(agrupados).map(([sector, productos]) => ({ sector, productos }));
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos por sector', detalle: error.message });
    }
};


exports.rankingPaisesEmpresas = async (req, res) => {
    // Ranking de países por número de empresas tecnológicas
    try {
        const datos = await Empresa.findAll({
            attributes: [
                'pais',
                [Empresa.sequelize.fn('COUNT', Empresa.sequelize.col('id_empresa')), 'total_empresas']
            ],
            group: ['pais'],
            order: [[Empresa.sequelize.literal('total_empresas'), 'DESC']]
        });
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener ranking de países', detalle: error.message });
    }
};

exports.empresasMayorCrecimiento = async (req, res) => {
    // Empresas con mayor crecimiento reciente (por empleados o productos lanzados en el último año)
    try {

        // Calcular fecha hace 12 meses
        const ahora = new Date();
        const hace12Meses = new Date(ahora);
        hace12Meses.setMonth(ahora.getMonth() - 12);

        // Contar productos lanzados en los últimos 12 meses por empresa
        const { Op } = require('sequelize');
        const productosPorEmpresa = await ProductoServicio.findAll({
            attributes: [
                'id_empresa',
                [ProductoServicio.sequelize.fn('COUNT', ProductoServicio.sequelize.col('id_producto')), 'nuevos_productos']
            ],
            where: {
                createdAt: {
                    [Op.gte]: hace12Meses
                }
            },
            group: ['id_empresa']
        });

        // Mapear resultados a objeto { id_empresa: nuevos_productos }
        const productosMap = {};
        productosPorEmpresa.forEach(p => {
            productosMap[p.id_empresa] = parseInt(p.get('nuevos_productos'));
        });

        // Traer todas las empresas
        const empresas = await Empresa.findAll();

        // Calcular score de crecimiento: nuevos empleados + nuevos productos
        const empresasCrecimiento = empresas.map(e => {
            // Suponiendo que el modelo Empresa tiene un campo empleados y empleados_anio_anterior
            const nuevosEmpleados = (e.empleados || 0) - (e.empleados_anio_anterior || 0);
            const nuevosProductos = productosMap[e.id_empresa] || 0;
            return {
                ...e.toJSON(),
                nuevosEmpleados,
                nuevosProductos,
                scoreCrecimiento: nuevosEmpleados + nuevosProductos
            };
        });

        // Ordenar por score de crecimiento descendente y devolver top 10
        empresasCrecimiento.sort((a, b) => b.scoreCrecimiento - a.scoreCrecimiento);
        res.json(empresasCrecimiento.slice(0, 10));
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener empresas con mayor crecimiento', detalle: error.message });
    }
};

exports.distribucionEmpresas = async (req, res) => {
    // Distribución geográfica de empresas (conteo por país)
    try {
        const datos = await Empresa.findAll({
            attributes: [
                'pais',
                [Empresa.sequelize.fn('COUNT', Empresa.sequelize.col('id_empresa')), 'total_empresas']
            ],
            group: ['pais']
        });
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener distribución de empresas', detalle: error.message });
    }
};
exports.compararIndicadores = async (req, res) => {
    // Comparar indicadores económicos de 2 o más países
    const { paises } = req.query;
    if (!paises) return res.status(400).json({ error: 'Debe enviar el parámetro paises (ej: HND,ARG,CHL)' });
    // Permitir tanto array como string separado por comas
    let codigos = Array.isArray(paises) ? paises : paises.split(',').map(p => p.trim()).filter(Boolean);
    if (codigos.length < 2) return res.status(400).json({ error: 'Debe enviar al menos dos países para comparar' });
    try {
        const indicadores = await IndicadorEconomico.findAll({ where: { codigo_pais: codigos } });
        res.json(indicadores);
    } catch (error) {
        res.status(500).json({ error: 'Error al comparar indicadores', detalle: error.message });
    }
};
exports.indicadoresPorPais = async (req, res) => {
    // Indicadores económicos por país
    const { pais } = req.query;
    if (!pais) return res.status(400).json({ error: 'Debe enviar pais' });
    try {
        const indicadores = await IndicadorEconomico.findAll({ where: { codigo_pais: pais } });
        res.json(indicadores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener indicadores', detalle: error.message });
    }
};
exports.eventosPorTipo = async (req, res) => {
    // Filtrar eventos por tipo
    const { tipo_evento } = req.query;
    if (!tipo_evento) return res.status(400).json({ error: 'Debe enviar tipo_evento' });
    try {
        const eventos = await EventoSector.findAll({ where: { tipo_evento } });
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ error: 'Error al filtrar eventos', detalle: error.message });
    }
};
exports.empresasPorTendencia = async (req, res) => {
    // Empresas asociadas a una tendencia
    const { id_tendencia } = req.query;
    let where = {};
    if (id_tendencia) where.id_tendencia = id_tendencia;
    try {
        const empresas = await Empresa.findAll({ where });
        res.json(empresas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener empresas por tendencia', detalle: error.message });
    }
};
exports.tendenciasEmergentes = async (req, res) => {
    // Todas las tendencias tecnológicas emergentes
    try {
        const tendencias = await TendenciaTecnologica.findAll();
        res.json(tendencias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tendencias', detalle: error.message });
    }
};
exports.productosMasDemandados = async (req, res) => {
    // Productos/servicios más demandados (top 10 por cantidad de eventos asociados)
    try {
        const productos = await ProductoServicio.findAll({
            attributes: {
                include: [
                    [
                        ProductoServicio.sequelize.literal(`(
                            SELECT COUNT(*) FROM eventos_sectores WHERE eventos_sectores.empresa_relacionada = id_empresa
                        )`),
                        'total_eventos'
                    ]
                ]
            },
            order: [[ProductoServicio.sequelize.literal('total_eventos'), 'DESC']],
            limit: 10
        });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos más demandados', detalle: error.message });
    }
};

exports.detalleEmpresa = async (req, res) => {
    // Detalle de empresa, productos y eventos
    const { id_empresa } = req.query;
    if (!id_empresa) return res.status(400).json({ error: 'Debe enviar id_empresa' });
    try {
        const empresa = await Empresa.findByPk(id_empresa);
        if (!empresa) return res.status(404).json({ error: 'Empresa no encontrada' });
        const productos = await ProductoServicio.findAll({ where: { id_empresa } });
        const eventos = await EventoSector.findAll({ where: { empresa_relacionada: id_empresa } });
        res.json({ empresa, productos, eventos });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener detalle de empresa', detalle: error.message });
    }
};
exports.empresasPorPaisSector = async (req, res) => {
    // Filtrar por país o sector
    const { pais, sector } = req.query;
    let where = {};
    if (pais) where.pais = pais;
    if (sector) where.sector = sector;
    try {
        const empresas = await Empresa.findAll({ where });
        res.json(empresas);
    } catch (error) {
        res.status(500).json({ error: 'Error al filtrar empresas', detalle: error.message });
    }
};

exports.buscarEmpresa = async (req, res) => {
    // Buscar por nombre o palabra clave
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Debe enviar un parámetro de búsqueda' });
    try {
        const empresas = await Empresa.findAll({
            where: {
                [Op.or]: [
                    { nombre: { [Op.iLike]: `%${q}%` } },
                    { descripcion: { [Op.iLike]: `%${q}%` } },
                    { sector: { [Op.iLike]: `%${q}%` } }
                ]
            }
        });
        res.json(empresas);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar empresas', detalle: error.message });
    }
};

exports.empresasInfluyentes = async (req, res) => {
    // Empresas con más productos, eventos o empleados (top 10)
    try {
        const empresas = await Empresa.findAll({
            attributes: {
                include: [
                    [
                        Empresa.sequelize.literal(`(
                            SELECT COUNT(*) FROM productos_servicios WHERE productos_servicios.id_empresa = id_empresa
                        )`),
                        'total_productos'
                    ],
                    [
                        Empresa.sequelize.literal(`(
                            SELECT COUNT(*) FROM eventos_sectores WHERE eventos_sectores.empresa_relacionada = id_empresa
                        )`),
                        'total_eventos'
                    ]
                ]
            },
            order: [
                [Empresa.sequelize.literal(`(
                    SELECT COUNT(*) FROM productos_servicios WHERE productos_servicios.id_empresa = id_empresa
                ) + (
                    SELECT COUNT(*) FROM eventos_sectores WHERE eventos_sectores.empresa_relacionada = id_empresa
                ) + COALESCE(empleados,0)`), 'DESC']
            ],
            limit: 10
        });
        res.json(empresas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener empresas influyentes', detalle: error.message });
    }
};
