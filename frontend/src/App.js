import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Ajusta según puerto backend

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState('');
  const [formaPago, setFormaPago] = useState('Efectivo');
  const [mensaje, setMensaje] = useState('');

  // Cargar productos desde API
  useEffect(() => {
    axios.get(`${API_URL}/productos`)
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  }, []);

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    const itemExistente = carrito.find(item => item.id === producto.id);
    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // Quitar producto del carrito
  const quitarDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item.id !== productoId));
  };

  // Cambiar cantidad en carrito
  const cambiarCantidad = (productoId, cantidad) => {
    if (cantidad < 1) return;
    setCarrito(carrito.map(item =>
      item.id === productoId ? { ...item, cantidad } : item
    ));
  };

  // Enviar venta al backend
  const realizarVenta = () => {
    if (!cliente) {
      setMensaje('Por favor ingresa el nombre del cliente');
      return;
    }
    if (carrito.length === 0) {
      setMensaje('El carrito está vacío');
      return;
    }

    const carritoSimplificado = carrito.map(({ id, cantidad, precio }) => ({
      id,
      cantidad,
      precio,
    }));

    axios.post(`${API_URL}/ventas`, {
      cliente,
      forma_pago: formaPago,
      observaciones: '',
      carrito: carritoSimplificado,
    })
      .then(res => {
        setMensaje('Venta realizada con éxito! ID: ' + res.data.ventaId);
        setCarrito([]);
        setCliente('');
      })
      .catch(err => {
        setMensaje('Error al realizar la venta: ' + err.response?.data?.error || err.message);
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Nova Salud - Botica</h1>

      <div>
        <h2>Productos</h2>
        <ul>
          {productos.map(prod => (
            <li key={prod.id}>
              {prod.nombre} - S/. {prod.precio.toFixed(2)} - Stock: {prod.stock}
              <button onClick={() => agregarAlCarrito(prod)} disabled={prod.stock === 0}>Agregar</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Carrito</h2>
        {carrito.length === 0 && <p>Carrito vacío</p>}
        {carrito.length > 0 && (
          <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map(item => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.cantidad}
                      onChange={e => cambiarCantidad(item.id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>S/. {item.precio.toFixed(2)}</td>
                  <td>S/. {(item.precio * item.cantidad).toFixed(2)}</td>
                  <td>
                    <button onClick={() => quitarDelCarrito(item.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div>
          <h3>Datos de la venta</h3>
          <label>
            Cliente:
            <input
              type="text"
              value={cliente}
              onChange={e => setCliente(e.target.value)}
            />
          </label>
          <br />
          <label>
            Forma de pago:
            <select value={formaPago} onChange={e => setFormaPago(e.target.value)}>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </label>
          <br />
          <button onClick={realizarVenta}>Realizar Venta</button>
        </div>
      </div>

      {mensaje && <p><strong>{mensaje}</strong></p>}
    </div>
  );
}

export default App;
