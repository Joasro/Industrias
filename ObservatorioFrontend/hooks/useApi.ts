import { useState, useEffect } from 'react';
import { apiService, ApiResponse } from '@/lib/api';

// Hook genérico para manejar llamadas a la API
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error || 'Error al cargar los datos');
        }
      } catch (err) {
        setError('Error inesperado al cargar los datos');
        console.error('Error en useApi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Error al recargar los datos');
      }
    } catch (err) {
      setError('Error inesperado al recargar los datos');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Hook específico para países
export function usePaises() {
  return useApi(() => apiService.getPaises());
}

// Hook específico para empresas
export function useEmpresas() {
  return useApi(() => apiService.getEmpresas());
}

// Hook específico para tendencias tecnológicas
export function useTendencias() {
  return useApi(() => apiService.getTendencias());
}

// Hook específico para productos y servicios
export function useProductosServicios() {
  return useApi(() => apiService.getProductosServicios());
}

// Hook específico para eventos de sector
export function useEventosSector() {
  return useApi(() => apiService.getEventosSector());
}

// Hook específico para indicadores económicos
export function useIndicadoresEconomicos() {
  return useApi(() => apiService.getIndicadoresEconomicos());
}

// Hook específico para comparativa de países
export function useComparativaPaises(paises?: string[]) {
  return useApi(() => apiService.getComparativaPaises(paises), [paises]);
}

// Hook específico para empresas internacionales
export function useEmpresasInternacionales() {
  return useApi(() => apiService.getEmpresasInternacionales());
}

// Hook específico para productos por sector
export function useProductosPorSector() {
  return useApi(() => apiService.getProductosPorSector());
}

// Hook específico para ranking de países por empresas
export function useRankingPaisesEmpresas() {
  return useApi(() => apiService.getRankingPaisesEmpresas());
}

// Hook específico para empresas de mayor crecimiento
export function useEmpresasMayorCrecimiento() {
  return useApi(() => apiService.getEmpresasMayorCrecimiento());
}

// Hook específico para distribución de empresas
export function useDistribucionEmpresas() {
  return useApi(() => apiService.getDistribucionEmpresas());
}

// Hook específico para tendencias emergentes
export function useTendenciasEmergentes() {
  return useApi(() => apiService.getTendenciasEmergentes());
}

// Hook específico para productos más demandados
export function useProductosMasDemandados() {
  return useApi(() => apiService.getProductosMasDemandados());
}

// Hook para búsqueda de empresas
export function useBuscarEmpresa(query: string) {
  return useApi(() => apiService.buscarEmpresa(query), [query]);
}

// Hook para empresas por país y sector
export function useEmpresasPorPaisSector(pais?: string, sector?: string) {
  return useApi(() => apiService.getEmpresasPorPaisSector(pais, sector), [pais, sector]);
}
