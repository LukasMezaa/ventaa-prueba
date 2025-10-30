import { Settings, Users, Shield, Key, Bell, Database } from 'lucide-react';
import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'users' | 'permissions' | 'settings'>('users');

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      role: 'Administrador',
      lastLogin: '2024-10-10 09:30',
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      role: 'Administrador',
      lastLogin: '2024-10-10 08:15',
    },
    {
      id: '3',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      role: 'Propietario',
      lastLogin: '2024-10-09 16:45',
    },
    {
      id: '4',
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      role: 'Propietario',
      lastLogin: '2024-10-09 14:20',
    },
  ];

  const rolePermissions = [
    {
      role: 'Administrador',
      description: 'Acceso completo al sistema',
      permissions: [
        'Gestión de propietarios',
        'Recepción de solicitudes',
        'Seguimiento de trabajos',
        'Dashboard y reportes',
        'Administración de usuarios',
      ],
    },
    {
      role: 'Propietario',
      description: 'Acceso limitado al portal',
      permissions: [
        'Ver mi perfil',
        'Crear solicitudes',
        'Ver mis solicitudes',
        'Agendar visitas',
        'Ver notificaciones',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Usuarios</p>
              <p className="text-3xl font-bold text-gray-800">{mockUsers.length}</p>
            </div>
            <Users className="w-10 h-10 text-[#2B5F7F] opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Administradores</p>
              <p className="text-3xl font-bold text-blue-600">
                {mockUsers.filter((u) => u.role === 'Administrador').length}
              </p>
            </div>
            <Shield className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Propietarios</p>
              <p className="text-3xl font-bold text-green-600">
                {mockUsers.filter((u) => u.role === 'Propietario').length}
              </p>
            </div>
            <Users className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-4 border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-[#2B5F7F] text-[#2B5F7F] font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Usuarios
              </div>
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-4 px-4 border-b-2 transition-colors ${
                activeTab === 'permissions'
                  ? 'border-[#2B5F7F] text-[#2B5F7F] font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Permisos y Roles
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-4 border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-[#2B5F7F] text-[#2B5F7F] font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuración
              </div>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tab: Usuarios */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Lista de Usuarios</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors">
                  <Users className="w-4 h-4" />
                  Agregar Usuario
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rol</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Último Acceso</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === 'Administrador'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{user.lastLogin}</td>
                        <td className="px-4 py-3">
                          <button className="text-sm text-[#2B5F7F] hover:underline">Editar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Permisos */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Roles y Permisos del Sistema</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rolePermissions.map((rolePerm, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        rolePerm.role === 'Administrador' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        <Shield className={`w-6 h-6 ${
                          rolePerm.role === 'Administrador' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800">{rolePerm.role}</h4>
                        <p className="text-sm text-gray-600">{rolePerm.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 mb-3">Permisos:</p>
                      {rolePerm.permissions.map((permission, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-[#2B5F7F] rounded-full"></div>
                          <span className="text-sm text-gray-700">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Configuración */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Configuración del Sistema</h3>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Database className="w-8 h-8 text-[#2B5F7F]" />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">Gestión de Base de Datos</h4>
                      <p className="text-sm text-gray-600">Configurar y actualizar la base de datos de propietarios</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors">
                    Gestionar Base de Datos
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Bell className="w-8 h-8 text-yellow-500" />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">Configuración de Notificaciones</h4>
                      <p className="text-sm text-gray-600">Ajustar alertas y recordatorios automáticos</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                    Configurar Notificaciones
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Settings className="w-8 h-8 text-purple-500" />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">Actualizaciones Centralizadas</h4>
                      <p className="text-sm text-gray-600">El encargado de postventa gestiona todas las actualizaciones</p>
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm text-purple-800">
                      <strong>Encargado:</strong> Control centralizado de datos y configuraciones
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

