import { Home, FileText, Calendar, Bell, User } from 'lucide-react';

export default function PortalPanel() {
  const menuOptions = [
    {
      id: 'requests',
      title: 'Mis Solicitudes',
      description: 'Ver y crear solicitudes de servicio',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      id: 'appointments',
      title: 'Agendar Visita',
      description: 'Programar una visita técnica',
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      description: 'Ver alertas y avisos',
      icon: Bell,
      color: 'bg-yellow-500',
    },
    {
      id: 'profile',
      title: 'Mi Perfil',
      description: 'Datos personales y propiedades',
      icon: User,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header del Portal */}
      <div className="bg-gradient-to-r from-[#2B5F7F] to-[#00B050] rounded-xl p-6 sm:p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Home className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Portal del Propietario</h1>
            <p className="text-white/90">Bienvenido a Alto San Miguel II</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Solicitudes Activas</p>
              <p className="text-3xl font-bold text-gray-800">2</p>
            </div>
            <FileText className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

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
      </div>
    </div>
  );
}

