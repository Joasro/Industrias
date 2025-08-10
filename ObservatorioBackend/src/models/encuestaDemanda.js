const {DataTypes} = require('sequelize');
const db = require('../config/db.js');
const ProductoServicio = require('./productoServicio.js');
const Pais = require('./pais.js');

const EncuestaDemanda = db.define('EncuestaDemanda', {
    id_encuesta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    porcentaje_demanda: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    anio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    /*pais: {
        type: DataTypes.CHAR(3),
        allowNull: false
    },*/
}, {
    tableName: 'encuestas_demanda',
    timestamps: true
});

// Relación con el modelo ProductoServicio
ProductoServicio.hasMany(EncuestaDemanda, { foreignKey: 'id_producto' });
EncuestaDemanda.belongsTo(ProductoServicio, { foreignKey: 'id_producto' });

// Relación con el modelo Pais
//Pais.hasMany(EncuestaDemanda, { foreignKey: 'pais' });
//EncuestaDemanda.belongsTo(Pais, { foreignKey: 'pais' });

// Exportar el modelo
module.exports = EncuestaDemanda;