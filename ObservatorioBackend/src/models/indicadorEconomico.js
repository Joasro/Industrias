const {DataTypes} = require('sequelize');
const db = require('../config/db.js');
const Pais = require('./pais.js');

const IndicadorEconomico = db.define('IndicadorEconomico', {
    id_indicador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    anio: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pib:{
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
    },
    inflacion: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    inversion_ti: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
    },
    codigo_pais: {
        type: DataTypes.CHAR(3),
        allowNull: false,
    }
}, {
    tableName: 'indicadores_economicos',
    timestamps: true,
});

// Relación con el modelo Pais
Pais.hasMany(IndicadorEconomico, { foreignKey: 'codigo_pais' });
IndicadorEconomico.belongsTo(Pais, { foreignKey: 'codigo_pais' });

// Exportar el modelo
module.exports = IndicadorEconomico;