'use client';

import { 
  Users, 
  ClipboardList, 
  Wrench, 
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

const mockStats: StatCard[] = [
  {
    title: 'Total Clientes',
    value: '156',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
  },
  {
    title: 'Órdenes Activas',
    value: '23',
    change: '+5%',
    changeType: 'positive',
    icon: ClipboardList,
  },
  {
    title: 'Equipos en Reparación',
    value: '45',
    change: '-8%',
    changeType: 'negative',
    icon: Wrench,
  },
  {
    title: 'Ingresos del Mes',
    value: '$2.5M',
    change: '+18%',
    changeType: 'positive',
    icon: DollarSign,
  },
];

const mockRecentActivity = [
  {
    id: 1,
    type: 'orden_creada',
    description: 'Nueva orden de reparación #ORD-2024-001',
    client: 'Juan Pérez',
    time: '2 min ago',
    status: 'nueva'
  },
  {
    id: 2,
    type: 'equipo_entregado',
    description: 'Equipo entregado - iPhone 12 Pro',
    client: 'María González',
    time: '15 min ago',
    status: 'completado'
  },
  {
    id: 3,
    type: 'cliente_nuevo',
    description: 'Nuevo cliente registrado',
    client: 'Carlos Rodríguez',
    time: '1 hora ago',
    status: 'info'
  },
  {
    id: 4,
    type: 'pago_recibido',
    description: 'Pago recibido - $150.000',
    client: 'Ana Silva',
    time: '2 horas ago',
    status: 'completado'
  },
];

export function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Quick Action Button */}
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Generar Reporte
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' :
                  stat.changeType === 'negative' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  vs mes anterior
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Actividad Reciente
            </h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'completado' ? 'bg-green-500' :
                    activity.status === 'nueva' ? 'bg-blue-500' :
                    'bg-gray-400'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      Cliente: {activity.client}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Ver toda la actividad →
              </button>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Acciones Rápidas
            </h2>
          </div>
          
          <div className="p-6 space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">
                Nuevo Cliente
              </span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <ClipboardList className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">
                Nueva Orden
              </span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Wrench className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900">
                Registrar Equipo
              </span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">
                Agendar Cita
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Alerts/Notifications */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              Recordatorios Pendientes
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Tienes 3 equipos que deben ser entregados esta semana y 2 citas programadas para mañana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 