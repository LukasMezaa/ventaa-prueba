import { Building2, Users, BarChart3, LogOut, X, Home, Wrench, Settings, Ticket, Activity, ChevronDown, ChevronUp, Calendar, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, isOpen, onClose }: SidebarProps) {
  const { signOut, user } = useAuth();
  const [reportsOpen, setReportsOpen] = useState(false);

  const menuItems = [
    { id: 'portal', label: 'Inicio', icon: Home },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'trazability', label: 'Trazabilidad', icon: Activity, propietarioOnly: true },
    { id: 'owners', label: 'Propietarios', icon: Users },
    { id: 'tracking', label: 'Seguimiento de Trabajos', icon: Wrench },
    { id: 'scheduling', label: 'Agendamiento', icon: Calendar, adminOnly: true },
  ];

  const reportsSubmenu = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'admin', label: 'Administración', icon: Settings },
  ];

  const isReportsActive = activeSection === 'dashboard' || activeSection === 'notifications' || activeSection === 'admin';

  // Abrir automáticamente el dropdown si estamos en una sección de reportes
  useEffect(() => {
    if (isReportsActive && !reportsOpen) {
      setReportsOpen(true);
    }
  }, [activeSection, isReportsActive, reportsOpen]);

  return (
    <>
      <aside className={`
        w-[230px] bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-4 lg:p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2B5F7F] to-[#00B050] rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-gray-800 text-sm truncate">Constructora FJ</h1>
              <p className="text-xs text-gray-500 truncate">Sistema Post-Venta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems
            .filter((item) => {
              // Filtrar según rol
              if (item.id === 'owners') {
                return user?.role === 'admin';
              }
              // Tracking para admin y tecnico
              if (item.id === 'tracking') {
                return user?.role === 'admin' || user?.role === 'tecnico';
              }
              // Ocultar Agendamiento para propietarios y técnicos
              if ((item as any).adminOnly) {
                return user?.role === 'admin';
              }
              // Mostrar Trazabilidad solo para propietarios
              if ((item as any).propietarioOnly) {
                return user?.role === 'propietario';
              }
              // Portal solo para admin y propietario
              if (item.id === 'portal') {
                return user?.role === 'admin' || user?.role === 'propietario';
              }
              // Tickets: todos pueden ver
              if (item.id === 'tickets') {
                return true;
              }
              return true;
            })
            .map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onSectionChange(item.id);
                    onClose(); // Cerrar sidebar en mobile al seleccionar
                  }}
                  className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2B5F7F] to-[#00B050] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium truncate">{item.label}</span>
                </button>
              </li>
            );
          })}

          {/* Menú de Reportes con Dropdown - Solo para Admin */}
          {user?.role === 'admin' && (
            <li>
              <button
                onClick={() => setReportsOpen(!reportsOpen)}
                className={`w-full flex items-center justify-between px-3 lg:px-4 py-3 rounded-lg transition-all ${
                  isReportsActive
                    ? 'bg-gradient-to-r from-[#2B5F7F] to-[#00B050] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium truncate">Reportes</span>
                </div>
                {reportsOpen ? (
                  <ChevronUp className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                )}
              </button>
              
              {reportsOpen && (
                <ul className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-2">
                  {reportsSubmenu.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = activeSection === subItem.id;
                    return (
                      <li key={subItem.id}>
                        <button
                          onClick={() => {
                            onSectionChange(subItem.id);
                            onClose();
                          }}
                          className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2 rounded-lg transition-all text-sm ${
                            isSubActive
                              ? 'bg-gradient-to-r from-[#2B5F7F] to-[#00B050] text-white shadow-md'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <SubIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium truncate">{subItem.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 lg:px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#2B5F7F] to-[#00B050] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">
              {user?.email?.[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role === 'admin' ? 'Administrador' : user?.role === 'tecnico' ? 'Técnico' : 'Propietario'}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 lg:px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
    </>
  );
}
