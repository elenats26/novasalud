const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const Producto = require("./models/Producto"); // corregido

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas actualizadas con nombres correctos
app.use("/api/productos", require("./routes/Productos"));
app.use("/api/ventas", require("./routes/ventas"));

const PORT = process.env.PORT || 5000;

// Middleware para manejo global de errores
app.use((err, req, res, next) => {
  console.error("Error inesperado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Sincronizar la base de datos y arrancar servidor
sequelize.sync()
  .then(() => {
    console.log("Base de datos conectada y modelos sincronizados");
    app.listen(PORT, () => { 
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error al conectar con la base de datos:", err);
  });
