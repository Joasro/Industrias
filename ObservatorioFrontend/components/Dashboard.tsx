"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  Globe, 
  TrendingUp, 
  Users, 
  Code, 
  BarChart3,
  MapPin,
  Calendar,
  ExternalLink
} from "lucide-react"
import { 
  usePaises, 
  useEmpresas, 
  useTendencias, 
  useProductosServicios,
  useEventosSector,
  useIndicadoresEconomicos
} from "@/hooks/useApi"
import { LoadingSpinner, ErrorDisplay } from "@/components/ui/loading"

export function Dashboard() {
  const { data: paises, loading: loadingPaises, error: errorPaises, refetch: refetchPaises } = usePaises()
  const { data: empresas, loading: loadingEmpresas, error: errorEmpresas, refetch: refetchEmpresas } = useEmpresas()
  const { data: tendencias, loading: loadingTendencias, error: errorTendencias, refetch: refetchTendencias } = useTendencias()
  const { data: productos, loading: loadingProductos, error: errorProductos, refetch: refetchProductos } = useProductosServicios()
  const { data: eventos, loading: loadingEventos, error: errorEventos, refetch: refetchEventos } = useEventosSector()
  const { data: indicadores, loading: loadingIndicadores, error: errorIndicadores, refetch: refetchIndicadores } = useIndicadoresEconomicos()

  // Función para manejar errores
  const handleError = (error: string | null, refetch: () => void, title: string) => {
    if (error) {
      return <ErrorDisplay error={error} onRetry={refetch} title={title} />
    }
    return null
  }

  // Función para mostrar estado de carga
  const handleLoading = (loading: boolean, children: React.ReactNode) => {
    if (loading) {
      return <LoadingSpinner size="sm" text="Cargando..." />
    }
    return children
  }

  // Calcular estadísticas
  const totalPaises = paises?.length || 0
  const totalEmpresas = empresas?.length || 0
  const totalTendencias = tendencias?.length || 0
  const totalProductos = productos?.length || 0
  const totalEventos = eventos?.length || 0

  // Obtener países con más empresas
  const paisesTop = paises?.slice(0, 5) || []
  
  // Obtener empresas más recientes
  const empresasRecientes = empresas?.slice(0, 5) || []

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Países</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {handleLoading(loadingPaises, (
              <div className="text-2xl font-bold">{totalPaises}</div>
            ))}
            {handleError(errorPaises, refetchPaises, "Error al cargar países")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {handleLoading(loadingEmpresas, (
              <div className="text-2xl font-bold">{totalEmpresas}</div>
            ))}
            {handleError(errorEmpresas, refetchEmpresas, "Error al cargar empresas")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendencias</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {handleLoading(loadingTendencias, (
              <div className="text-2xl font-bold">{totalTendencias}</div>
            ))}
            {handleError(errorTendencias, refetchTendencias, "Error al cargar tendencias")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos/Servicios</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {handleLoading(loadingProductos, (
              <div className="text-2xl font-bold">{totalProductos}</div>
            ))}
            {handleError(errorProductos, refetchProductos, "Error al cargar productos")}
          </CardContent>
        </Card>
      </div>

      {/* Sección de países destacados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Países con Mayor Presencia Tecnológica
          </CardTitle>
          <CardDescription>
            Top 5 países según número de empresas y desarrollo tecnológico
          </CardDescription>
        </CardHeader>
        <CardContent>
          {handleLoading(loadingPaises, (
            <div className="space-y-4">
              {paisesTop.map((pais, index) => (
                <div key={pais.codigo_pais} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm">
                      #{index + 1}
                    </Badge>
                    <div>
                      <h4 className="font-semibold">{pais.nombre}</h4>
                      <p className="text-sm text-muted-foreground">
                        {pais.num_empresas_software || 0} empresas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${(pais.pbi_tech || 0).toLocaleString()}M
                    </p>
                    <p className="text-xs text-muted-foreground">PBI Tech</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {handleError(errorPaises, refetchPaises, "Error al cargar países")}
        </CardContent>
      </Card>

      {/* Sección de empresas recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Empresas Recientes
          </CardTitle>
          <CardDescription>
            Últimas empresas registradas en el observatorio
          </CardDescription>
        </CardHeader>
        <CardContent>
          {handleLoading(loadingEmpresas, (
            <div className="space-y-4">
              {empresasRecientes.map((empresa) => (
                <div key={empresa.id_empresa} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {empresa.nombre.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{empresa.nombre}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {empresa.sector}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {empresa.pais}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {empresa.anio_fundacion || 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">Fundación</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {handleError(errorEmpresas, refetchEmpresas, "Error al cargar empresas")}
        </CardContent>
      </Card>

      {/* Sección de tendencias tecnológicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tendencias Tecnológicas Emergentes
          </CardTitle>
          <CardDescription>
            Principales tendencias que están marcando el futuro del software
          </CardDescription>
        </CardHeader>
        <CardContent>
          {handleLoading(loadingTendencias, (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tendencias?.slice(0, 6).map((tendencia) => (
                <div key={tendencia.id_tendencia} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {tendencia.categoria || 'General'}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-2">{tendencia.nombre}</h4>
                  {tendencia.descripcion && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {tendencia.descripcion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
          {handleError(errorTendencias, refetchTendencias, "Error al cargar tendencias")}
        </CardContent>
      </Card>

      {/* Sección de eventos del sector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Eventos del Sector
          </CardTitle>
          <CardDescription>
            Próximos eventos y actividades relevantes para la industria tecnológica
          </CardDescription>
        </CardHeader>
        <CardContent>
          {handleLoading(loadingEventos, (
            <div className="space-y-4">
              {eventos?.slice(0, 5).map((evento) => (
                <div key={evento.id_evento} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{evento.tipo}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {evento.descripcion}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(evento.fecha).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Fecha</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {handleError(errorEventos, refetchEventos, "Error al cargar eventos")}
        </CardContent>
      </Card>

      {/* Botón de actualización */}
      <div className="flex justify-center">
        <Button 
          onClick={() => {
            refetchPaises()
            refetchEmpresas()
            refetchTendencias()
            refetchProductos()
            refetchEventos()
            refetchIndicadores()
          }}
          variant="outline"
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Actualizar Dashboard
        </Button>
      </div>
    </div>
  )
}
