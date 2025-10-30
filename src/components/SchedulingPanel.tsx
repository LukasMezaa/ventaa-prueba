import { Calendar, Clock, MapPin, User, Plus } from 'lucide-react';
import { useState } from 'react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  owner: string;
  property: string;
  type: string;
  status: string;
}

export default function SchedulingPanel() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      date: '2024-10-15',
      time: '09:00',
      owner: 'Juan Pérez',
      property: 'Torre A - 101',
      type: 'Primera Visita',
      status: 'Pendiente',
    },
    {
      id: '2',
      date: '2024-10-15',
      time: '11:00',
      owner: 'María González',
      property: 'Torre B - 205',
      type: 'Trabajo de Ejecución',
      status: 'Confirmada',
    },
    {
      id: '3',
      date: '2024-10-16',
      time: '10:00',
      owner: 'Carlos Rodríguez',
      property: 'Torre C - 310',
      type: 'Primera Visita',
      status: 'Pendiente',
    },
  ];

  const availableHours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  return (
    <div className="space-y-6">
      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Citas Hoy</p>
              <p className="text-3xl font-bold text-gray-800">3</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">2</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Confirmadas</p>
              <p className="text-3xl font-bold text-green-600">1</p>
            </div>
            <Clock className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Esta Semana</p>
              <p className="text-3xl font-bold text-gray-800">8</p>
            </div>
            <Calendar className="w-10 h-10 text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario y Formulario */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calendario */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Calendario de Disponibilidad</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors">
                <Plus className="w-4 h-4" />
                Nueva Cita
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Fecha</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Horarios Disponibles</label>
              <div className="grid grid-cols-3 gap-3">
                {availableHours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => setSelectedTime(hour)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedTime === hour
                        ? 'bg-[#2B5F7F] text-white border-[#2B5F7F]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full px-4 py-3 bg-[#00B050] text-white rounded-lg font-medium hover:bg-[#009040] transition-colors">
              Confirmar Cita
            </button>
          </div>

          {/* Lista de Citas Programadas */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Citas Programadas</h3>
            <div className="space-y-4">
              {mockAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-[#2B5F7F]" />
                        <span className="font-semibold text-gray-900">
                          {new Date(appointment.date).toLocaleDateString('es-CL')}
                        </span>
                        <Clock className="w-4 h-4 text-[#2B5F7F] ml-2" />
                        <span className="text-gray-700">{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{appointment.owner}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{appointment.property}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{appointment.type}</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'Confirmada'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Lateral - Recordatorios */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Próximos Eventos</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-yellow-500 pl-4">
                <p className="text-sm font-medium text-gray-900">Hoy - 09:00</p>
                <p className="text-xs text-gray-600">Primera Visita - Juan Pérez</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm font-medium text-gray-900">Hoy - 11:00</p>
                <p className="text-xs text-gray-600">Trabajo - María González</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm font-medium text-gray-900">Mañana - 10:00</p>
                <p className="text-xs text-gray-600">Primera Visita - Carlos Rodríguez</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Recordatorios Automáticos</h3>
            <p className="text-sm text-yellow-800">
              Las notificaciones de citas se envían automáticamente 24 horas antes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

