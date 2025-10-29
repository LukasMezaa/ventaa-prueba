import { Building2, ClipboardList, Users, BarChart3, LogOut, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, isOpen, onClose }: SidebarProps) {
  const { signOut, user } = useAuth();

  const menuItems = [
    { id: 'orders', label: 'Órdenes', icon: ClipboardList },
    { id: 'owners', label: 'Propietarios', icon: Users },
    { id: 'metrics', label: 'Métricas', icon: BarChart3 },
  ];

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
              <p className="text-xs text-gray-500 truncate">Alto San Miguel I</p>
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
          {menuItems.map((item) => {
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
            <p className="text-xs text-gray-500 truncate">Administrador</p>
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
