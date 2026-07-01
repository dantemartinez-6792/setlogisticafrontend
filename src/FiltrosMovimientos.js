import React, { useState, useEffect } from 'react';

function InformeMovimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    idCliente: '',
    idProducto: '',
    idSucursal: '',
    movimiento: ''
  });

  const cargarFiltros = () => {
    // Cargar combos de filtros
    fetch('http://localhost:3000/clientes')
      .then(res => res.json())
      .then(data => setClientes(Array.isArray(data) ? data : []))
      .catch(console.error);
    fetch('http://localhost:3000/productos')
      .then(res => res.json())
      .then(data => setProductos(Array.isArray(data) ? data : []))
      .catch(console.error);
    fetch('http://localhost:3000/sucursales')
      .then(res => res.json())
      .then(data => setSucursales(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    cargarFiltros();
  }, []);

  // Obtener movimientos con filtros
  const buscar = () => {
    const query = new URLSearchParams();

    Object.entries(filtros).forEach(([k, v]) => {
      if (v) query.append(k, v);
    });

    fetch(`http://localhost:3000/movimientos/filtrar?${query.toString()}`)
      .then(res => res.json())
      .then(data => setMovimientos(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  const handleChange = (e) => {
    setFiltros({...filtros, [e.target.name]: e.target.value});
  };

  return (
    <div>
      <h2>Informe de Movimientos</h2>

      <div className="form-row">
        <input
          type="date"
          name="fechaInicio"
          value={filtros.fechaInicio}
          onChange={handleChange}
          className="form-control"
        />
        <input
          type="date"
          name="fechaFin"
          value={filtros.fechaFin}
          onChange={handleChange}
          className="form-control"
        />
        <select
          name="idSucursal"
          value={filtros.idSucursal}
          onChange={handleChange}
          className="form-control"
        >
          <option value="">Sucursal</option>
          {sucursales.map(s => (
            <option key={s.idSucursal} value={s.idSucursal}>{s.nombreSucursal}</option>
          ))}
        </select>
        <select
          name="idCliente"
          value={filtros.idCliente}
          onChange={handleChange}
          className="form-control"
        >
          <option value="">Cliente</option>
          {clientes.map(c => (
            <option key={c.idCliente} value={c.idCliente}>{c.nombreCliente}</option>
          ))}
        </select>
        <select
          name="idProducto"
          value={filtros.idProducto}
          onChange={handleChange}
          className="form-control"
        >
          <option value="">Producto</option>
          {productos.map(p => (
            <option key={p.idProducto} value={p.idProducto}>{p.nombreProducto}</option>
          ))}
        </select>

        <select
        name="movimiento"
        value={filtros.movimiento}
        onChange={handleChange}
        className="form-control">
            <option value="">Tipo Movimiento</option>
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
        </select>

      </div>

      <button className="btn-primary" onClick={buscar}>Buscar</button>

      <table className="styled-table" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Sucursal</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Pallets</th>
            <th>Bultos</th>
            <th>Movimiento</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map(m => (
            <tr key={m.idMovimiento}>
              <td>{m.idMovimiento}</td>
              <td>{m.fechaMovimiento ? new Date(m.fechaMovimiento).toLocaleDateString() : '-'}</td>
              <td>{sucursales.find(s => s.idSucursal === m.idSucursal)?.nombreSucursal || m.idSucursal}</td>
              <td>{clientes.find(c => c.idCliente === m.idCliente)?.nombreCliente || m.idCliente}</td>
              <td>{productos.find(p => p.idProducto === m.idProducto)?.nombreProducto || m.idProducto}</td>
              <td>{m.pallets || '-'}</td>
              <td>{m.bultos || '-'}</td>
              <td>{m.movimiento}</td>
              <td>{m.observaciones || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InformeMovimientos;
