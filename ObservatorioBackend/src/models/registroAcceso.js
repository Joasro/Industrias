const {DataTypes, AccessDeniedError} = require('sequelize');
const db = require('../config/db.js');
const Usuario = require('./usuario.js');

const RegistroAcceso = db.define('RegistroAcceso', {
    id_log: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_acceso: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    accion: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'registros_accesos',
    timestamps: true
});

// Relación con el modelo Usuario
Usuario.hasMany(RegistroAcceso, { foreignKey: 'id_usuario' });
RegistroAcceso.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Exportar el modelo
module.exports = RegistroAcceso;