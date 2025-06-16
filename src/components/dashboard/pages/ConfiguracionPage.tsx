'use client';

import { Settings } from 'lucide-react';

export function ConfiguracionPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">Ajustes del sistema</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Configuración del Sistema</h3>
        <p className="text-gray-600">Esta sección estará disponible próximamente</p>
      </div>
    </div>
  );
} 