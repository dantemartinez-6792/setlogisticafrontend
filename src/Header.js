import React from 'react';

function Header({ activeTab, onChangeTab }) {
  const tabs = ['clientes', 'productos', 'sucursales', 'movimientos', 'informe'];

  return (
    <header className="header">
      <img src="/logo.png" alt="Set Logística" className="logo" />
      <nav className="menu">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onChangeTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default Header;
