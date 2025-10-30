import { Bell, CheckCircle, Clock, AlertCircle, FileText, Calendar, User, X } from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export default function NotificationsPanel() {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'new_request',
      title: 'Nueva Solicitud',
      message: 'Se ha recibido una nueva solicitud de Juan Pérez para plomería',
      date: '2024-10-10 09:30',
      read: false,
    },
    {
      id: '2',
      type: 'appointment_reminder',
      title: 'Recordatorio de Visita',
      message: 'Visita programada para hoy a las 11:00 con María González',
      date: '2024-10-10 08:00',
      read: false,
    },
    {
      id: '3',
      type: 'status_change',
      title: 'Cambio de Estado',
      message: 'La orden ORD-2024-001 ha cambiado a "En Ejecución"',
      date: '2024-10-09 16:45',
      read: true,
    },
    {
      id: '4',
      type: 'chat_message',
      title: 'Mensaje Nuevo',
      message: 'Mensaje de Carlos Rodríguez sobre su solicitud pendiente',
      date: '2024-10-09 14:20',
      read: false,
    },
    {
      id: '5',
      type: 'work_progress',
      title: 'Avance de Trabajo',
      message: 'Se registró un nuevo avance en la orden ORD-2024-002',
      date: '2024-10-09 12:15',
      read: true,
    },
    {
      id: '6',
      type: 'status_change',
      title: 'Cambio de Estado',
      message: 'La orden ORD-2024-003 ha sido marcada como "Terminada"',
      date: '2024-10-08 18:30',
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_request':
        return FileText;
      case 'appointment_reminder':
        return Calendar;
      case 'status_change':
        return CheckCircle;
      case 'chat_message':
        return User;
      case 'work_progress':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'new_request':
        return 'bg-blue-100 text-blue-600';
      case 'appointment_reminder':
        return 'bg-yellow-100 text-yellow-600';
      case 'status_change':
        return 'bg-green-100 text-green-600';
      case 'chat_message':
        return 'bg-purple-100 text-purple-600';
      case 'work_progress':
        return 'bg-indigo-100 text-indigo-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Notificaciones</p>
              <p className="text-3xl font-bold text-gray-800">{mockNotifications.length}</p>
            </div>
            <Bell className="w-10 h-10 text-[#2B5F7F] opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">No Leídas</p>
              <p className="text-3xl font-bold text-yellow-600">{unreadCount}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Hoy</p>
              <p className="text-3xl font-bold text-blue-600">
                {mockNotifications.filter((n) => n.date.includes('2024-10-10')).length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Lista de Notificaciones */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Notificaciones</h3>
          <button className="text-sm text-[#2B5F7F] hover:underline">
            Marcar todas como leídas
          </button>
        </div>

        <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
          {mockNotifications.map((notification) => {
            const Icon = getIcon(notification.type);
            return (
              <div
                key={notification.id}
                onClick={() => setSelectedNotification(notification)}
                className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-12 h-12 ${getColor(notification.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.date}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Centro de Configuración */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuración de Alertas</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Nuevas Solicitudes</p>
              <p className="text-sm text-gray-600">Recibir notificaciones de solicitudes nuevas</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-[#2B5F7F]" />
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Recordatorios de Visitas</p>
              <p className="text-sm text-gray-600">Alertas 24 horas antes de visitas</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-[#2B5F7F]" />
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Cambios de Estado</p>
              <p className="text-sm text-gray-600">Notificar cuando cambie el estado de una orden</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-[#2B5F7F]" />
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Mensajes de Chat</p>
              <p className="text-sm text-gray-600">Notificar nuevos mensajes</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-[#2B5F7F]" />
          </div>
        </div>
      </div>

      {/* Modal de Detalle */}
      {selectedNotification && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-800">Detalle de Notificación</h3>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className={`w-16 h-16 ${getColor(selectedNotification.type)} rounded-lg flex items-center justify-center mx-auto`}>
                {(() => {
                  const Icon = getIcon(selectedNotification.type);
                  return <Icon className="w-8 h-8" />;
                })()}
              </div>

              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {selectedNotification.title}
                </h4>
                <p className="text-sm text-gray-500 mb-4">{selectedNotification.date}</p>
                <p className="text-gray-700">{selectedNotification.message}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="w-full px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors">
                  Ver Detalle Relacionado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

