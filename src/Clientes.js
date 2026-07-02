import React, { useEffect, useState } from 'react';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    idCliente: '',
    nombreCliente: '',
    direccion: '',
    telefono: '',
    email: ''
  });
  const [editandoId, setEditandoId] = useState(null);

  const cargarClientes = () => {
    fetch(`${backendUrl}/clientes`)
      .then(res => res.json())
      .then(data => setClientes(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const prepararEditar = (cliente) => {
    setFormData(cliente);
    setEditandoId(cliente.idCliente);
  };

  const handleCrear = () => {
    if (!formData.idCliente || !formData.nombreCliente) {
      alert('Completa ID Cliente y Nombre Cliente');
      return;
    }

    fetch(`${backendUrl}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error creando cliente');
        return res.json();
      })
      .then(() => {
        setFormData({ idCliente: '', nombreCliente: '', direccion: '', telefono: '', email: '' });
        cargarClientes();
      })
      .catch(err => alert(err.message));
  };

  const handleEditar = () => {
    fetch(`${backendUrl}/clientes/${editandoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombreCliente: formData.nombreCliente,
        direccion: formData.direccion,
        telefono: formData.telefono,
        email: formData.email
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error actualizando cliente');
        return res.json();
      })
      .then(() => {
        setEditandoId(null);
        setFormData({ idCliente: '', nombreCliente: '', direccion: '', telefono: '', email: '' });
        cargarClientes();
      })
      .catch(err => alert(err.message));
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Seguro quieres eliminar este cliente?')) {
      fetch(`${backendUrl}/clientes/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error('Error eliminando cliente');
          return res.json();
        })
        .then(() => cargarClientes())
        .catch(err => alert(err.message));
    }
  };

  return (
    <div>
      <h2>Clientes</h2>

      <div className="form-row">
        <input
          name="idCliente"
          placeholder="ID Cliente"
          value={formData.idCliente}
          onChange={handleChange}
          disabled={editandoId !== null}
        />
        <input
          name="nombreCliente"
          placeholder="Nombre Cliente"
          value={formData.nombreCliente}
          onChange={handleChange}
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        {editandoId === null ? (
          <button onClick={handleCrear}>Crear Cliente</button>
        ) : (
          <>
            <button onClick={handleEditar}>Guardar Cambios</button>
            <button
              onClick={() => {
                setEditandoId(null);
                setFormData({ idCliente: '', nombreCliente: '', direccion: '', telefono: '', email: '' });
              }}
            >
              Cancelar
            </button>
          </>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>ID Cliente</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.idCliente}>
              <td>{c.idCliente}</td>
              <td>{c.nombreCliente}</td>
              <td>{c.direccion || '-'}</td>
              <td>{c.telefono || '-'}</td>
              <td>{c.email || '-'}</td>
              <td className="acciones">
                <button className="btn-action" onClick={() => prepararEditar(c)}>Editar</button>
                <button className="btn-action btn-delete" onClick={() => handleEliminar(c.idCliente)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;
