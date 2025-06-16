'use client';

import { useDashboardStore } from '@/lib/stores/dashboard-store';
import { DashboardPage } from './pages/DashboardPage';
import { ClientesPage } from './pages/ClientesPage';
import { OrdenesPage } from './pages/OrdenesPage';
import { EquiposPage } from './pages/EquiposPage';
import { InventarioPage } from './pages/InventarioPage';
import { ServiciosPage } from './pages/ServiciosPage';
import { DocumentosPage } from './pages/DocumentosPage';
import { ConfiguracionPage } from './pages/ConfiguracionPage';

export function MainContent() {
  const { activeSection } = useDashboardStore();
  
  const renderPage = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />;
      case 'clientes':
        return <ClientesPage />;
      case 'ordenes':
        return <OrdenesPage />;
      case 'equipos':
        return <EquiposPage />;
      case 'inventario':
        return <InventarioPage />;
      case 'servicios':
        return <ServiciosPage />;
      case 'documentos':
        return <DocumentosPage />;
      case 'configuracion':
        return <ConfiguracionPage />;
      default:
        return <DashboardPage />;
    }
  };
  
  return (
    <main className="flex-1 bg-gray-50 transition-all duration-300">
      <div className="h-full overflow-auto">
        {renderPage()}
      </div>
    </main>
  );
} 