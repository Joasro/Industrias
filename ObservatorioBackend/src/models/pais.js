const {DataTypes} = require('sequelize');
const db = require('../config/db.js');
const Empresa = require('./empresa.js');

const Pais = db.define('Pais', {
    codigo_pais: {
        type: DataTypes.CHAR(3),
        allowNull: false,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    pbi_tech:{
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
    },
    num_empresas_software: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    exportaciones_ti: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
    },
},{
    tableName: 'paises',
    timestamps: true
});

module.exports = Pais;