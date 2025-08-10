// Servicios de API para conectar con el backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Cliente HTTP básico
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Instancia del cliente API
export const apiClient = new ApiClient(API_BASE_URL);

// Tipos de datos del backend
export interface Pais {
  codigo_pais: string;
  nombre: string;
  pbi_tech?: number;
  num_empresas_software?: number;
  exportaciones_ti?: number;
}

export interface Empresa {
  id_empresa: number;
  nombre: string;
  pais: string;
  sector: string;
  anio_fundacion?: number;
  empleados?: number;
  sito_web?: string;
  linkedin?: string;
  descripcion?: string;
  id_tendencia?: number;
  TendenciaTecnologica?: TendenciaTecnologica;
}

export interface TendenciaTecnologica {
  id_tendencia: number;
  nombre: string;
  descripcion?: string;
  categoria?: string;
}

export interface ProductoServicio {
  id_producto: number;
  nombre: string;
  descripcion?: string;
  categoria: string;
  id_empresa: number;
  precio?: number;
  Empresa?: Empresa;
}

export interface EventoSector {
  id_evento: number;
  tipo: string;
  descripcion: string;
  fecha: string;
  id_empresa?: number;
  Empresa?: Empresa;
}

export interface IndicadorEconomico {
  id_indicador: number;
  pais: string;
  pbi_total: number;
  pbi_tech: number;
  empleos_tech: number;
  inversiones_tech: number;
  anio: number;
}

// Servicios específicos
export const apiService = {
  // Países
  async getPaises(): Promise<ApiResponse<Pais[]>> {
    return apiClient.get<Pais[]>('/pais');
  },

  // Empresas
  async getEmpresas(): Promise<ApiResponse<Empresa[]>> {
    return apiClient.get<Empresa[]>('/empresa');
  },

  async getEmpresa(id: number): Promise<ApiResponse<Empresa>> {
    return apiClient.get<Empresa>(`/empresa/buscar?id_empresa=${id}`);
  },

  // Tendencias tecnológicas
  async getTendencias(): Promise<ApiResponse<TendenciaTecnologica[]>> {
    return apiClient.get<TendenciaTecnologica[]>('/tendencia-tecnologica');
  },

  // Productos y servicios
  async getProductosServicios(): Promise<ApiResponse<ProductoServicio[]>> {
    return apiClient.get<ProductoServicio[]>('/producto-servicio');
  },

  // Eventos de sector
  async getEventosSector(): Promise<ApiResponse<EventoSector[]>> {
    return apiClient.get<EventoSector[]>('/evento-sector');
  },

  // Indicadores económicos
  async getIndicadoresEconomicos(): Promise<ApiResponse<IndicadorEconomico[]>> {
    return apiClient.get<IndicadorEconomico[]>('/indicador-economico');
  },

  // Endpoints especiales para frontend
  async getComparativaPaises(paises?: string[]): Promise<ApiResponse<any>> {
    const params = paises ? `?paises=${paises.join(',')}` : '';
    return apiClient.get<any>(`/frontend/comparativa-paises${params}`);
  },

  async getEmpresasInternacionales(): Promise<ApiResponse<Empresa[]>> {
    return apiClient.get<Empresa[]>('/frontend/empresas-internacionales');
  },

  async getProductosPorSector(): Promise<ApiResponse<any>> {
    return apiClient.get<any>('/frontend/productos-por-sector');
  },

  async getRankingPaisesEmpresas(): Promise<ApiResponse<any>> {
    return apiClient.get<any>('/frontend/ranking-paises-empresas');
  },

  async getEmpresasMayorCrecimiento(): Promise<ApiResponse<Empresa[]>> {
    return apiClient.get<Empresa[]>('/frontend/empresas-mayor-crecimiento');
  },

  async getDistribucionEmpresas(): Promise<ApiResponse<any>> {
    return apiClient.get<any>('/frontend/distribucion-empresas');
  },

  async getTendenciasEmergentes(): Promise<ApiResponse<TendenciaTecnologica[]>> {
    return apiClient.get<TendenciaTecnologica[]>('/frontend/tendencias-emergentes');
  },

  async getProductosMasDemandados(): Promise<ApiResponse<ProductoServicio[]>> {
    return apiClient.get<ProductoServicio[]>('/frontend/productos-mas-demandados');
  },

  async buscarEmpresa(query: string): Promise<ApiResponse<Empresa[]>> {
    return apiClient.get<Empresa[]>(`/frontend/buscar-empresa?q=${encodeURIComponent(query)}`);
  },

  async getEmpresasPorPaisSector(pais?: string, sector?: string): Promise<ApiResponse<Empresa[]>> {
    const params = new URLSearchParams();
    if (pais) params.append('pais', pais);
    if (sector) params.append('sector', sector);
    return apiClient.get<Empresa[]>(`/frontend/empresas-por-pais-sector?${params.toString()}`);
  },
};
