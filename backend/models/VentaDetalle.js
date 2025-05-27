// backend/models/VentaDetalle.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Venta = require('./Venta');
const Producto = require('./Producto');

const VentaDetalle = sequelize.define('VentaDetalle', {
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio_unitario: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'venta_detalles',
  timestamps: false,
});

Venta.belongsToMany(Producto, { through: VentaDetalle });
Producto.belongsToMany(Venta, { through: VentaDetalle });

module.exports = VentaDetalle;
