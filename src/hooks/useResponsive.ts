'use client';

import { useEffect } from 'react';
import { useMedia } from 'react-use';
import { useDashboardStore } from '@/lib/stores/dashboard-store';

export function useResponsive() {
  const isMobile = useMedia('(max-width: 767px)', false);
  const isTablet = useMedia('(min-width: 768px) and (max-width: 1023px)', false);
  const isDesktop = useMedia('(min-width: 1024px)', true);
  
  const { setIsMobile, setSidebarCollapsed } = useDashboardStore();
  
  useEffect(() => {
    setIsMobile(isMobile);
    
    // Auto-manage sidebar based on screen size
    if (isMobile) {
      setSidebarCollapsed(true);
    } else if (isDesktop) {
      setSidebarCollapsed(false);
    }
  }, [isMobile, isDesktop, setIsMobile, setSidebarCollapsed]);
  
  return {
    isMobile,
    isTablet,
    isDesktop,
  };
} 