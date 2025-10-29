# Constructora FJ - Sistema de Gestión Post-Venta

## Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Iniciar la Aplicación

```bash
npm run dev
```

### 3. Iniciar Sesión

- **Login libre**: Ingresa cualquier correo electrónico y contraseña para continuar
- Por ejemplo:
  - Email: `demo@constructorafj.cl` (o cualquier correo)
  - Password: `cualquier-contraseña` (o cualquier texto)

## Datos Cargados

El sistema incluye datos de prueba (mock data):
- **12 propietarios** con información completa
- **12 órdenes de servicio** distribuidas en diferentes estados:
  - Completadas
  - En Proceso
  - Pendientes
  - Cerradas Sin Respuesta

## Características Principales

### Panel de Órdenes
- KPIs con estadísticas en tiempo real
- Tabla interactiva con ordenamiento y filtros
- Búsqueda global
- Filtros avanzados por estado, área, torre y fechas
- Vista detallada de cada orden
- Exportación a CSV
- Paginación (20 órdenes por página)

### Panel de Propietarios
- Vista en tarjetas o tabla
- Información de contacto completa
- Estado de garantía
- Vista detallada con historial

### Panel de Métricas
- Gráfico de tendencia mensual
- Distribución por estado (gráfico circular)
- Distribución por área (gráfico de barras)
- Tabla de rendimiento por área
- Filtros por período
- Exportación de reportes

## Tecnologías Utilizadas

- React 18
- TypeScript
- Tailwind CSS
- Mock Data (Datos de prueba)
- Recharts (Visualización de datos)
- Lucide React (Iconos)

## Características de Seguridad

- Autenticación con localStorage
- Login libre sin restricciones
- Datos de prueba para desarrollo
