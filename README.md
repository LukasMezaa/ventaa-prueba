# Constructora FJ - Sistema de Gestión Post-Venta
### Alto San Miguel I

Sistema profesional de gestión post-venta para propiedades, desarrollado con React, TypeScript y Tailwind CSS.

## Características Principales

### 🏗️ Panel de Órdenes de Servicio
- **KPIs en tiempo real**: Total de órdenes, completadas, en proceso, pendientes y cerradas sin respuesta
- **Tabla interactiva**: Ordenamiento bidireccional por cualquier columna
- **Búsqueda global**: Búsqueda en tiempo real en todos los campos
- **Filtros avanzados**: Por estado, área de especialidad, torre y rango de fechas
- **Vista detallada**: Modal con información completa de cada orden
- **Exportación**: Descarga de datos filtrados en formato CSV
- **Paginación**: 20 órdenes por página

### 👥 Panel de Propietarios
- **Vistas duales**: Modo tarjetas o tabla según preferencia
- **KPIs**: Total de propietarios, garantías activas y vencidas
- **Información completa**: Datos de contacto, propiedad y garantía
- **Estado de garantía**: Visualización clara de años restantes
- **Vista detallada**: Modal con historial completo del propietario

### 📊 Panel de Métricas y Reportes
- **Gráfico de tendencias**: Evolución mensual de órdenes (últimos 12 meses)
- **Distribución por estado**: Gráfico circular interactivo
- **Rendimiento por área**: Gráfico de barras con órdenes por especialidad
- **Tabla de rendimiento**: Análisis detallado por área con porcentajes de completitud
- **Filtros de período**: Mes, trimestre o año
- **Exportación**: Descarga de reportes en formato JSON

## Tecnologías Utilizadas

- **React 18.3**: Framework frontend con hooks modernos
- **TypeScript 5.5**: Tipado estático para mayor seguridad
- **Tailwind CSS 3.4**: Estilos utilitarios y diseño responsive
- **Recharts**: Visualización de datos interactiva
- **Lucide React**: Biblioteca de iconos moderna
- **Vite 5.4**: Build tool ultra-rápido

## Datos de Prueba

El sistema incluye datos de prueba realistas (mock data):
- **12 propietarios** con información completa en español
- **12 órdenes de servicio** distribuidas en diferentes estados:
  - Completadas
  - En Proceso
  - Pendientes
  - Cerradas Sin Respuesta

## Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Iniciar la Aplicación
```bash
npm run dev
```

### 3. Acceder al Sistema
- URL: `http://localhost:5173`
- **Login libre**: Ingresa cualquier correo y contraseña para continuar

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Type checking
npm run typecheck
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── Login.tsx           # Pantalla de autenticación
│   ├── Sidebar.tsx         # Navegación lateral
│   ├── Header.tsx          # Barra superior con búsqueda
│   ├── OrdersPanel.tsx     # Panel de órdenes de servicio
│   ├── OwnersPanel.tsx     # Panel de propietarios
│   └── MetricsPanel.tsx    # Panel de métricas y reportes
├── contexts/
│   └── AuthContext.tsx     # Contexto de autenticación
├── lib/
│   └── mockData.ts         # Datos de prueba mock
├── App.tsx                 # Componente principal
├── main.tsx                # Punto de entrada
└── index.css               # Estilos globales
```

## Características de Diseño

### Paleta de Colores Corporativa
- **Petrol Blue**: `#2B5F7F` - Color primario
- **Green**: `#00B050` - Color secundario/acento

### Principios de Diseño
- SaaS moderno inspirado en Notion/Linear
- Glassmorphism sutil en modales
- Animaciones suaves y micro-interacciones
- Responsive design (optimizado para desktop)
- Scrollbars personalizados
- Estados de hover y loading

### Tipografía
- Font stack del sistema con antialiasing
- Jerarquía clara con pesos variables
- Espaciado generoso (sistema de 8px)

## Funcionalidades Destacadas

### Login Libre
- Puedes ingresar con cualquier correo y contraseña
- Sesión persistente con localStorage
- No requiere configuración externa

### Búsqueda Inteligente
- Búsqueda en tiempo real sin delay perceptible
- Busca en múltiples campos simultáneamente
- Compatible con filtros avanzados

### Filtros Combinables
- Múltiples filtros pueden aplicarse simultáneamente
- Estado, área, torre y fechas
- Limpiar todos con un clic

### Ordenamiento Dinámico
- Click en cualquier columna para ordenar
- Indicador visual de dirección (ASC/DESC)
- Mantiene filtros aplicados

### Exportación de Datos
- CSV para órdenes con todos los campos
- JSON para reportes de métricas
- Nombres de archivo con timestamp

## Datos Mock

El sistema utiliza datos mock almacenados en `src/lib/mockData.ts`. Estos datos incluyen:

- Órdenes de servicio con diferentes estados
- Propietarios con información completa
- Tipos TypeScript para mantener la estructura de datos

## Próximas Mejoras Sugeridas

- [ ] Sistema de notificaciones push
- [ ] Dashboard personalizable
- [ ] Envío de emails automáticos
- [ ] App móvil con React Native
- [ ] Integración con WhatsApp Business API
- [ ] Generación de PDFs para reportes
- [ ] Sistema de roles y permisos
- [ ] Historial de cambios (audit log)

## Soporte

Para consultas o soporte técnico, contactar al equipo de desarrollo.

---

**Desarrollado para Constructora FJ - Alto San Miguel I**
*Sistema de Gestión Post-Venta v1.0 - Mock Data Version*
