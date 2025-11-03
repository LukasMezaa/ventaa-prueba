import { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMenuClick: () => void;
}

export default function Header({ title, searchQuery, onSearchChange, onMenuClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 lg:left-[230px] right-0 z-30 transition-all duration-300">
      <div className="h-full px-3 sm:px-4 md:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar..."
              className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 w-48 sm:w-64 md:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          {/* Búsqueda móvil simplificada */}
          <div className="relative sm:hidden">
            <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar..."
              className="pl-8 pr-3 py-2 w-28 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications((v) => !v)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-40">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">Notificaciones</span>
                  <button className="text-xs text-[#2B5F7F] hover:underline" onClick={() => setShowNotifications(false)}>Cerrar</button>
                </div>
                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-200">
                  <li className="p-3 hover:bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">Nueva Solicitud</p>
                    <p className="text-xs text-gray-600 mt-0.5">Se ha recibido una nueva solicitud de Juan Pérez para plomería</p>
                    <p className="text-[11px] text-gray-500 mt-1">2024-10-10 09:30</p>
                  </li>
                  <li className="p-3 hover:bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">Recordatorio de Visita</p>
                    <p className="text-xs text-gray-600 mt-0.5">Visita programada para hoy a las 11:00 con María González</p>
                    <p className="text-[11px] text-gray-500 mt-1">2024-10-10 08:00</p>
                  </li>
                  <li className="p-3 hover:bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">Cambio de Estado</p>
                    <p className="text-xs text-gray-600 mt-0.5">La orden ORD-2024-001 ha cambiado a "En Ejecución"</p>
                    <p className="text-[11px] text-gray-500 mt-1">2024-10-09 16:45</p>
                  </li>
                  <li className="p-3 hover:bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">Mensaje Nuevo</p>
                    <p className="text-xs text-gray-600 mt-0.5">Mensaje de Carlos Rodríguez sobre su solicitud pendiente</p>
                    <p className="text-[11px] text-gray-500 mt-1">2024-10-09 14:20</p>
                  </li>
                  <li className="p-3 hover:bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">Avance de Trabajo</p>
                    <p className="text-xs text-gray-600 mt-0.5">Se registró un nuevo avance en la orden ORD-2024-002</p>
                    <p className="text-[11px] text-gray-500 mt-1">2024-10-09 12:15</p>
                  </li>
                  <li className="p-3 hover:bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">Cambio de Estado</p>
                    <p className="text-xs text-gray-600 mt-0.5">La orden ORD-2024-003 ha sido marcada como "Terminada"</p>
                    <p className="text-[11px] text-gray-500 mt-1">2024-10-08 18:30</p>
                  </li>
                </ul>
                <div className="px-4 py-2 bg-gray-50 text-right text-xs text-gray-500">Solo visual, sin funcionalidad</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
