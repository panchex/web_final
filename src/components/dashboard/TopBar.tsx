'use client';

import { useEffect } from 'react';
import { Menu, User, Circle } from 'lucide-react';
import { useDashboardStore } from '@/lib/stores/dashboard-store';
import { useApiStatus } from '@/hooks/useApiStatus';

export function TopBar() {
  const { 
    toggleSidebar, 
    isMobile,
    activeSection,
    apiStatus,
    setApiStatus,
    setLastApiCheck
  } = useDashboardStore();
  
  const { status, lastCheck, error, details, refresh } = useApiStatus();
  
  // Sync API status with store
  useEffect(() => {
    // Map useApiStatus status to dashboard store status
    const mappedStatus = status === 'online' ? 'connected' : 
                        status === 'offline' ? 'disconnected' : 'checking';
    setApiStatus(mappedStatus);
    if (lastCheck) {
      setLastApiCheck(lastCheck);
    }
  }, [status, lastCheck, setApiStatus, setLastApiCheck]);
  
  const getApiStatusIcon = () => {
    switch (apiStatus) {
      case 'connected':
        return <Circle className="w-3 h-3 fill-green-500 text-green-500" />;
      case 'disconnected':
        return <Circle className="w-3 h-3 fill-red-500 text-red-500" />;
      case 'checking':
        return <Circle className="w-3 h-3 fill-yellow-500 text-yellow-500 animate-pulse" />;
      default:
        return <Circle className="w-3 h-3 fill-gray-500 text-gray-500" />;
    }
  };
  
  const getApiStatusTooltip = () => {
    switch (apiStatus) {
      case 'connected':
        return 'API Conectada - Sistema funcionando correctamente';
      case 'disconnected':
        return error && details ? `API Desconectada - ${error}: ${details}` : 'API Desconectada - Verificando conexión...';
      case 'checking':
        return 'Verificando estado de la API...';
      default:
        return 'Estado de API desconocido';
    }
  };
  
  const getSectionInfo = () => {
    switch (activeSection) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Panel de control principal' };
      case 'clientes':
        return { title: 'Clientes', subtitle: 'Gestiona la información de tus clientes' };
      case 'ordenes':
        return { title: 'Órdenes de Trabajo', subtitle: 'Gestiona las órdenes de reparación y mantenimiento' };
      case 'equipos':
        return { title: 'Equipos', subtitle: 'Gestiona el inventario de equipos' };
      case 'inventario':
        return { title: 'Inventario', subtitle: 'Control de stock y repuestos' };
      case 'servicios':
        return { title: 'Servicios', subtitle: 'Gestiona los servicios ofrecidos' };
      case 'documentos':
        return { title: 'Documentos', subtitle: 'Gestiona archivos y documentación' };
      case 'configuracion':
        return { title: 'Configuración', subtitle: 'Ajustes del sistema' };
      default:
        return { title: 'OmegaElectronics', subtitle: 'Sistema de gestión' };
    }
  };
  
  const sectionInfo = getSectionInfo();
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Ω</span>
          </div>
          {!isMobile && (
            <span className="font-semibold text-gray-800 text-lg">
              OmegaElectronics
            </span>
          )}
        </div>
        
        {/* Section Title */}
        <div className="hidden md:block border-l border-gray-300 pl-4">
          <h1 className="text-lg font-semibold text-gray-900">
            {sectionInfo.title}
          </h1>
          <p className="text-xs text-gray-600 -mt-0.5">
            {sectionInfo.subtitle}
          </p>
        </div>
        
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Profile Button */}
        <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          {!isMobile && (
            <span className="text-sm font-medium text-gray-700">
              Admin
            </span>
          )}
        </button>
        
        {/* API Status - Simplified */}
        <button
          onClick={refresh}
          className="flex items-center space-x-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          title={getApiStatusTooltip()}
        >
          {getApiStatusIcon()}
          <span className="text-sm font-medium text-gray-700">
            API
          </span>
        </button>
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
    </header>
  );
} 