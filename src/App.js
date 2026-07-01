import React, { useState } from 'react';

import Header from './Header';

import Clientes from './Clientes';
import Productos from './Productos';
import Sucursales from './Sucursales';
import Movimientos from './Movimientos';
import InformeMovimientosConGrafico from './InformeMovimientosConGrafico';

import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('clientes');

  const renderContent = () => {
    switch(activeTab) {
      case 'clientes':
        return <Clientes />;
      case 'productos':
        return <Productos />;
      case 'sucursales':
        return <Sucursales />;
      case 'movimientos':
        return <Movimientos />;
      case 'informe':
        return <InformeMovimientosConGrafico />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Header activeTab={activeTab} onChangeTab={setActiveTab} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;






