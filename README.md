# Constructora FJ - Sistema de Gestión Post-Venta
### Alto San Miguel I

Sistema DEMO de gestión post-venta para propiedades, desarrollado con React, TypeScript y Tailwind CSS. Este es un sistema de demostración que muestra todas las funcionalidades principales del sistema.

## Características Principales

### 🏠 Portal del Propietario
- **Acceso web** a todos los módulos del sistema
- **Resumen del usuario** con información de propiedad
- **Navegación rápida** a diferentes secciones
- **Resumen de solicitudes activas**, visitas programadas y notificaciones

### 👥 Gestión de Propietarios (COMPLETAMENTE FUNCIONAL)
- **CRUD completo**: Crear, leer, actualizar y eliminar propietarios
- **Base de datos con**: nombre, teléfono, torre, número departamento, dirección municipal
- **Búsqueda rápida** de propietarios
- **Actualización de datos** 
- **Identificación única** por propietario
- **Vistas duales**: Modo tarjetas o tabla
- **Exportación** de datos

### 📅 Sistema de Agendamiento
- **Calendario** con disponibilidad de la empresa
- **Selección de día y horario** disponible
- **Programación de primera visita** y trabajos de ejecución
- **Alertas automáticas** de citas programadas
- **Reprogramación de visitas**
- **Lista de citas programadas**

### 📝 Recepción y Registro de Solicitudes
- **Ingreso automático** desde portal del propietario
- **Ingreso manual** por secretaria
- **Asignación automática** de número de orden
- **Registro de observaciones** del propietario
- **Fecha de ingreso automática**
- **Estado inicial**: "Pendiente de visita"

### 🔧 Seguimiento de Trabajos
- **Estados del proceso**: Pendiente de visita, En ejecución, Terminada, No aplica
- **Cambio de estados** con justificación
- **Registro de fecha** de cada cambio de estado
- **Bitácora de actividades** diarias
- **Detalle de trabajos** realizados
- **Subida de documentos** al finalizar

### 📊 Dashboard y Reportes (Visual)
- **Resumen ejecutivo**: Cantidad en ejecución, pendientes, cerradas
- **Estadísticas de incidencias**: Por tipo de problema, por periodo
- **Análisis de tendencias** mensuales
- **Identificación de problemas recurrentes**
- **Exportación de reportes**

### 🔔 Notificaciones (Visual)
- **Alertas de nuevas solicitudes**
- **Recordatorios de visitas** programadas
- **Notificaciones de cambio** de estado
- **Alertas de mensajes** nuevos en chat
- **Centro de configuración** de alertas

### ⚙️ Administración y Permisos
- **Roles de usuario**: Propietario (lectura/ingreso), Administrador
- **Control de acceso** por rol
- **Gestión de usuarios**
- **Configuración del sistema**
- **Actualización centralizada** por encargado de postventa

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
│   ├── Login.tsx               # Pantalla de autenticación
│   ├── Sidebar.tsx             # Navegación lateral
│   ├── Header.tsx              # Barra superior con búsqueda
│   ├── PortalPanel.tsx         # Portal del propietario
│   ├── OwnersPanel.tsx         # Gestión de propietarios (CRUD funcional)
│   ├── SchedulingPanel.tsx     # Sistema de agendamiento
│   ├── RequestsPanel.tsx       # Recepción de solicitudes
│   ├── TrackingPanel.tsx       # Seguimiento de trabajos
│   ├── DashboardPanel.tsx      # Dashboard y reportes
│   ├── NotificationsPanel.tsx  # Sistema de notificaciones
│   └── AdminPanel.tsx          # Administración y permisos
├── contexts/
│   └── AuthContext.tsx         # Contexto de autenticación
├── lib/
│   └── mockData.ts             # Datos de prueba mock
├── App.tsx                     # Componente principal
├── main.tsx                    # Punto de entrada
└── index.css                   # Estilos globales
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
