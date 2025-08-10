const {DataTypes} = require('sequelize');
const db = require('../config/db.js');

const Usuario = db.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM('admin', 'analista', 'lector'),
        allowNull: false,
    }
}, {
    tableName: 'usuarios',
    timestamps: true,
});

// Exportar el modelo
module.exports = Usuario;