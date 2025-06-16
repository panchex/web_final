'use client';


import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { ModalManager } from './modals/ModalManager';
import { useResponsive } from '@/hooks/useResponsive';

export function DashboardLayout() {
  useResponsive(); // Initialize responsive behavior
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <TopBar />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <MainContent />
      </div>
      
      {/* Modals */}
      <ModalManager />
    </div>
  );
} 