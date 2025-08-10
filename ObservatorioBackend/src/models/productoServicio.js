const {DataTypes} = require('sequelize');
const db = require('../config/db.js');
const Empresa = require('./empresa.js');

const ProductoServicio = db.define('ProductoServicio', {
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_empresa: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_lanzamiento: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'productos_servicios',
    timestamps: true
});

// Relación con el modelo Empresa
Empresa.hasMany(ProductoServicio, { foreignKey: 'id_empresa' });
ProductoServicio.belongsTo(Empresa, { foreignKey: 'id_empresa' });

module.exports = ProductoServicio;