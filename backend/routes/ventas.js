const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const Producto = require('../models/Producto'); // corregido Item -> Producto
const VentaDetalle = require('../models/VentaDetalle');

router.post("/", async (req, res) => {
  const { cliente, forma_pago, observaciones, carrito } = req.body;

  if (!carrito || carrito.length === 0) {
    return res.status(400).json({ error: "El carrito está vacío." });
  }

  if (!cliente || !forma_pago) {
    return res.status(400).json({ error: "Cliente y forma de pago son obligatorios." });
  }

  try {
    // Calcular el total
    let total = 0;

    // Validar stock y calcular total
    for (const item of carrito) {
      const producto = await Producto.findByPk(item.id);

      if (!producto) {
        return res.status(404).json({ error: `Producto con ID ${item.id} no encontrado` });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para ${producto.nombre}` });
      }

      total += producto.precio * item.cantidad;
    }

    // Crear la venta
    const venta = await Venta.create({
      cliente,
      forma_pago,
      observaciones,
      total
    });

    // Registrar detalles de venta y actualizar stock
    for (const item of carrito) {
      const producto = await Producto.findByPk(item.id);

      // Crear detalle
      await VentaDetalle.create({
        ventaId: venta.id,
        productoId: producto.id,
        cantidad: item.cantidad,
        precio_unitario: producto.precio
      });

      // Actualizar stock
      producto.stock -= item.cantidad;
      await producto.save();
    }

    res.status(201).json({ mensaje: "Venta registrada exitosamente", ventaId: venta.id });
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    res.status(500).json({ error: "Error al procesar la venta." });
  }
});

module.exports = router;
