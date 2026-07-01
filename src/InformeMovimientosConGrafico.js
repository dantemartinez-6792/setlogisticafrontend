import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

function InformeMovimientosConGrafico() {
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

  // Cargar combos de filtro
  useEffect(() => {
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
  }, []);

  // Buscar movimientos filtrados
  const buscar = () => {
    const query = new URLSearchParams();
    Object.entries(filtros).forEach(([k, v]) => { if (v) query.append(k, v); });

    fetch(`http://localhost:3000/movimientos/filtrar?${query.toString()}`)
      .then(res => res.json())
      .then(data => setMovimientos(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Preparar datos para gráfico y cálculos
  const datosGrafico = movimientos.reduce((acc, m) => {
    let item = acc.find(x => x.movimiento === m.movimiento);
    if (!item) {
      item = { movimiento: m.movimiento, totalPallets: 0, totalBultos: 0 };
      acc.push(item);
    }
    item.totalPallets += Number(m.pallets) || 0;
    item.totalBultos += Number(m.bultos) || 0;
    return acc;
  }, []);

  // Calcular totales generales
  const totalPallets = movimientos.reduce((sum, m) => sum + (Number(m.pallets) || 0), 0);
  const totalBultos = movimientos.reduce((sum, m) => sum + (Number(m.bultos) || 0), 0);

  return (
    <div>
      <h2>Informe de Movimientos</h2>

      <div className="form-row">
        <input type="date" name="fechaInicio" value={filtros.fechaInicio} onChange={handleChange} className="form-control" />
        <input type="date" name="fechaFin" value={filtros.fechaFin} onChange={handleChange} className="form-control" />
        <select name="idSucursal" value={filtros.idSucursal} onChange={handleChange} className="form-control">
          <option value="">Sucursal</option>
          {sucursales.map(s => <option key={s.idSucursal} value={s.idSucursal}>{s.nombreSucursal}</option>)}
        </select>
        <select name="idCliente" value={filtros.idCliente} onChange={handleChange} className="form-control">
          <option value="">Cliente</option>
          {clientes.map(c => <option key={c.idCliente} value={c.idCliente}>{c.nombreCliente}</option>)}
        </select>
        <select name="idProducto" value={filtros.idProducto} onChange={handleChange} className="form-control">
          <option value="">Producto</option>
          {productos.map(p => <option key={p.idProducto} value={p.idProducto}>{p.nombreProducto}</option>)}
        </select>
        <select name="movimiento" value={filtros.movimiento} onChange={handleChange} className="form-control">
          <option value="">Tipo Movimiento</option>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
      </div>

      <button className="btn-primary" onClick={buscar}>Buscar</button>

      <div style={{ marginTop: 40, height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="movimiento" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalPallets" fill="#30BA7F" name="Total Pallets" />
            <Bar dataKey="totalBultos" fill="#0F8CCA" name="Total Bultos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 20 }}>
        <strong>Total Pallets:</strong> {totalPallets} &nbsp; | &nbsp;
        <strong>Total Bultos:</strong> {totalBultos}
      </div>
    </div>
  );
}

export default InformeMovimientosConGrafico;
