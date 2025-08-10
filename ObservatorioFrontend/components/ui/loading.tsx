import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

// Componente de carga
export function LoadingSpinner({ size = "default", text = "Cargando..." }: { size?: "sm" | "default" | "lg", text?: string }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-unah-blue`} />
      <p className="text-sm text-gray-600 font-helvetica">{text}</p>
    </div>
  );
}

// Componente de error con opción de reintentar
export function ErrorDisplay({ 
  error, 
  onRetry, 
  title = "Error al cargar los datos",
  showRetry = true 
}: { 
  error: string | null, 
  onRetry?: () => void,
  title?: string,
  showRetry?: boolean
}) {
  if (!error) return null;

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-red-800 font-college">{title}</h3>
        <p className="text-sm text-red-600 font-helvetica mt-2">{error}</p>
      </div>
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry} 
          variant="outline" 
          className="border-red-300 text-red-700 hover:bg-red-100"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      )}
    </div>
  );
}

// Componente de estado vacío
export function EmptyState({ 
  title, 
  description, 
  icon: Icon, 
  action 
}: { 
  title: string, 
  description: string, 
  icon: any, 
  action?: React.ReactNode 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-gray-50 border border-gray-200 rounded-lg">
      <Icon className="h-16 w-16 text-gray-400" />
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 font-college">{title}</h3>
        <p className="text-sm text-gray-600 font-helvetica mt-2 max-w-md">{description}</p>
      </div>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}

// Componente de skeleton para carga
export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      {...props}
    />
  );
}

// Skeleton para tarjetas
export function CardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-6 space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

// Skeleton para gráficos
export function ChartSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

// Skeleton para listas
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
