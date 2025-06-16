'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Tiempo de cache por defecto
            staleTime: 5 * 60 * 1000, // 5 minutos
            gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
            // Reintentos en caso de error
            retry: (failureCount, error: unknown) => {
              // No reintentar en errores 4xx
              if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } };
                if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
                  return false;
                }
              }
              // Máximo 3 reintentos para otros errores
              return failureCount < 3;
            },
            // Configuración de refetch
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
          mutations: {
            // Reintentos para mutaciones
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
} 