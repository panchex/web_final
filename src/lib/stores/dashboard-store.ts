import { create } from 'zustand';

export type DashboardSection = 
  | 'dashboard' 
  | 'clientes' 
  | 'ordenes' 
  | 'equipos' 
  | 'inventario' 
  | 'servicios' 
  | 'documentos'
  | 'configuracion';

export type ApiStatus = 'connected' | 'disconnected' | 'checking';

interface DashboardState {
  // UI State
  sidebarCollapsed: boolean;
  activeSection: DashboardSection;
  isMobile: boolean;
  
  // API State
  apiStatus: ApiStatus;
  lastApiCheck: Date | null;
  
  // Modal State
  activeModal: string | null;
  modalData: unknown;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveSection: (section: DashboardSection) => void;
  setIsMobile: (isMobile: boolean) => void;
  setApiStatus: (status: ApiStatus) => void;
  setLastApiCheck: (date: Date) => void;
  openModal: (modalId: string, data?: unknown) => void;
  closeModal: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  sidebarCollapsed: false,
  activeSection: 'dashboard',
  isMobile: false,
  apiStatus: 'checking',
  lastApiCheck: null,
  activeModal: null,
  modalData: null,
  
  // Actions
  toggleSidebar: () => set((state) => ({ 
    sidebarCollapsed: !state.sidebarCollapsed 
  })),
  
  setSidebarCollapsed: (collapsed) => set({ 
    sidebarCollapsed: collapsed 
  }),
  
  setActiveSection: (section) => set({ 
    activeSection: section 
  }),
  
  setIsMobile: (isMobile) => set({ 
    isMobile,
    // Auto-collapse sidebar on mobile
    sidebarCollapsed: isMobile ? true : get().sidebarCollapsed
  }),
  
  setApiStatus: (status) => set({ 
    apiStatus: status 
  }),
  
  setLastApiCheck: (date) => set({ 
    lastApiCheck: date 
  }),
  
  openModal: (modalId, data = null) => set({ 
    activeModal: modalId, 
    modalData: data 
  }),
  
  closeModal: () => set({ 
    activeModal: null, 
    modalData: null 
  }),
})); 