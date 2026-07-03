import React, { useEffect, useState } from 'react';

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [todosProductos, setTodosProductos] = useState([]);

  const [formData, setFormData] = useState({
    idMovimiento: '',
    idSucursal: '',
    idCliente: '',
    idProducto: '',
    cantidad: '',
    bultos: '',
    observaciones: '',
    movimiento: 'ingreso',
  });

  const [editandoId, setEditandoId] = useState(null);

  const cargarDatos = () => {
    fetch('http://localhost:3000/movimientos')
      .then(res => res.json())
      .then(data => setMovimientos(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch('http://localhost:3000/clientes')
      .then(res => res.json())
      .then(data => setClientes(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch('http://localhost:3000/sucursales')
      .then(res => res.json())
      .then(data => setSucursales(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch('http://localhost:3000/productos')
      .then(res => res.json())
      .then(data => {
        const productosArray = Array.isArray(data) ? data : [];
        setTodosProductos(productosArray);
      })
      .catch(console.error);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCrear = () => {
    if (!formData.idMovimiento || !formData.idSucursal || !formData.idCliente || !formData.idProducto || !formData.movimiento) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const data = {
      idMovimiento: Number(formData.idMovimiento),
      idSucursal: Number(formData.idSucursal),
      idCliente: Number(formData.idCliente),
      idProducto: Number(formData.idProducto),
      cantidad: formData.cantidad ? Number(formData.cantidad) : null,
      bultos: formData.bultos || null,
      observaciones: formData.observaciones || null,
      movimiento: formData.movimiento,
    };

    fetch('http://localhost:3000/movimientos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error creando movimiento');
        return res.json();
      })
      .then(() => {
        setFormData({
          idMovimiento: '',
          idSucursal: '',
          idCliente: '',
          idProducto: '',
          cantidad: '',
          bultos: '',
          observaciones: '',
          movimiento: 'ingreso'
        });
        cargarDatos();
      })
      .catch(err => alert(err.message));
  };

  const prepararEditar = m => {
    setFormData({
      idMovimiento: m.idMovimiento,
      idSucursal: m.idSucursal.toString(),
      idCliente: m.idCliente.toString(),
      idProducto: m.idProducto.toString(),
      cantidad: m.cantidad ? m.cantidad.toString() : '',
      bultos: m.bultos || '',
      observaciones: m.observaciones || '',
      movimiento: m.movimiento || 'ingreso'
    });
    setEditandoId(m.idMovimiento);
  };

  const handleEditar = () => {
    const data = {
      idSucursal: Number(formData.idSucursal),
      idCliente: Number(formData.idCliente),
      idProducto: Number(formData.idProducto),
      cantidad: formData.cantidad ? Number(formData.cantidad) : null,
      bultos: formData.bultos || null,
      observaciones: formData.observaciones || null,
      movimiento: formData.movimiento
    };

    fetch(`http://localhost:3000/movimientos/${editandoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error actualizando movimiento');
        return res.json();
      })
      .then(() => {
        setEditandoId(null);
        setFormData({
          idMovimiento: '',
          idSucursal: '',
          idCliente: '',
          idProducto: '',
          cantidad: '',
          bultos: '',
          observaciones: '',
          movimiento: 'ingreso'
        });
        cargarDatos();
      })
      .catch(err => alert(err.message));
  };

  const handleEliminar = id => {
    if (window.confirm('¿Seguro quieres eliminar este movimiento?')) {
      fetch(`http://localhost:3000/movimientos/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error('Error eliminando movimiento');
          return res.json();
        })
        .then(() => cargarDatos())
        .catch(err => alert(err.message));
    }
  };

  return (
    <div>
      <h2>Movimientos</h2>

      {/* Primera fila */}
      <div className="form-row">
        <input
          name="idMovimiento"
          placeholder="ID Movimiento"
          value={formData.idMovimiento}
          onChange={handleChange}
          disabled={editandoId !== null}
          className="form-control"
          style={{ maxWidth: '100px' }}
        />
        <select
          name="idSucursal"
          value={formData.idSucursal}
          onChange={handleChange}
          className="form-control"
        >
          <option value="">Selecciona Sucursal</option>
          {sucursales.map(s => (
            <option key={s.idSucursal} value={s.idSucursal}>
              {s.nombreSucursal}
            </option>
          ))}
        </select>
        <select
          name="idCliente"
          value={formData.idCliente}
          onChange={handleChange}
          className="form-control"
        >
          <option value="">Selecciona Cliente</option>
          {clientes.map(c => (
            <option key={c.idCliente} value={c.idCliente}>
              {c.nombreCliente}
            </option>
          ))}
        </select>
      </div>

      {/* Segunda fila */}
      <div className="form-row">
        <select
          name="idProducto"
          value={formData.idProducto}
          onChange={handleChange}
          className="form-control"
        >
          <option value="">Selecciona Producto</option>
          {todosProductos.map(p => (
            <option key={p.idProducto} value={p.idProducto}>
              {p.nombreProducto}
            </option>
          ))}
        </select>
        <input
          name="cantidad"
          placeholder="Cantidad"
          type="number"
          value={formData.cantidad}
          onChange={handleChange}
          className="form-control"
          style={{ maxWidth: '100px' }}
        />
        <select
          name="bultos"
          value={formData.bultos}
          onChange={handleChange}
          className="form-control"
          style={{ maxWidth: '150px' }}
        >
          <option value="">Selecciona Bultos</option>
          <option value="bultos grandes">Bultos Grandes</option>
          <option value="bultos pequeños">Bultos Pequeños</option>
          <option value="pallets">Pallets</option>
          <option value="otros">Otros</option>
        </select>
        <select
          name="movimiento"
          value={formData.movimiento}
          onChange={handleChange}
          className="form-control"
          style={{ maxWidth: '150px' }}
        >
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
      </div>

      {/* Observaciones */}
      <div className="form-row">
        <textarea
          name="observaciones"
          placeholder="Observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          className="form-control"
          style={{ minHeight: '80px', flex: '1 1 100%' }}
        />
      </div>

      {/* Botones */}
      <div className="form-row">
        {editandoId === null ? (
          <button className="btn-primary" onClick={handleCrear}>Crear Movimiento</button>
        ) : (
          <>
            <button className="btn-primary" onClick={handleEditar}>Guardar Cambios</button>
            <button
              className="btn-secondary"
              onClick={() => {
                setEditandoId(null);
                setFormData({
                  idMovimiento: '',
                  idSucursal: '',
                  idCliente: '',
                  idProducto: '',
                  cantidad: '',
                  bultos: '',
                  observaciones: '',
                  movimiento: 'ingreso'
                });
              }}
            >
              Cancelar
            </button>
          </>
        )}
      </div>

      {/* Tabla */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sucursal</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Bultos</th>
            <th>Fecha</th>
            <th>Movimiento</th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map(m => (
            <tr key={m.idMovimiento}>
              <td>{m.idMovimiento}</td>
              <td>{sucursales.find(s => s.idSucursal === m.idSucursal)?.nombreSucursal || m.idSucursal}</td>
              <td>{clientes.find(c => c.idCliente === m.idCliente)?.nombreCliente || m.idCliente}</td>
              <td>{todosProductos.find(p => p.idProducto === m.idProducto)?.nombreProducto || m.idProducto}</td>
              <td>{m.cantidad || '-'}</td>
              <td>{m.bultos || '-'}</td>
              <td>{m.fechaMovimiento ? new Date(m.fechaMovimiento).toLocaleDateString() : '-'}</td>
              <td>{m.movimiento}</td>
              <td>{m.observaciones || '-'}</td>
              <td className="acciones">
                <button className="btn-action" onClick={() => prepararEditar(m)}>Editar</button>
                <button className="btn-action btn-delete" onClick={() => handleEliminar(m.idMovimiento)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Movimientos;
