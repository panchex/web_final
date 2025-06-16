'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/lib/services/api';

export type ApiStatus = 'checking' | 'online' | 'offline';

interface ApiStatusInfo {
  status: ApiStatus;
  lastCheck: Date | null;
  error?: string;
  details?: string;
}

export function useApiStatus() {
  const [statusInfo, setStatusInfo] = useState<ApiStatusInfo>({
    status: 'checking',
    lastCheck: null
  });

  const checkStatus = useCallback(async () => {
    try {
      setStatusInfo(prev => ({ ...prev, status: 'checking', error: undefined, details: undefined }));
      
      const result = await apiService.healthCheck();
      console.log('Health check successful:', result);
      
      setStatusInfo({
        status: 'online',
        lastCheck: new Date(),
        error: undefined,
        details: undefined
      });
    } catch (error: unknown) {
      console.warn('API health check failed:', error);
      
      let errorMessage = 'Connection failed';
      let errorDetails = 'Unknown error';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string; details?: string; message?: string } } };
        if (axiosError.response?.data) {
          errorMessage = axiosError.response.data.error || 'API Error';
          errorDetails = axiosError.response.data.details || axiosError.response.data.message || 'Server returned an error';
        }
      } else if (error instanceof Error) {
        errorMessage = 'Network Error';
        errorDetails = error.message;
      }
      
      setStatusInfo({
        status: 'offline',
        lastCheck: new Date(),
        error: errorMessage,
        details: errorDetails
      });
    }
  }, []);

  useEffect(() => {
    // Check immediately
    checkStatus();
    
    // Then check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, [checkStatus]);

  return {
    status: statusInfo.status,
    lastCheck: statusInfo.lastCheck,
    error: statusInfo.error,
    details: statusInfo.details,
    refresh: checkStatus,
  };
} 