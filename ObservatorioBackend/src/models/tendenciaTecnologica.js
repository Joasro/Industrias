const {DataTypes} = require('sequelize');
const db = require('../config/db.js');

const TendenciaTecnologica = db.define('TendenciaTecnologica', {
    id_tendencia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    relevancia_region: {
        type: DataTypes.ENUM('Alta', 'Media', 'Baja'),
        allowNull: false,
    },
}, {
    tableName: 'tendencias_tecnologicas',
    timestamps: true
});


// Exportar el modelo
module.exports = TendenciaTecnologica;