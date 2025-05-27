const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto"); // Cambié Item por Producto

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Agregar producto
router.post("/", async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);

    const { nombre, precio, stock, fecha_vencimiento } = req.body;
    if (!nombre || precio === undefined || stock === undefined || !fecha_vencimiento) {
      return res.status(400).json({ error: "Nombre, precio, stock y fecha de vencimiento son obligatorios" });
    }

    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(400).json({ error: "Error al crear producto" });
  }
});

// Editar producto (por id)
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await producto.update(req.body);
    res.json(producto);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(400).json({ error: "Error al actualizar producto" });
  }
});

// Eliminar producto (por id)
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await producto.destroy();
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(400).json({ error: "Error al eliminar producto" });
  }
});

module.exports = router;
