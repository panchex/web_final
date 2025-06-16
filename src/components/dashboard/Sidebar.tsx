'use client';

import { 
  Home, 
  Users, 
  ClipboardList, 
  Wrench, 
  Package, 
  Cog, 
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useDashboardStore, DashboardSection } from '@/lib/stores/dashboard-store';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: DashboardSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
  },
  {
    id: 'clientes',
    label: 'Clientes',
    icon: Users,
    badge: 156,
  },
  {
    id: 'ordenes',
    label: 'Órdenes',
    icon: ClipboardList,
    badge: 23,
  },
  {
    id: 'equipos',
    label: 'Equipos',
    icon: Wrench,
    badge: 45,
  },
  {
    id: 'inventario',
    label: 'Inventario',
    icon: Package,
  },
  {
    id: 'servicios',
    label: 'Servicios',
    icon: Cog,
  },
  {
    id: 'documentos',
    label: 'Documentos',
    icon: FileText,
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    icon: Settings,
  },
];

export function Sidebar() {
  const { 
    sidebarCollapsed, 
    activeSection, 
    isMobile,
    toggleSidebar,
    setActiveSection 
  } = useDashboardStore();
  
  const { isDesktop } = useResponsive();
  
  const handleItemClick = (sectionId: DashboardSection) => {
    setActiveSection(sectionId);
    
    // Auto-close sidebar on mobile after selection
    if (isMobile) {
      toggleSidebar();
    }
  };
  
  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-64';
  
  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-50',
          sidebarWidth,
          isMobile && sidebarCollapsed && '-translate-x-full',
          'lg:relative lg:translate-x-0 lg:top-0 lg:h-[calc(100vh-4rem)]'
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h2 className="font-semibold text-gray-800">
                Navegación
              </h2>
            )}
            
            {/* Toggle Button - Only on desktop */}
            {isDesktop && (
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  'w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-left',
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                  sidebarCollapsed && 'justify-center'
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  'flex-shrink-0',
                  isActive ? 'text-blue-600' : 'text-gray-500',
                  sidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'
                )} />
                
                {!sidebarCollapsed && (
                  <>
                    <span className="font-medium flex-1">
                      {item.label}
                    </span>
                    
                    {item.badge && (
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        isActive 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-600'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
        
        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 text-center">
              OmegaElectronics v1.0
            </div>
          </div>
        )}
      </aside>
    </>
  );
} 