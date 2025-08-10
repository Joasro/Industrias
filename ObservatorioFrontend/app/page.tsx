"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  Monitor,
  TrendingUp,
  Globe,
  BookOpen,
  Search,
  Calendar,
  ExternalLink,
  Play,
  Download,
  Share2,
  Filter,
  MapPin,
  Building2,
  Users,
  Code,
  Smartphone,
  Database,
  Menu,
  X,
  GraduationCap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePaises, useEmpresas, useTendencias, useProductosServicios, useEventosSector, useIndicadoresEconomicos, useComparativaPaises, useEmpresasInternacionales, useProductosPorSector, useRankingPaisesEmpresas, useEmpresasMayorCrecimiento, useDistribucionEmpresas, useTendenciasEmergentes, useProductosMasDemandados } from "@/hooks/useApi"
import { LoadingSpinner, ErrorDisplay, EmptyState } from "@/components/ui/loading"

// Datos estáticos eliminados en favor de datos del backend

const UNAH_COLORS = ["#002776", "#FFC100", "#1E40AF", "#F59E0B", "#059669"]

const newsData = [
  {
    id: 1,
    title: "Honduras lidera crecimiento en desarrollo de software en Centroamérica",
    summary: "El país registra un incremento del 35% en empresas de tecnología durante 2024",
    date: "2024-01-15",
    category: "Desarrollo",
    image: "/placeholder.svg?height=200&width=300&text=Honduras+Software",
  },
  {
    id: 2,
    title: "UNAH lanza programa de incubación para startups tecnológicas",
    summary: "Nueva iniciativa busca fortalecer el ecosistema emprendedor nacional",
    date: "2024-01-12",
    category: "Educación",
    image: "/placeholder.svg?height=200&width=300&text=UNAH+Startups",
  },
  {
    id: 3,
    title: "Fintech hondureñas captan $15M en inversión extranjera",
    summary: "Sector financiero tecnológico muestra crecimiento exponencial",
    date: "2024-01-10",
    category: "Fintech",
    image: "/placeholder.svg?height=200&width=300&text=Fintech+Honduras",
  },
]

const galleryItems = [
  {
    type: "image",
    title: "Campus UNAH - Facultad de Ingeniería",
    url: "/placeholder.svg?height=300&width=400&text=UNAH+Campus",
    description: "Instalaciones de la Facultad de Ingeniería donde se desarrolla investigación tecnológica",
  },
  {
    type: "video",
    title: "Ecosistema Tech Honduras 2024",
    url: "/placeholder.svg?height=300&width=400&text=Tech+Ecosystem",
    description: "Panorama del desarrollo tecnológico en Honduras",
  },
  {
    type: "image",
    title: "Conferencia Regional de Software",
    url: "/placeholder.svg?height=300&width=400&text=Software+Conference",
    description: "Evento anual que reúne a desarrolladores centroamericanos",
  },
  {
    type: "video",
    title: "Startups Hondureñas Exitosas",
    url: "/placeholder.svg?height=300&width=400&text=Honduras+Startups",
    description: "Casos de éxito en el emprendimiento tecnológico nacional",
  },
]

export default function UNAHSoftwareObservatory() {
  const [activeSection, setActiveSection] = useState("inicio")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Hooks de la API para obtener datos del backend
  const { data: paises, loading: loadingPaises, error: errorPaises, refetch: refetchPaises } = usePaises()
  const { data: empresas, loading: loadingEmpresas, error: errorEmpresas, refetch: refetchEmpresas } = useEmpresas()
  const { data: tendencias, loading: loadingTendencias, error: errorTendencias, refetch: refetchTendencias } = useTendencias()
  const { data: productosServicios, loading: loadingProductos, error: errorProductos, refetch: refetchProductos } = useProductosServicios()
  const { data: eventosSector, loading: loadingEventos, error: errorEventos, refetch: refetchEventos } = useEventosSector()
  const { data: indicadoresEconomicos, loading: loadingIndicadores, error: errorIndicadores, refetch: refetchIndicadores } = useIndicadoresEconomicos()
  const { data: comparativaPaises, loading: loadingComparativa, error: errorComparativa, refetch: refetchComparativa } = useComparativaPaises()
  const { data: empresasInternacionales, loading: loadingEmpresasInt, error: errorEmpresasInt, refetch: refetchEmpresasInt } = useEmpresasInternacionales()
  const { data: productosPorSector, loading: loadingProductosSector, error: errorProductosSector, refetch: refetchProductosSector } = useProductosPorSector()
  const { data: rankingPaises, loading: loadingRanking, error: errorRanking, refetch: refetchRanking } = useRankingPaisesEmpresas()
  const { data: empresasCrecimiento, loading: loadingCrecimiento, error: errorCrecimiento, refetch: refetchCrecimiento } = useEmpresasMayorCrecimiento()
  const { data: distribucionEmpresas, loading: loadingDistribucion, error: errorDistribucion, refetch: refetchDistribucion } = useDistribucionEmpresas()
  const { data: tendenciasEmergentes, loading: loadingTendenciasEmerg, error: errorTendenciasEmerg, refetch: refetchTendenciasEmerg } = useTendenciasEmergentes()
  const { data: productosDemandados, loading: loadingProductosDem, error: errorProductosDem, refetch: refetchProductosDem } = useProductosMasDemandados()

  // Transformaciones de datos para la sección "Mapa" alimentadas por backend
  const sectorData = useMemo(() => {
    // Preferimos la agregación del backend: productos agrupados por sector
    if (productosPorSector && Array.isArray(productosPorSector)) {
      return productosPorSector.map((g: any) => ({
        name: g.sector || 'Sin sector',
        value: Array.isArray(g.productos) ? g.productos.length : 0,
        companies: (empresas || []).filter((e: any) => e.sector === g.sector).length,
      }))
    }
    // Fallback: agrupar empresas por sector si no hay agregación disponible
    const counts: Record<string, number> = {}
    ;(empresas || []).forEach((e: any) => {
      const key = e.sector || 'Sin sector'
      counts[key] = (counts[key] || 0) + 1
    })
    return Object.entries(counts).map(([name, count]) => ({ name, value: count, companies: count }))
  }, [productosPorSector, empresas])

  // Función para manejar errores de la API
  const handleApiError = (error: string | null, refetch: () => void, title?: string) => {
    if (error) {
      return (
        <ErrorDisplay 
          error={error} 
          onRetry={refetch} 
          title={title || "Error al cargar los datos"}
        />
      )
    }
    return null
  }

  // Función para mostrar estado de carga
  const handleLoading = (loading: boolean, children: React.ReactNode) => {
    if (loading) {
      return <LoadingSpinner text="Cargando datos del observatorio..." />
    }
    return children
  }

  const filteredNews =
    selectedCategory === "all"
      ? newsData
      : newsData.filter((news) => news.category.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b-2 border-unah-blue sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Image src="/logo.png" alt="Radar Digital Logo" width={60} height={60} className="h-12 w-12" />
                <div>
                  <div className="font-college text-3xl font-bold text-unah-blue">RADAR DIGITAL</div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <button
                onClick={() => setActiveSection("inicio")}
                className={`font-helvetica font-medium transition-colors ${
                  activeSection === "inicio"
                    ? "text-unah-blue border-b-2 border-unah-yellow pb-1"
                    : "text-gray-700 hover:text-unah-blue"
                }`}
              >
                Inicio
              </button>
              <button
                onClick={() => setActiveSection("mapa")}
                className={`font-helvetica font-medium transition-colors ${
                  activeSection === "mapa"
                    ? "text-unah-blue border-b-2 border-unah-yellow pb-1"
                    : "text-gray-700 hover:text-unah-blue"
                }`}
              >
                Mapa de la Industria
              </button>
              <button
                onClick={() => setActiveSection("tendencias")}
                className={`font-helvetica font-medium transition-colors ${
                  activeSection === "tendencias"
                    ? "text-unah-blue border-b-2 border-unah-yellow pb-1"
                    : "text-gray-700 hover:text-unah-blue"
                }`}
              >
                Tendencias
              </button>
              <button
                onClick={() => setActiveSection("noticias")}
                className={`font-helvetica font-medium transition-colors ${
                  activeSection === "noticias"
                    ? "text-unah-blue border-b-2 border-unah-yellow pb-1"
                    : "text-gray-700 hover:text-unah-blue"
                }`}
              >
                Noticias
              </button>
              <button
                onClick={() => setActiveSection("galeria")}
                className={`font-helvetica font-medium transition-colors ${
                  activeSection === "galeria"
                    ? "text-unah-blue border-b-2 border-unah-yellow pb-1"
                    : "text-gray-700 hover:text-unah-blue"
                }`}
              >
                Galería
              </button>
              <button
                onClick={() => setActiveSection("referencias")}
                className={`font-helvetica font-medium transition-colors ${
                  activeSection === "referencias"
                    ? "text-unah-blue border-b-2 border-unah-yellow pb-1"
                    : "text-gray-700 hover:text-unah-blue"
                }`}
              >
                Referencias
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button className="lg:hidden text-unah-blue" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col space-y-2">
                {["inicio", "mapa", "tendencias", "noticias", "galeria", "referencias"].map((section) => (
                  <button
                    key={section}
                    onClick={() => {
                      setActiveSection(section)
                      setMobileMenuOpen(false)
                    }}
                    className={`text-left py-3 px-4 rounded font-helvetica font-medium transition-colors ${
                      activeSection === section
                        ? "bg-unah-blue text-white"
                        : "text-gray-700 hover:bg-unah-blue/10 hover:text-unah-blue"
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1).replace("_", " ")}
                  </button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Inicio Section */}
        {activeSection === "inicio" && (
          <>
            {/* Hero Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-unah-blue to-unah-blue-light">
              <div className="container mx-auto text-center text-white">
                <div className="max-w-5xl mx-auto">
                  <h1 className="font-college text-5xl md:text-7xl font-bold mb-6">
                    RADAR DIGITAL
                    <span className="text-unah-yellow block">MERCADO DEL SOFTWARE</span>
                    <span className="text-3xl md:text-4xl block mt-2">Honduras y Centroamérica</span>
                  </h1>
                  <p className="font-helvetica text-xl mb-8 leading-relaxed font-light">
                    Plataforma de monitoreo y análisis del ecosistema tecnológico centroamericano, impulsada por la
                    Universidad Nacional Autónoma de Honduras para fortalecer la industria del software en la región.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="bg-unah-yellow text-unah-blue hover:bg-unah-yellow/90 font-helvetica font-bold"
                      onClick={() => setActiveSection("mapa")}
                    >
                      Explorar Mercado
                      <TrendingUp className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-unah-blue font-helvetica font-medium bg-transparent"
                      onClick={() => setActiveSection("tendencias")}
                    >
                      Ver Tendencias
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="font-college text-3xl font-bold text-unah-blue mb-4">
                    MERCADO DE SOFTWARE EN CENTROAMÉRICA
                  </h2>
                  <p className="font-helvetica text-gray-600">Datos actualizados a enero 2024</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-unah-blue mb-2 font-college">376</div>
                    <div className="font-helvetica text-gray-600 font-medium">Empresas de Software</div>
                    <div className="font-helvetica text-sm text-unah-yellow">Honduras</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-unah-blue mb-2 font-college">1,250</div>
                    <div className="font-helvetica text-gray-600 font-medium">Desarrolladores</div>
                    <div className="font-helvetica text-sm text-unah-yellow">Activos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-unah-blue mb-2 font-college">$45.2M</div>
                    <div className="font-helvetica text-gray-600 font-medium">Inversión 2024</div>
                    <div className="font-helvetica text-sm text-unah-yellow">Región</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-unah-blue mb-2 font-college">28%</div>
                    <div className="font-helvetica text-gray-600 font-medium">Crecimiento Anual</div>
                    <div className="font-helvetica text-sm text-unah-yellow">Promedio</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Overview */}
            <section className="py-20 px-4">
              <div className="container mx-auto">
                <div className="text-center mb-16">
                  <h2 className="font-college text-4xl font-bold text-unah-blue mb-4">SECTORES PRINCIPALES</h2>
                  <p className="font-helvetica text-xl text-gray-600 max-w-2xl mx-auto">
                    Áreas de mayor desarrollo en la industria del software centroamericana
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-unah-yellow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-unah-blue/10 rounded-lg flex items-center justify-center mb-4">
                        <Monitor className="h-6 w-6 text-unah-blue" />
                      </div>
                      <CardTitle className="font-college text-unah-blue">Desarrollo Web</CardTitle>
                      <CardDescription className="font-helvetica">
                        Sitios web, aplicaciones web y plataformas digitales
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-unah-yellow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-unah-yellow/20 rounded-lg flex items-center justify-center mb-4">
                        <Smartphone className="h-6 w-6 text-unah-blue" />
                      </div>
                      <CardTitle className="font-college text-unah-blue">Apps Móviles</CardTitle>
                      <CardDescription className="font-helvetica">
                        Aplicaciones nativas y multiplataforma para iOS y Android
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-unah-yellow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-unah-blue/10 rounded-lg flex items-center justify-center mb-4">
                        <Database className="h-6 w-6 text-unah-blue" />
                      </div>
                      <CardTitle className="font-college text-unah-blue">Software Empresarial</CardTitle>
                      <CardDescription className="font-helvetica">
                        Sistemas ERP, CRM y soluciones de gestión empresarial
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Mapa de la Industria Section */}
        {activeSection === "mapa" && (
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-college text-4xl font-bold text-unah-blue mb-4">
                  MAPA DE LA INDUSTRIA DEL SOFTWARE
                </h2>
                <p className="font-helvetica text-xl text-gray-600 max-w-2xl mx-auto">
                  Análisis completo del ecosistema tecnológico en Honduras y Centroamérica
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {/* Distribución por Sector (dinámico desde backend) */}
                <Card className="p-6 border-2 border-unah-blue/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-college text-unah-blue">
                      <Globe className="h-5 w-5" />
                      Distribución por Sector (%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {handleLoading(loadingProductosSector || loadingEmpresas, (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={sectorData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {sectorData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={UNAH_COLORS[index % UNAH_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ))}
                    {handleApiError(errorProductosSector || errorEmpresas, () => {
                      refetchProductosSector();
                      refetchEmpresas();
                    }, "Error al cargar distribución por sector")}
                  </CardContent>
                </Card>

                {/* Número de Empresas por Sector (dinámico desde backend) */}
                <Card className="p-6 border-2 border-unah-yellow/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-college text-unah-blue">
                      <Building2 className="h-5 w-5" />
                      Empresas por Sector
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {handleLoading(loadingProductosSector || loadingEmpresas, (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={sectorData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="companies" fill="#002776" />
                        </BarChart>
                      </ResponsiveContainer>
                    ))}
                    {handleApiError(errorProductosSector || errorEmpresas, () => {
                      refetchProductosSector();
                      refetchEmpresas();
                    }, "Error al cargar empresas por sector")}
                  </CardContent>
                </Card>
              </div>

              {/* Mapa Regional (dinámico desde backend: rankingPaises/distribucionEmpresas) */}
              <Card className="p-6 border-2 border-unah-blue/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-college text-unah-blue">
                    <MapPin className="h-5 w-5" />
                    Distribución Regional del Mercado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {handleLoading(loadingRanking || loadingDistribucion, (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(rankingPaises || distribucionEmpresas || []).slice(0, 6).map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-4 p-4 bg-gradient-to-r from-unah-blue to-unah-blue-light text-white rounded-lg"
                        >
                          <Building2 className="h-8 w-8" />
                          <div>
                            <div className="font-college font-bold">{item.pais || item.codigo_pais}</div>
                            <div className="font-helvetica text-sm">Presencia Tecnológica</div>
                            <div className="font-helvetica text-xs text-unah-yellow">
                              {(item.total_empresas || 0)} empresas
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  {handleApiError(errorRanking || errorDistribucion, () => {
                    refetchRanking();
                    refetchDistribucion();
                  }, "Error al cargar distribución regional")}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Tendencias Section */}
        {activeSection === "tendencias" && (
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-college text-4xl font-bold text-unah-blue mb-4">TENDENCIAS DEL MERCADO</h2>
                <p className="font-helvetica text-xl text-gray-600 max-w-2xl mx-auto">
                  Análisis y proyecciones basadas en datos del observatorio
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {/* Evolución Regional */}
                <Card className="p-6 border-2 border-unah-blue/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-college text-unah-blue">
                      <TrendingUp className="h-5 w-5" />
                      Evolución Regional 2024
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {handleLoading(loadingIndicadores, (
                      <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={(indicadoresEconomicos || []).slice(0, 24)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="anio" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="pib" stroke="#002776" strokeWidth={3} name="PIB" />
                          <Line type="monotone" dataKey="inversion_ti" stroke="#3B82F6" strokeWidth={3} name="Inversión TI" />
                        </LineChart>
                      </ResponsiveContainer>
                    ))}
                    {handleApiError(errorIndicadores, refetchIndicadores, "Error al cargar indicadores")}
                  </CardContent>
                </Card>

                {/* Inversión Regional */}
                <Card className="p-6 border-2 border-unah-yellow/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-college text-unah-blue">
                      <Users className="h-5 w-5" />
                      Inversión en Tecnología (Millones USD)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {handleLoading(loadingComparativa, (
                      <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={(comparativaPaises || []).map((p: any) => ({
                          pais: p.pais,
                          total_empresas: p.total_empresas,
                          total_productos: p.total_productos,
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="pais" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="total_empresas"
                            stroke="#FFC100"
                            fill="#FFC100"
                            fillOpacity={0.3}
                            name="Empresas"
                          />
                          <Area
                            type="monotone"
                            dataKey="total_productos"
                            stroke="#002776"
                            fill="#002776"
                            fillOpacity={0.5}
                            name="Productos"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ))}
                    {handleApiError(errorComparativa, refetchComparativa, "Error al cargar comparativa de países")}
                  </CardContent>
                </Card>
              </div>

              {/* Proyecciones */}
              <Card className="p-6 border-2 border-unah-blue/20">
                <CardHeader>
                  <CardTitle className="font-college text-unah-blue">Proyecciones 2025-2027</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 bg-gradient-to-br from-unah-blue/10 to-unah-blue/5 rounded-lg border border-unah-blue/20">
                      <Code className="h-8 w-8 text-unah-blue mb-3" />
                      <h4 className="font-college font-bold text-unah-blue mb-2">Desarrollo Web</h4>
                      <p className="font-helvetica text-sm text-gray-600">
                        Crecimiento esperado del 45% en demanda de aplicaciones web empresariales para 2026
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-unah-yellow/20 to-unah-yellow/10 rounded-lg border border-unah-yellow/30">
                      <Smartphone className="h-8 w-8 text-unah-blue mb-3" />
                      <h4 className="font-college font-bold text-unah-blue mb-2">Apps Móviles</h4>
                      <p className="font-helvetica text-sm text-gray-600">
                        El mercado móvil crecerá 60% impulsado por el comercio electrónico y fintech
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-lg border border-green-200">
                      <Database className="h-8 w-8 text-unah-blue mb-3" />
                      <h4 className="font-college font-bold text-unah-blue mb-2">Fintech</h4>
                      <p className="font-helvetica text-sm text-gray-600">
                        Sector con mayor potencial de crecimiento: 80% para 2027 en toda la región
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Noticias Section */}
        {activeSection === "noticias" && (
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-college text-4xl font-bold text-unah-blue mb-4">NOTICIAS DEL SECTOR</h2>
                <p className="font-helvetica text-xl text-gray-600 max-w-2xl mx-auto">
                  Últimas noticias y desarrollos en el mercado del software centroamericano
                </p>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap gap-4 mb-8 justify-center">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  className={`flex items-center gap-2 font-helvetica ${
                    selectedCategory === "all"
                      ? "bg-unah-blue hover:bg-unah-blue/90"
                      : "border-unah-blue text-unah-blue hover:bg-unah-blue hover:text-white"
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  Todas
                </Button>
                <Button
                  variant={selectedCategory === "desarrollo" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("desarrollo")}
                  className={
                    selectedCategory === "desarrollo"
                      ? "bg-unah-blue hover:bg-unah-blue/90"
                      : "border-unah-blue text-unah-blue hover:bg-unah-blue hover:text-white"
                  }
                >
                  Desarrollo
                </Button>
                <Button
                  variant={selectedCategory === "educacion" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("educacion")}
                  className={
                    selectedCategory === "educacion"
                      ? "bg-unah-blue hover:bg-unah-blue/90"
                      : "border-unah-blue text-unah-blue hover:bg-unah-blue hover:text-white"
                  }
                >
                  Educación
                </Button>
                <Button
                  variant={selectedCategory === "fintech" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("fintech")}
                  className={
                    selectedCategory === "fintech"
                      ? "bg-unah-blue hover:bg-unah-blue/90"
                      : "border-unah-blue text-unah-blue hover:bg-unah-blue hover:text-white"
                  }
                >
                  Fintech
                </Button>
              </div>

              {/* Noticias Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((news) => (
                  <Card
                    key={news.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-unah-yellow"
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={news.image || "/placeholder.svg"}
                        alt={news.title}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-unah-blue font-helvetica">{news.category}</Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="font-college text-lg line-clamp-2 text-unah-blue">{news.title}</CardTitle>
                      <CardDescription className="font-helvetica line-clamp-3">{news.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 font-helvetica">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(news.date).toLocaleDateString("es-ES")}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-unah-blue hover:bg-unah-blue/10 font-helvetica"
                        >
                          Leer más
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Newsletter UNAH */}
              <Card className="mt-16 p-8 bg-gradient-to-r from-unah-blue to-unah-blue-light text-white border-2 border-unah-yellow">
                <div className="text-center">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="font-college text-2xl font-bold mb-4">Boletín Radar Digital</h3>
                  <p className="font-helvetica mb-6">
                    Recibe análisis exclusivos del mercado tecnológico centroamericano
                  </p>
                  <div className="flex max-w-md mx-auto gap-4">
                    <Input placeholder="tu@email.com" className="bg-white text-gray-900 font-helvetica" />
                    <Button className="bg-unah-yellow text-unah-blue hover:bg-unah-yellow/90 font-helvetica font-bold">
                      Suscribirse
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Galería Section */}
        {activeSection === "galeria" && (
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-college text-4xl font-bold text-unah-blue mb-4">GALERÍA MULTIMEDIA</h2>
                <p className="font-helvetica text-xl text-gray-600 max-w-2xl mx-auto">
                  Imágenes y videos del ecosistema tecnológico hondureño y centroamericano
                </p>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-unah-blue/10">
                  <TabsTrigger
                    value="all"
                    className="font-helvetica data-[state=active]:bg-unah-blue data-[state=active]:text-white"
                  >
                    Todo
                  </TabsTrigger>
                  <TabsTrigger
                    value="images"
                    className="font-helvetica data-[state=active]:bg-unah-blue data-[state=active]:text-white"
                  >
                    Imágenes
                  </TabsTrigger>
                  <TabsTrigger
                    value="videos"
                    className="font-helvetica data-[state=active]:bg-unah-blue data-[state=active]:text-white"
                  >
                    Videos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((item, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 border-transparent hover:border-unah-yellow"
                      >
                        <div className="aspect-video relative">
                          <Image
                            src={item.url || "/placeholder.svg"}
                            alt={item.title}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {item.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-unah-blue/30">
                              <Play className="h-12 w-12 text-white" />
                            </div>
                          )}
                          <div className="absolute top-4 right-4">
                            <Badge
                              variant={item.type === "video" ? "destructive" : "secondary"}
                              className="font-helvetica"
                            >
                              {item.type === "video" ? "Video" : "Imagen"}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="font-college text-lg text-unah-blue">{item.title}</CardTitle>
                          <CardDescription className="font-helvetica">{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-unah-blue text-unah-blue hover:bg-unah-blue hover:text-white font-helvetica bg-transparent"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Descargar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-unah-yellow text-unah-blue hover:bg-unah-yellow hover:text-unah-blue font-helvetica bg-transparent"
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              Compartir
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="images">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems
                      .filter((item) => item.type === "image")
                      .map((item, index) => (
                        <Card
                          key={index}
                          className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 border-transparent hover:border-unah-yellow"
                        >
                          <div className="aspect-video relative">
                            <Image
                              src={item.url || "/placeholder.svg"}
                              alt={item.title}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <CardHeader>
                            <CardTitle className="font-college text-lg text-unah-blue">{item.title}</CardTitle>
                            <CardDescription className="font-helvetica">{item.description}</CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="videos">
                  <div className="grid md:grid-cols-2 gap-6">
                    {galleryItems
                      .filter((item) => item.type === "video")
                      .map((item, index) => (
                        <Card
                          key={index}
                          className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 border-transparent hover:border-unah-yellow"
                        >
                          <div className="aspect-video relative">
                            <Image
                              src={item.url || "/placeholder.svg"}
                              alt={item.title}
                              width={500}
                              height={300}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-unah-blue/30">
                              <Play className="h-16 w-16 text-white" />
                            </div>
                          </div>
                          <CardHeader>
                            <CardTitle className="font-college text-xl text-unah-blue">{item.title}</CardTitle>
                            <CardDescription className="font-helvetica">{item.description}</CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        )}

        {/* Referencias Section */}
        {activeSection === "referencias" && (
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-college text-4xl font-bold text-unah-blue mb-4">REFERENCIAS Y ESTUDIOS</h2>
                <p className="font-helvetica text-xl text-gray-600 max-w-2xl mx-auto">
                  Investigaciones, estudios y publicaciones sobre el mercado del software centroamericano
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Publicaciones UNAH */}
                <div className="lg:col-span-2">
                  <Card className="p-6 border-2 border-unah-blue/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-college text-unah-blue">
                        <BookOpen className="h-5 w-5" />
                        Publicaciones UNAH
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="border-l-4 border-unah-blue pl-4">
                          <h4 className="font-college font-bold text-lg text-unah-blue">
                            "Análisis del Mercado del Software en Honduras 2024"
                          </h4>
                          <p className="font-helvetica text-gray-600 mt-2">Revista UNAH de Ingeniería, Vol. 12, 2024</p>
                          <p className="font-helvetica text-sm text-gray-500 mt-1">
                            Autores: Dr. María Rodríguez, Ing. Carlos López, MSc. Ana Martínez
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-unah-blue text-unah-blue hover:bg-unah-blue hover:text-white font-helvetica bg-transparent"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ver Estudio
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-unah-yellow text-unah-blue hover:bg-unah-yellow hover:text-unah-blue font-helvetica bg-transparent"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                          </div>
                        </div>

                        <div className="border-l-4 border-unah-yellow pl-4">
                          <h4 className="font-college font-bold text-lg text-unah-blue">
                            "Ecosistema Emprendedor Tecnológico en Centroamérica"
                          </h4>
                          <p className="font-helvetica text-gray-600 mt-2">Observatorio UNAH, Informe Anual 2024</p>
                          <p className="font-helvetica text-sm text-gray-500 mt-1">Autores: Equipo Observatorio UNAH</p>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-unah-blue text-unah-blue hover:bg-unah-blue hover:text-white font-helvetica bg-transparent"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ver Informe
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-unah-yellow text-unah-blue hover:bg-unah-yellow hover:text-unah-blue font-helvetica bg-transparent"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                          </div>
                        </div>

                        <div className="border-l-4 border-green-600 pl-4">
                          <h4 className="font-college font-bold text-lg text-unah-blue">
                            "Impacto de la Transformación Digital en PYMES Hondureñas"
                          </h4>
                          <p className="font-helvetica text-gray-600 mt-2">
                            Facultad de Ciencias Económicas UNAH, 2024
                          </p>
                          <p className="font-helvetica text-sm text-gray-500 mt-1">
                            Autores: Dr. Luis Fernández, MSc. Carmen Sánchez
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-unah-blue text-unah-blue hover:bg-unah-blue hover:text-white font-helvetica bg-transparent"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ver Investigación
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-unah-yellow text-unah-blue hover:bg-unah-yellow hover:text-unah-blue font-helvetica bg-transparent"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recursos y Enlaces */}
                <div>
                  <Card className="p-6 mb-6 border-2 border-unah-yellow/20">
                    <CardHeader>
                      <CardTitle className="font-college text-unah-blue">Recursos UNAH</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Link
                          href="#"
                          className="flex items-center gap-3 p-3 bg-unah-blue/10 rounded-lg hover:bg-unah-blue/20 transition-colors"
                        >
                          <BookOpen className="h-5 w-5 text-unah-blue" />
                          <div>
                            <div className="font-college font-bold text-unah-blue">Biblioteca Digital</div>
                            <div className="font-helvetica text-sm text-gray-600">Acceso completo</div>
                          </div>
                        </Link>

                        <Link
                          href="#"
                          className="flex items-center gap-3 p-3 bg-unah-yellow/20 rounded-lg hover:bg-unah-yellow/30 transition-colors"
                        >
                          <Search className="h-5 w-5 text-unah-blue" />
                          <div>
                            <div className="font-college font-bold text-unah-blue">Portal de Investigación</div>
                            <div className="font-helvetica text-sm text-gray-600">Buscar estudios</div>
                          </div>
                        </Link>

                        <Link
                          href="#"
                          className="flex items-center gap-3 p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <Users className="h-5 w-5 text-unah-blue" />
                          <div>
                            <div className="font-college font-bold text-unah-blue">Red de Investigadores</div>
                            <div className="font-helvetica text-sm text-gray-600">Conecta con expertos</div>
                          </div>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border-2 border-unah-blue/20">
                    <CardHeader>
                      <CardTitle className="font-college text-unah-blue">Estadísticas del Observatorio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between font-helvetica">
                          <span>Estudios Publicados</span>
                          <span className="font-bold text-unah-blue">45+</span>
                        </div>
                        <div className="flex justify-between font-helvetica">
                          <span>Empresas Analizadas</span>
                          <span className="font-bold text-unah-blue">1,200+</span>
                        </div>
                        <div className="flex justify-between font-helvetica">
                          <span>Investigadores</span>
                          <span className="font-bold text-unah-blue">25</span>
                        </div>
                        <div className="flex justify-between font-helvetica">
                          <span>Colaboraciones Regionales</span>
                          <span className="font-bold text-unah-blue">15+</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-unah-blue text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/logo.png" alt="Radar Digital Logo" width={32} height={32} className="h-8 w-8" />
                <span className="font-college text-xl font-bold">RADAR DIGITAL</span>
              </div>
            </div>

            <div>
              <h4 className="font-college font-bold mb-4">Navegación</h4>
              <ul className="space-y-2 text-gray-300 font-helvetica">
                <li>
                  <button
                    onClick={() => setActiveSection("inicio")}
                    className="hover:text-unah-yellow transition-colors"
                  >
                    Inicio
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveSection("mapa")} className="hover:text-unah-yellow transition-colors">
                    Mapa Industria
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("tendencias")}
                    className="hover:text-unah-yellow transition-colors"
                  >
                    Tendencias
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("noticias")}
                    className="hover:text-unah-yellow transition-colors"
                  >
                    Noticias
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-college font-bold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-300 font-helvetica">
                <li>
                  <button
                    onClick={() => setActiveSection("galeria")}
                    className="hover:text-unah-yellow transition-colors"
                  >
                    Galería
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("referencias")}
                    className="hover:text-unah-yellow transition-colors"
                  >
                    Referencias
                  </button>
                </li>
                <li>
                  <Link href="#" className="hover:text-unah-yellow transition-colors">
                    Investigaciones
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-unah-yellow transition-colors">
                    Eventos
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-college font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-300 font-helvetica">
                <li>observatorio@unah.edu.hn</li>
                <li>+504 2216-3000</li>
                <li>Ciudad Universitaria</li>
                <li>Tegucigalpa, Honduras</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-unah-blue-light mt-8 pt-8 text-center text-gray-300">
            <p className="font-helvetica">
              &copy; 2024 Universidad Nacional Autónoma de Honduras. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
