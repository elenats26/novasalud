import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPlus, FaTrashAlt, FaCartPlus } from "react-icons/fa";


function Ventas() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/Items");
      setProductos(res.data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) {
      if (existe.cantidad < producto.stock) {
        const nuevoCarrito = carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
        setCarrito(nuevoCarrito);
      } else {
        alert("No hay más stock disponible.");
      }
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarDelCarrito = (id) => {
    const nuevoCarrito = carrito
      .map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
      )
      .filter((item) => item.cantidad > 0);
    setCarrito(nuevoCarrito);
  };

  const calcularTotal = () => {
    const suma = carrito.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    setTotal(suma.toFixed(2));
  };

  useEffect(() => {
    calcularTotal();
  }, [carrito]);

  const finalizarVenta = async () => {
    if (carrito.length === 0) {
      setError("No hay productos en el carrito.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/ventas", { carrito });
      setError("");
      setCarrito([]);
      fetchProductos(); // Actualizar lista con nuevo stock
      alert("¡Venta registrada con éxito!");
    } catch (err) {
      console.error("Error al registrar venta:", err);
      setError("No se pudo completar la venta.");
    }
  };

  return (
    <div className="container mt-5">
    

      <div className="d-flex justify-content-end mb-3">
        <Link to="/productos" className="btn btn-outline-primary fw-semibold">
          + Nuevo Producto
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger text-center" style={{ fontWeight: "600" }}>
          {error}
        </div>
      )}

      <div className="row">
        {/* Productos disponibles */}
        <div className="col-md-7 mb-4">
          <div className="card shadow-sm border-success h-100">
            <div className="card-header bg-success text-white fw-bold fs-5">
              Productos Disponibles
            </div>
            <div
              className="card-body p-0"
              style={{ maxHeight: "420px", overflowY: "auto" }}
            >
              <table className="table table-hover mb-0">
                <thead className="table-success sticky-top">
                  <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th className="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">
                        No hay productos disponibles.
                      </td>
                    </tr>
                  ) : (
                    productos.map((prod) => (
                      <tr key={prod.id}>
                        <td>{prod.nombre}</td>
                        <td>S/ {prod.precio.toFixed(2)}</td>
                        <td>
                          {prod.stock > 0 ? (
                            <span className="badge bg-success">{prod.stock}</span>
                          ) : (
                            <span className="badge bg-danger">Agotado</span>
                          )}
                        </td>
                        <td className="text-center">
                       <button
  className="btn btn-sm btn-success"
  onClick={() => agregarAlCarrito(prod)}
  disabled={prod.stock === 0}
>
  <FaCartPlus style={{ marginRight: '5px' }} /> Agregar
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

        {/* Carrito */}
        <div className="col-md-5">
          <div className="card shadow-sm border-primary h-100">
            <div className="card-header bg-primary text-white fw-bold fs-5">
              Carrito de Compras
            </div>
            <div className="card-body d-flex flex-column">
              {carrito.length === 0 ? (
                <p className="text-muted text-center my-4" style={{ fontStyle: "italic" }}>
                  No hay productos en el carrito.
                </p>
              ) : (
                <table className="table table-sm mb-3">
                  <thead className="table-secondary">
                    <tr>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item) => (
                      <tr key={item.id}>
                        <td>{item.nombre}</td>
                        <td>{item.cantidad}</td>
                        <td>S/ {(item.precio * item.cantidad).toFixed(2)}</td>
                        <td>
                          <button
  className="btn btn-sm btn-outline-danger"
  onClick={() => quitarDelCarrito(item.id)}
  title="Quitar un producto"
  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
>
  <FaTrashAlt />
</button>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="mt-auto">
                <h4 className="fw-bold">
                  Total: <span className="text-success">S/ {total}</span>
                </h4>
                <button
                  className="btn btn-success w-100 mt-3 fw-semibold"
                  onClick={finalizarVenta}
                  disabled={carrito.length === 0}
                >
                  Finalizar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ventas;
