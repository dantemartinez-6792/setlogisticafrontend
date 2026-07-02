import React, { useEffect, useState } from 'react';
import './App.css'; // asumiendo aquí están los estilos

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Productos() {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [formData, setFormData] = useState({
    idProducto: '',
    nombreProducto: '',
    descripcion: '',
    idCliente: ''
  });

  const [editandoId, setEditandoId] = useState(null);

  const cargarDatos = () => {
    fetch(`${backendUrl}/productos`)
      .then(res => res.json())
      .then(data => setProductos(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch(`${backendUrl}/clientes`)
      .then(res => res.json())
      .then(data => setClientes(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const prepararEditar = (producto) => {
    setFormData(producto);
    setEditandoId(producto.idProducto);
  };

  const handleCrear = () => {
    if (!formData.nombreProducto || !formData.idCliente) {
      alert('Completa nombre y selecciona cliente');
      return;
    }

    const data = {
      nombreProducto: formData.nombreProducto,
      descripcion: formData.descripcion || null,
      idCliente: Number(formData.idCliente)
    };

    fetch(`${backendUrl}/productos`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => {
      if (!res.ok) throw new Error('Error creando producto');
      return res.json();
    })
    .then(() => {
      setFormData({idProducto: '', nombreProducto: '', descripcion: '', idCliente: ''});
      cargarDatos();
    })
    .catch(err => alert(err.message));
  };

  const handleEditar = () => {
    const data = {
      nombreProducto: formData.nombreProducto,
      descripcion: formData.descripcion || null,
      idCliente: Number(formData.idCliente)
    };

    fetch(`${backendUrl}/productos/${editandoId}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => {
      if (!res.ok) throw new Error('Error actualizando producto');
      return res.json();
    })
    .then(() => {
      setEditandoId(null);
      setFormData({idProducto: '', nombreProducto: '', descripcion: '', idCliente: ''});
      cargarDatos();
    })
    .catch(err => alert(err.message));
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Seguro quieres eliminar este producto?')) {
      fetch(`${backendUrl}/productos/${id}`, {method: 'DELETE'})
      .then(res => {
        if (!res.ok) throw new Error('Error eliminando producto');
        return res.json();
      })
      .then(() => cargarDatos())
      .catch(err => alert(err.message));
    }
  };

  return (
    <div>
      <h2>Productos</h2>

      <div className="form-row">
        <input
          className="form-control"
          name="nombreProducto"
          placeholder="Nombre Producto"
          value={formData.nombreProducto}
          onChange={handleChange}
        />
        <textarea
          className="form-control textarea-control"
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
        />
        <select
          className="form-control"
          name="idCliente"
          value={formData.idCliente}
          onChange={handleChange}
        >
          <option value="">Selecciona Cliente</option>
          {clientes.map(c => (
            <option key={c.idCliente} value={c.idCliente}>
              {c.nombreCliente}
            </option>
          ))}
        </select>
      </div>

      <div>
        {editandoId === null ? (
          <button className="btn-primary" onClick={handleCrear}>Crear Producto</button>
        ) : (
          <>
            <button className="btn-primary" onClick={handleEditar}>Guardar Cambios</button>
            <button className="btn-secondary" onClick={() => {
              setEditandoId(null);
              setFormData({idProducto: '', nombreProducto: '', descripcion: '', idCliente: ''});
            }}>Cancelar</button>
          </>
        )}
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>ID Producto</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Cliente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.idProducto}>
              <td>{p.idProducto}</td>
              <td>{p.nombreProducto}</td>
              <td>{p.descripcion || '-'}</td>
              <td>{clientes.find(c => c.idCliente === p.idCliente)?.nombreCliente || p.idCliente}</td>
              <td className="acciones">
                <button className="btn-action" onClick={() => prepararEditar(p)}>Editar</button>
                <button className="btn-action btn-delete" onClick={() => handleEliminar(p.idProducto)}>Eliminar</button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Productos;
