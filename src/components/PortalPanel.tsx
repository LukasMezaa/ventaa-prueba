import { Home, FileText, Calendar, Bell, User, Ticket, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Ticket as TicketType, mockTickets } from '../lib/mockData';

interface PortalPanelProps {
  onNavigate: (section: string) => void;
}

export default function PortalPanel({ onNavigate }: PortalPanelProps) {
  const { user } = useAuth();
  const isPropietario = user?.role === 'propietario';
  const isAdmin = user?.role === 'admin';
  
  // Cargar tickets para calcular estadísticas
  const loadTickets = (): TicketType[] => {
    const stored = localStorage.getItem('tickets');
    if (stored) {
      return JSON.parse(stored);
    }
    return mockTickets;
  };
  
  const [tickets, setTickets] = useState<TicketType[]>(loadTickets());
  
  // Escuchar actualizaciones de tickets
  useEffect(() => {
    const handleTicketsUpdate = (event: CustomEvent) => {
      const updatedTickets = event.detail;
      setTickets(updatedTickets);
    };

    window.addEventListener('ticketsUpdated', handleTicketsUpdate as EventListener);
    
    // También cargar tickets al montar el componente
    const stored = localStorage.getItem('tickets');
    if (stored) {
      setTickets(JSON.parse(stored));
    }
    
    return () => {
      window.removeEventListener('ticketsUpdated', handleTicketsUpdate as EventListener);
    };
  }, []);
  
  // Calcular tickets activos del propietario (Pendientes y Aprobados)
  const activeTicketsCount = isPropietario 
    ? tickets.filter(t => {
        // Comparar por RUT si está disponible (más confiable)
        if (user?.rut && t.ownerRut) {
          const normalizeRut = (rut: string) => {
            return rut.replace(/\./g, '').replace(/\s/g, '').toLowerCase().trim();
          };
          return normalizeRut(t.ownerRut) === normalizeRut(user.rut) && 
                 (t.status === 'Pendiente' || t.status === 'Aprobado');
        }
        // Fallback: comparar por email si no hay RUT
        return t.ownerEmail === user?.email && 
               (t.status === 'Pendiente' || t.status === 'Aprobado');
      }).length
    : 2; // Para admin, mantener el valor hardcodeado

  const menuOptions = [
    {
      id: 'tickets',
      section: 'tickets',
      title: 'Mis Tickets',
      description: 'Ver y crear tickets de servicio',
      icon: Ticket,
      color: 'bg-blue-500',
    },
    {
      id: 'trazability',
      section: 'trazability',
      title: 'Trazabilidad',
      description: 'Ver el estado de mis tickets',
      icon: Activity,
      color: 'bg-green-500',
      propietarioOnly: true,
    },
    {
      id: 'notifications',
      section: 'notifications',
      title: 'Notificaciones',
      description: 'Ver alertas y avisos',
      icon: Bell,
      color: 'bg-yellow-500',
      hideForPropietario: true,
    },
    {
      id: 'profile',
      section: 'portal',
      title: 'Mi Perfil',
      description: 'Datos personales y propiedades',
      icon: User,
      color: 'bg-purple-500',
      hideForPropietario: true,
    },
  ].filter(option => {
    // Ocultar opciones para propietarios según configuración
    if (isPropietario && option.hideForPropietario) return false;
    // Mostrar solo opciones de propietario si es propietario
    if (isPropietario && !option.propietarioOnly && (option.id === 'appointments')) return false;
    // Mostrar solo para propietarios si tiene propietarioOnly
    if (!isPropietario && option.propietarioOnly) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header del Portal */}
      <div className="bg-gradient-to-r from-[#2B5F7F] to-[#00B050] rounded-xl p-6 sm:p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Home className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              {isAdmin ? 'Portal de Administrador' : 'Portal del Propietario'}
            </h1>
            <p className="text-white/90">Bienvenido a Sistema Post-Venta</p>
          </div>
        </div>
      </div>

      {/* Información del Usuario */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Información de Usuario</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
            <p className="text-gray-900">Juan Pérez</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <p className="text-gray-900">juan.perez@email.com</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Propiedad</label>
            <p className="text-gray-900">Torre A - Departamento 101</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Estado de Garantía</label>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Activa
            </span>
          </div>
        </div>
      </div>

      {/* Opciones del Portal */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Opciones Disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                onClick={() => onNavigate(option.section)}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{option.title}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumen Rápido */}
      <div className={`grid grid-cols-1 gap-4 ${isPropietario ? 'sm:grid-cols-1' : 'sm:grid-cols-3'}`}>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {isPropietario ? 'Tickets Activos' : 'Solicitudes Activas'}
              </p>
              <p className="text-3xl font-bold text-gray-800">{activeTicketsCount}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        {!isPropietario && (
          <>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Visitas Programadas</p>
                  <p className="text-3xl font-bold text-gray-800">1</p>
                </div>
                <Calendar className="w-10 h-10 text-green-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Notificaciones</p>
                  <p className="text-3xl font-bold text-gray-800">3</p>
                </div>
                <Bell className="w-10 h-10 text-yellow-500 opacity-20" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

