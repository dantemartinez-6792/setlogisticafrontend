import React, { useEffect, useState } from 'react';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Sucursales() {
  const [sucursales, setSucursales] = useState([]);
  const [formData, setFormData] = useState({
    idSucursal: '',
    nombreSucursal: '',
    direccion: '',
    telefono: ''
  });
  const [editandoId, setEditandoId] = useState(null);

  const cargarSucursales = () => {
    fetch(`${backendUrl}/sucursales`)
      .then(res => res.json())
      .then(data => setSucursales(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    cargarSucursales();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const prepararEditar = (sucursal) => {
    setFormData(sucursal);
    setEditandoId(sucursal.idSucursal);
  };

  const handleCrear = () => {
    if (!formData.nombreSucursal) {
      alert('Completa el nombre de la sucursal');
      return;
    }

    const data = {
      nombreSucursal: formData.nombreSucursal,
      direccion: formData.direccion || null,
      telefono: formData.telefono || null
    };

    fetch(`${backendUrl}/sucursales`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => {
      if (!res.ok) throw new Error('Error creando sucursal');
      return res.json();
    })
    .then(() => {
      setFormData({idSucursal: '', nombreSucursal: '', direccion: '', telefono: ''});
      cargarSucursales();
    })
    .catch(err => alert(err.message));
  };

  const handleEditar = () => {
    const data = {
      nombreSucursal: formData.nombreSucursal,
      direccion: formData.direccion || null,
      telefono: formData.telefono || null
    };

    fetch(`${backendUrl}/sucursales/${editandoId}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => {
      if (!res.ok) throw new Error('Error actualizando sucursal');
      return res.json();
    })
    .then(() => {
      setEditandoId(null);
      setFormData({idSucursal: '', nombreSucursal: '', direccion: '', telefono: ''});
      cargarSucursales();
    })
    .catch(err => alert(err.message));
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Seguro quieres eliminar esta sucursal?')) {
      fetch(`${backendUrl}/sucursales/${id}`, {method: 'DELETE'})
      .then(res => {
        if (!res.ok) throw new Error('Error eliminando sucursal');
        return res.json();
      })
      .then(() => cargarSucursales())
      .catch(err => alert(err.message));
    }
  };

  return (
    <div>
      <h2>Sucursales</h2>

      <div className="form-row">
        <input
          name="nombreSucursal"
          placeholder="Nombre Sucursal"
          value={formData.nombreSucursal}
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
      </div>

      <div>
        {editandoId === null ? (
          <button onClick={handleCrear}>Crear Sucursal</button>
        ) : (
          <>
            <button onClick={handleEditar}>Guardar Cambios</button>
            <button
              onClick={() => {
                setEditandoId(null);
                setFormData({idSucursal: '', nombreSucursal: '', direccion: '', telefono: ''});
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
            <th>ID Sucursal</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sucursales.map(s => (
            <tr key={s.idSucursal}>
              <td>{s.idSucursal}</td>
              <td>{s.nombreSucursal}</td>
              <td>{s.direccion || '-'}</td>
              <td>{s.telefono || '-'}</td>
              <td className="acciones">
                <button className="btn-action" onClick={() => prepararEditar(s)}>Editar</button>
                <button className="btn-action btn-delete" onClick={() => handleEliminar(s.idSucursal)}>Eliminar</button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Sucursales;
