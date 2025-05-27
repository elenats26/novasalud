import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

function Productos() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
    fecha_vencimiento: "",
  });

  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/Items");
      setProductos(res.data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, precio, stock } = formData;

    if (!nombre || precio === "" || stock === "") {
      setError("Nombre, Precio y Stock son campos obligatorios.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/Items/${editingId}`, {
          ...formData,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock),
        });
      } else {
        await axios.post("http://localhost:5000/api/Items", {
          ...formData,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock),
        });
      }

      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
        fecha_vencimiento: "",
      });
      setError("");
      setEditingId(null);
      fetchProductos();
    } catch (err) {
      console.error("Error al registrar/actualizar producto:", err);
      setError("No se pudo registrar o actualizar el producto.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/Items/${id}`);
      fetchProductos();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setError("No se pudo eliminar el producto.");
    }
  };

  const handleEdit = (producto) => {
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      categoria: producto.categoria || "",
      fecha_vencimiento: producto.fecha_vencimiento
        ? new Date(producto.fecha_vencimiento).toISOString().split("T")[0]
        : "",
    });
    setEditingId(producto.id);
    setError("");
  };

  const handleCancelEdit = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      categoria: "",
      fecha_vencimiento: "",
    });
    setEditingId(null);
    setError("");
  };

  return (
    <div className="container my-5" style={{ maxWidth: "1100px" }}>
    
      {error && (
        <div className="alert alert-danger shadow-sm" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4">
        {/* Formulario */}
        <div className="col-md-4">
          <div className="card shadow-sm rounded-4 border-0">
            <div className="card-body p-4">
              <h4 className="card-title mb-4 text-secondary text-center">
                {editingId ? "Editar Producto" : "Registrar Producto"}
              </h4>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label fw-semibold">
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className="form-control"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Paracetamol"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label fw-semibold">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    className="form-control"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Breve descripción"
                    rows={3}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="precio" className="form-label fw-semibold">
                    Precio (S/.) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="precio"
                    className="form-control"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    placeholder="Ej: 15.90"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="stock" className="form-label fw-semibold">
                    Stock <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="stock"
                    className="form-control"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Ej: 50"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="categoria" className="form-label fw-semibold">
                    Categoría
                  </label>
                  <input
                    type="text"
                    id="categoria"
                    className="form-control"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    placeholder="Ej: Analgésicos"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="fecha_vencimiento" className="form-label fw-semibold">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    id="fecha_vencimiento"
                    className="form-control"
                    name="fecha_vencimiento"
                    value={formData.fecha_vencimiento}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className={`btn w-100 ${
                    editingId ? "btn-success" : "btn-primary"
                  } fw-semibold`}
                >
                  {editingId ? "Actualizar Producto" : "Registrar Producto"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100 mt-3"
                    onClick={handleCancelEdit}
                  >
                    Cancelar edición
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Lista */}
        <div className="col-md-8">
          <div className="card shadow-sm rounded-4 border-0">
            <div className="card-body p-4">
              <h4 className="card-title mb-4 text-secondary text-center">
                Lista de Productos
              </h4>

              <div
                className="table-responsive"
                style={{ maxHeight: "650px", overflowY: "auto" }}
              >
                <table className="table table-hover align-middle text-center">
                  <thead className="table-primary sticky-top">
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Categoría</th>
                      <th>Fecha Venc.</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-muted fst-italic">
                          No hay productos registrados.
                        </td>
                      </tr>
                    ) : (
                      productos.map((prod) => (
                        <tr key={prod.id} className="align-middle">
                          <td className="fw-semibold">{prod.nombre}</td>
                          <td>{prod.descripcion || "-"}</td>
                          <td>S/ {prod.precio.toFixed(2)}</td>
                          <td>{prod.stock}</td>
                          <td>{prod.categoria || "-"}</td>
                          <td>
                            {prod.fecha_vencimiento
                              ? new Date(prod.fecha_vencimiento).toLocaleDateString()
                              : "-"}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-warning me-2"
                              onClick={() => handleEdit(prod)}
                              title="Editar producto"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(prod.id)}
                              title="Eliminar producto"
                            >
                              <FaTrashAlt />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Productos;
