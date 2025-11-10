# 1.6 REQUISITOS DEL CLIENTE

## Constructora FJ - Sistema de Gestión Post-Venta
### Alto San Miguel I

---

## 1.5 Consideraciones

### 1.5.1 Supuestos
- Constructora FJ entrega el catastro actualizado de propietarios, tickets y garantías en formato digital para cargarlo en el sistema.
- Los usuarios finales cuentan con conexión estable a internet y navegadores modernos (Chrome, Edge, Firefox o Safari) para acceder a la plataforma.
- Se definirá un administrador interno responsable de gestionar usuarios y parametrizaciones iniciales.
- El equipo de desarrollo dispone de acceso a lineamientos de marca, logos y contenido oficial que se mostrará en la interfaz.
- Las áreas técnicas (carpintería, gasfitería, electricidad, etc.) mantienen disponibilidad para validar flujos y reglas de negocio.
- Las comunicaciones automáticas con propietarios se realizan inicialmente vía correo electrónico; la integración con WhatsApp se considera para una fase posterior.

### 1.5.2 Restricciones del proyecto
- Plazo máximo de 16 semanas para completar el alcance definido.
- Presupuesto acotado a un equipo base de cuatro roles (Full Stack, UI/UX, QA, Project Manager).
- Alcance enfocado en una versión web demo con mock data; la construcción de un backend productivo queda fuera de esta etapa.
- Dependencia de la disponibilidad de stakeholders para revisiones y aprobaciones quincenales.

### 1.5.3 Restricciones del producto
- Tecnologías definidas: React 18.3, TypeScript 5.5, Tailwind CSS 3.4, Vite 5.4 y Recharts.
- Persistencia basada en datos mock durante la demo; no incluye integración con ERP o sistemas legados.
- Autenticación y notificaciones simuladas mediante mecanismos locales (sin integración con correo ni SMS en esta versión).
- Enfoque primario en experiencia desktop responsiva; optimización móvil nativa queda para fases posteriores.

### 1.5.4 Riesgos del proyecto
- Cambios de alcance o nuevas funcionalidades solicitadas a mitad del desarrollo que impacten el plan.
- Retrasos en la provisión de información (catastros, flujos aprobados, material gráfico) por parte del cliente.
- Limitada disponibilidad de usuarios clave para sesiones de validación y pruebas de aceptación.
- Dependencia de un equipo reducido; la ausencia prolongada de algún rol crítico puede afectar el cronograma.

### 1.5.5 Riesgos del producto
- Ausencia de integraciones reales podría limitar la adopción final si no se planifica una fase de backend.
- Modelo de autenticación básico aumenta la superficie de riesgo en entornos productivos si no se refuerza seguridad.
- Dependencia total de conexión a internet; no se contempla modo offline.
- Posible resistencia de usuarios si no se ejecuta un plan de capacitación y gestión del cambio.

---

## 2.5.1 Especificaciones funcionales

### ADMINISTRADOR:

1. **REQUERIMIENTO_F_1: Gestión de Propietarios**
   • FUNCIONALIDAD_F_1.1: Crear propietarios con información completa (nombre, RUT, teléfono, torre, número departamento, dirección municipal, email, fecha de recepción, estado de garantía)
   • FUNCIONALIDAD_F_1.2: Leer y consultar información de propietarios con búsqueda rápida y filtros avanzados
   • FUNCIONALIDAD_F_1.3: Actualizar datos de propietarios existentes
   • FUNCIONALIDAD_F_1.4: Eliminar propietarios del sistema
   • FUNCIONALIDAD_F_1.5: Exportación de datos de propietarios (CSV, JSON)
   • FUNCIONALIDAD_F_1.6: Visualización en modo tarjetas o tabla
   • FUNCIONALIDAD_F_1.7: Asociar múltiples propiedades a un mismo propietario, incluyendo unidades en distintos proyectos inmobiliarios.

2. **REQUERIMIENTO_F_2: Recepción y Registro de Solicitudes**
   • FUNCIONALIDAD_F_2.1: Ingreso manual de solicitudes desde el portal administrativo
   • FUNCIONALIDAD_F_2.2: Asignación automática de número de orden a cada solicitud
   • FUNCIONALIDAD_F_2.3: Registro de observaciones y descripción del problema reportado por el propietario
   • FUNCIONALIDAD_F_2.4: Fecha de ingreso automática del sistema
   • FUNCIONALIDAD_F_2.5: Asignación inicial de estado "Pendiente de visita"
   • FUNCIONALIDAD_F_2.6: Registro del área específica de la vivienda asociada a la solicitud (cocina, baño, dormitorio, living, etc.).
   • FUNCIONALIDAD_F_2.7: Registro de la especialidad requerida para la atención (carpintería, gasfitería, electricidad, pintura, etc.).
   • FUNCIONALIDAD_F_2.8: Marcado de solicitudes como "Pre-entrega" para distinguir incidencias previas a la entrega formal de la propiedad.

3. **REQUERIMIENTO_F_3: Sistema de Agendamiento**
   • FUNCIONALIDAD_F_3.1: Calendario interactivo con disponibilidad de la empresa
   • FUNCIONALIDAD_F_3.2: Selección de día y horario disponible para programar visitas
   • FUNCIONALIDAD_F_3.3: Programación de primera visita y trabajos de ejecución
   • FUNCIONALIDAD_F_3.4: Alertas automáticas de citas programadas
   • FUNCIONALIDAD_F_3.5: Reprogramación de visitas existentes
   • FUNCIONALIDAD_F_3.6: Lista completa de citas programadas con filtros

4. **REQUERIMIENTO_F_4: Seguimiento y Control de Trabajos**
   • FUNCIONALIDAD_F_4.1: Cambio de estados con justificación (Pendiente de visita, En ejecución, Terminada, No aplica)
   • FUNCIONALIDAD_F_4.2: Registro automático de fecha y hora de cada cambio de estado
   • FUNCIONALIDAD_F_4.3: Bitácora de actividades diarias por cada trabajo
   • FUNCIONALIDAD_F_4.4: Detalle completo de trabajos realizados
   • FUNCIONALIDAD_F_4.5: Subida de documentos al finalizar trabajos (fotos, reportes, certificados)
   • FUNCIONALIDAD_F_4.6: Registro y desglose de costos de reparación asociados a cada trabajo (materiales, mano de obra, terceros).
   • FUNCIONALIDAD_F_4.7: Gestión de nuevos estados operativos, incluyendo "Visita técnica programada" y "Cierre temporal - propietario ausente" con sus respectivas justificaciones.

5. **REQUERIMIENTO_F_5: Dashboard y Reportes Ejecutivos**
   • FUNCIONALIDAD_F_5.1: Resumen ejecutivo con cantidad de trabajos en ejecución, pendientes y cerradas
   • FUNCIONALIDAD_F_5.2: Estadísticas de incidencias por tipo de problema
   • FUNCIONALIDAD_F_5.3: Análisis de incidencias por periodo (diario, semanal, mensual)
   • FUNCIONALIDAD_F_5.4: Análisis de tendencias mensuales con gráficos interactivos
   • FUNCIONALIDAD_F_5.5: Identificación de problemas recurrentes
   • FUNCIONALIDAD_F_5.6: Exportación de reportes en formatos CSV y JSON

6. **REQUERIMIENTO_F_6: Administración de Usuarios y Permisos**
   • FUNCIONALIDAD_F_6.1: Gestión completa de usuarios del sistema (crear, editar, eliminar)
   • FUNCIONALIDAD_F_6.2: Asignación de roles (Administrador, Propietario, Técnico)
   • FUNCIONALIDAD_F_6.3: Control de acceso por rol con validación de permisos
   • FUNCIONALIDAD_F_6.4: Configuración detallada de permisos y roles
   • FUNCIONALIDAD_F_6.5: Visualización de usuarios activos y último acceso

7. **REQUERIMIENTO_F_7: Sistema de Notificaciones**
   • FUNCIONALIDAD_F_7.1: Gestión de alertas de nuevas solicitudes
   • FUNCIONALIDAD_F_7.2: Recordatorios automáticos de visitas programadas
   • FUNCIONALIDAD_F_7.3: Notificaciones de cambio de estado en trabajos
   • FUNCIONALIDAD_F_7.4: Centro de configuración de alertas y preferencias
   • FUNCIONALIDAD_F_7.5: Envío automático de correo electrónico al propietario una vez coordinada la visita con el administrador.

### PROPIETARIO:

8. **REQUERIMIENTO_F_8: Portal de Acceso Personalizado**
   • FUNCIONALIDAD_F_8.1: Acceso web al portal personalizado con información de su propiedad
   • FUNCIONALIDAD_F_8.2: Resumen del usuario con datos de contacto y ubicación
   • FUNCIONALIDAD_F_8.3: Navegación rápida a diferentes secciones del sistema
   • FUNCIONALIDAD_F_8.4: Resumen de solicitudes activas, visitas programadas y notificaciones
   • FUNCIONALIDAD_F_8.5: Selección y navegación entre múltiples propiedades y proyectos asociados al propietario.

9. **REQUERIMIENTO_F_9: Creación y Gestión de Solicitudes**
   • FUNCIONALIDAD_F_9.1: Crear solicitudes de servicio desde el portal del propietario
   • FUNCIONALIDAD_F_9.2: Ingreso automático de solicitudes con asignación automática de número de orden
   • FUNCIONALIDAD_F_9.3: Registro de observaciones y descripción detallada del problema
   • FUNCIONALIDAD_F_9.4: Subida de fotos como evidencia del problema
   • FUNCIONALIDAD_F_9.5: Selección de área afectada (dormitorio, baño, living, cocina, etc.) y especialidad requerida para la atención (carpintería, gasfitería, electricidad, etc.)
   • FUNCIONALIDAD_F_9.6: Asociación de la solicitud a la propiedad y proyecto específicos del propietario.
   • FUNCIONALIDAD_F_9.7: Creación de tickets de pre-entrega para reportar incidencias generales antes de la entrega formal de la propiedad.

10. **REQUERIMIENTO_F_10: Trazabilidad y Seguimiento**
    • FUNCIONALIDAD_F_10.1: Ver historial completo de todas sus solicitudes
    • FUNCIONALIDAD_F_10.2: Consultar estado actual de cada solicitud en tiempo real
    • FUNCIONALIDAD_F_10.3: Visualizar fechas de agendamiento y visitas programadas
    • FUNCIONALIDAD_F_10.4: Ver actualizaciones y cambios de estado en tiempo real
    • FUNCIONALIDAD_F_10.5: Acceso a documentos y reportes relacionados con sus solicitudes
    • FUNCIONALIDAD_F_10.6: Visualización de nuevos estados operativos, incluyendo "Visita técnica programada" y "Cierre temporal - propietario ausente".

11. **REQUERIMIENTO_F_11: Sistema de Tickets**
    • FUNCIONALIDAD_F_11.1: Visualización de todos sus tickets creados
    • FUNCIONALIDAD_F_11.2: Filtrado de tickets por estado (Pendiente, En ejecución, Terminada, etc.)
    • FUNCIONALIDAD_F_11.3: Búsqueda de tickets por número de orden o descripción
    • FUNCIONALIDAD_F_11.4: Vista detallada de cada ticket con historial completo de cambios
    • FUNCIONALIDAD_F_11.5: Identificación y filtrado de tickets de pre-entrega frente a tickets post-venta tradicionales.

### TÉCNICO:

12. **REQUERIMIENTO_F_12: Visualización de Trabajos Asignados**
    • FUNCIONALIDAD_F_12.1: Acceso a lista de solicitudes/tickets asignados al técnico
    • FUNCIONALIDAD_F_12.2: Filtrado por estado y área de especialidad (Carpintería, Gasfitería, General)
    • FUNCIONALIDAD_F_12.3: Visualización de detalles completos de cada trabajo asignado
    • FUNCIONALIDAD_F_12.4: Información del propietario y ubicación de la propiedad
    • FUNCIONALIDAD_F_12.5: Identificación de la propiedad y proyecto asociados a cada ticket asignado.

13. **REQUERIMIENTO_F_13: Actualización de Estados de Trabajos**
    • FUNCIONALIDAD_F_13.1: Cambio de estado de trabajos (Pendiente de visita → En ejecución → Terminada)
    • FUNCIONALIDAD_F_13.2: Registro de justificaciones obligatorias para cada cambio de estado
    • FUNCIONALIDAD_F_13.3: Registro automático de fecha y hora de cambios de estado
    • FUNCIONALIDAD_F_13.4: Actualización de bitácora de actividades con cada cambio
    • FUNCIONALIDAD_F_13.5: Manejo de estados adicionales para visitas técnicas y cierres temporales (propietario ausente) con causales documentadas.

14. **REQUERIMIENTO_F_14: Registro de Avances y Actividades**
    • FUNCIONALIDAD_F_14.1: Registro de actividades diarias realizadas en cada trabajo
    • FUNCIONALIDAD_F_14.2: Detalle de trabajos realizados en cada visita programada
    • FUNCIONALIDAD_F_14.3: Subida de documentos (fotos, reportes, certificados)
    • FUNCIONALIDAD_F_14.4: Registro de materiales utilizados y horas trabajadas
    • FUNCIONALIDAD_F_14.5: Carga de costos estimados y finales (materiales y mano de obra) asociados a cada actividad ejecutada.

15. **REQUERIMIENTO_F_15: Comunicación y Coordinación**
    • FUNCIONALIDAD_F_15.1: Acceso a información de contacto del propietario
    • FUNCIONALIDAD_F_15.2: Comunicación directa para coordinación de visitas
    • FUNCIONALIDAD_F_15.3: Registro de observaciones y comentarios del trabajo realizado

---

## 2.5.2 Especificaciones no funcionales

### **REQUERIMIENTO_NF_1 - Rendimiento y Escalabilidad**:
   • Tiempo de respuesta: El sistema debe responder a las peticiones del usuario en menos de 2 segundos para operaciones estándar y menos de 5 segundos para consultas complejas o reportes
   • Capacidad de usuarios concurrentes: Soporte mínimo de 50 usuarios concurrentes sin degradación del rendimiento
   • Almacenamiento: Sistema debe soportar mínimo 10,000 propietarios y 50,000 órdenes de servicio sin afectar el rendimiento
   • Optimización: Carga inicial de la aplicación en menos de 3 segundos, paginación eficiente para listas grandes (20-50 elementos por página)

### **REQUERIMIENTO_NF_2 - Seguridad y Accesibilidad**:
   • Autenticación: Sistema de login seguro con validación de credenciales (RUT y contraseña), sesiones persistentes con control de tiempo de expiración, gestión de permisos por rol de usuario
   • Control de acceso: Restricción de acceso según roles (Administrador, Propietario, Técnico), validación de permisos en cada operación sensible, registro de acciones críticas (auditoría)
   • Protección de datos: Encriptación de datos sensibles, respaldo automático de información crítica, cumplimiento de normativas de protección de datos personales
   • Accesibilidad: Diseño responsive para desktop, tablet y móvil, interfaz intuitiva y fácil de usar, soporte para navegadores modernos (Chrome, Firefox, Edge, Safari)

### **REQUERIMIENTO_NF_3 - Disponibilidad y Confiabilidad**:
   • Tiempo de actividad: Sistema disponible 99% del tiempo (máximo 7.2 horas de inactividad por mes), recuperación rápida ante fallos (menos de 1 hora)
   • Tolerancia a fallos: Sistema debe ser resiliente ante fallos de red o servidor, datos críticos deben persistirse incluso ante interrupciones
   • Respaldo de datos: Respaldo automático diario de la base de datos, capacidad de recuperación ante pérdida de datos

### **REQUERIMIENTO_NF_4 - Mantenibilidad y Escalabilidad**:
   • Código limpio: Desarrollo con TypeScript para tipado estático, arquitectura modular y componentes reutilizables, documentación técnica completa
   • Tecnologías modernas: React 18.3 con hooks modernos, Tailwind CSS para estilos consistentes, Vite para builds rápidos
   • Escalabilidad futura: Arquitectura preparada para integraciones futuras (WhatsApp Business API, emails automáticos, app móvil), estructura de datos extensible para nuevas funcionalidades

---

## 1.7 Hitos del Proyecto

### 1.6.1 Avances

| # | Hito | Descripción |
|---|------|-------------|
| 1 | **HITO_1: Diseño y Arquitectura** | Diseño de la arquitectura del sistema, definición de estructura de datos, diseño de interfaces de usuario (UI/UX), creación de paleta de colores corporativa, definición de roles y permisos |
| 2 | **HITO_2: Desarrollo del Módulo de Autenticación y Roles** | Implementación del sistema de login con validación de RUT, gestión de sesiones, contexto de autenticación, control de acceso por roles, panel de administración de usuarios |
| 3 | **HITO_3: Módulo de Gestión de Propietarios** | CRUD completo de propietarios, búsqueda y filtrado, vistas en tarjetas y tabla, exportación de datos, validación de información |
| 4 | **HITO_4: Sistema de Tickets y Solicitudes** | Recepción de solicitudes (automática y manual), asignación de números de orden, estados de tickets, sistema de búsqueda y filtrado, asignación de técnicos |
| 5 | **HITO_5: Módulo de Agendamiento** | Calendario interactivo, programación de visitas, gestión de disponibilidad, alertas de citas, reprogramación de visitas |
| 6 | **HITO_6: Seguimiento de Trabajos** | Control de estados de trabajos, bitácora de actividades, registro de avances, subida de documentos, cambio de estados con justificación |
| 7 | **HITO_7: Dashboard y Reportes** | KPIs y métricas en tiempo real, gráficos de tendencias, análisis por área y estado, exportación de reportes (CSV, JSON), filtros avanzados |
| 8 | **HITO_8: Portal del Propietario** | Interfaz personalizada para propietarios, creación de solicitudes, trazabilidad de tickets, visualización de historial, notificaciones |
| 9 | **HITO_9: Panel de Técnicos** | Visualización de trabajos asignados, actualización de estados, registro de avances, comunicación con administración, subida de documentos |
| 10 | **HITO_10: Sistema de Notificaciones** | Alertas de nuevas solicitudes, recordatorios de visitas, notificaciones de cambios de estado, centro de configuración |
| 11 | **HITO_11: Testing y Optimización** | Pruebas unitarias y de integración, pruebas de rendimiento, corrección de bugs, optimización de código, pruebas de usuario |
| 12 | **HITO_12: Despliegue y Documentación** | Configuración de ambiente de producción, despliegue del sistema, documentación técnica y de usuario, capacitación a usuarios finales |

---

## 1.8 Estimaciones del Proyecto

### 1.8.1 Duración del proyecto en semanas
**16 semanas** (4 meses)

### 1.8.2 Plazo total estimado
**16 semanas** (aproximadamente 4 meses calendario)

### 1.8.3 Esfuerzo total estimado en HH (Horas Hombre)

| Rol | Descripción | Cantidad de Horas |
|-----|-------------|-------------------|
| **Desarrollador Full Stack Senior** | Desarrollo completo del sistema (frontend y lógica de negocio), arquitectura, integraciones | 320 horas |
| **Diseñador UI/UX** | Diseño de interfaces, experiencia de usuario, paleta de colores, prototipos | 80 horas |
| **QA/Tester** | Pruebas funcionales, pruebas de rendimiento, testing de usuario, reporte de bugs | 60 horas |
| **Project Manager** | Gestión del proyecto, coordinación, seguimiento de hitos, comunicación con cliente | 40 horas |
| **Total del Proyecto** | | **500 horas** |

### 1.8.4 Desglose de horas por fase

| Fase | Descripción | Horas Estimadas |
|------|-------------|-----------------|
| **Fase 1: Análisis y Diseño** | Reuniones con cliente, análisis de requisitos, diseño de arquitectura, diseño UI/UX | 100 horas |
| **Fase 2: Desarrollo Frontend** | Desarrollo de componentes React, implementación de funcionalidades, integración de librerías | 200 horas |
| **Fase 3: Lógica de Negocio y Estado** | Implementación de contexto de autenticación, gestión de estado, validaciones, reglas de negocio | 80 horas |
| **Fase 4: Testing y Optimización** | Pruebas unitarias, pruebas de integración, corrección de bugs, optimización | 60 horas |
| **Fase 5: Documentación y Despliegue** | Documentación técnica, manual de usuario, configuración de producción, capacitación | 60 horas |

### 1.8.5 Esfuerzo por módulo principal

| Módulo | Horas Estimadas |
|--------|-----------------|
| Autenticación y Roles | 40 horas |
| Gestión de Propietarios | 60 horas |
| Sistema de Tickets/Solicitudes | 80 horas |
| Agendamiento | 50 horas |
| Seguimiento de Trabajos | 70 horas |
| Dashboard y Reportes | 60 horas |
| Portal del Propietario | 50 horas |
| Panel de Técnicos | 40 horas |
| Notificaciones | 30 horas |
| Testing y QA | 60 horas |
| Documentación | 20 horas |

---

## Resumen Ejecutivo

El Sistema de Gestión Post-Venta para Constructora FJ es una plataforma web integral desarrollada con tecnologías modernas (React, TypeScript, Tailwind CSS) que permite gestionar de manera eficiente todo el ciclo de vida de las solicitudes de servicio post-venta, desde la creación de la solicitud hasta su finalización, incluyendo el seguimiento, agendamiento y reportes.

El sistema está diseñado para tres tipos principales de usuarios:
- **Administradores**: Control total del sistema con todas las funcionalidades de gestión
- **Propietarios**: Acceso limitado para crear solicitudes y hacer seguimiento de sus tickets
- **Técnicos**: Acceso a trabajos asignados para actualizar estados y registrar avances

**Tecnologías Principales:**
- React 18.3
- TypeScript 5.5
- Tailwind CSS 3.4
- Vite 5.4
- Recharts (visualización de datos)
- Lucide React (iconos)

**Estimación Total:**
- Duración: 16 semanas (4 meses)
- Esfuerzo: 500 horas-hombre
- Equipo: 1 Desarrollador Full Stack Senior, 1 Diseñador UI/UX, 1 QA/Tester, 1 Project Manager

---

*Documento generado para Constructora FJ - Alto San Miguel I*
*Fecha: 2024*
*Versión: 1.0*

