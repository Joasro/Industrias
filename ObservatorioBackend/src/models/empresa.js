const {DataTypes} = require('sequelize');
const db = require('../config/db.js');
const Pais = require('./pais.js');
const TendenciaTecnologica = require('./tendenciatecnologica.js');

const Empresa = db.define('Empresa', {
    id_empresa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    pais:{
        type: DataTypes.CHAR(3),
        allowNull: false
    },
    sector: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    anio_fundacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    empleados:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    sito_web: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    linkedin: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }, 
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    id_tendencia: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'empresas',
    timestamps: true,
});

// Relación con el modelo Pais
Pais.hasMany(Empresa, { foreignKey: 'pais' });
Empresa.belongsTo(Pais, { foreignKey: 'pais' });

TendenciaTecnologica.hasMany(Empresa, { foreignKey: 'id_tendencia' });
Empresa.belongsTo(TendenciaTecnologica, { foreignKey: 'id_tendencia' });

module.exports = Empresa;