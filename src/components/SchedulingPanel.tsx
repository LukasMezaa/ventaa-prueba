import { Calendar, Clock, MapPin, User, Wrench } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Ticket } from '../lib/mockData';

interface ScheduledAppointment {
  id: string;
  ticketNumber: string;
  date: string;
  time: string;
  ownerName: string;
  property: string;
  area: string;
  status: string;
  assignedTechnician?: string;
  technicianName?: string;
}

export default function SchedulingPanel() {
  const [scheduledAppointments, setScheduledAppointments] = useState<ScheduledAppointment[]>([]);

  // Mapeo de RUTs de técnicos a nombres
  const technicianNames: { [key: string]: string } = {
    '11111111-1': 'Técnico (Carpintería)',
    '22222222-2': 'Técnico (Gasfitería)',
  };

  // Cargar tickets desde localStorage y filtrar los agendados
  useEffect(() => {
    const loadScheduledAppointments = () => {
      const stored = localStorage.getItem('tickets');
      if (!stored) return;

      try {
        const tickets: Ticket[] = JSON.parse(stored);
        
        // Filtrar solo tickets aprobados con scheduledDate y técnico asignado
        const scheduled = tickets
          .filter(ticket => 
            ticket.status === 'Aprobado' && 
            ticket.scheduledDate !== null && 
            ticket.scheduledDate !== undefined &&
            ticket.assignedTechnician
          )
          .map(ticket => {
            // scheduledDate puede estar en formato ISO "YYYY-MM-DDTHH:MM:00" o "YYYY-MM-DD HH:MM"
            let date = '';
            let time = '';
            
            if (ticket.scheduledDate) {
              if (ticket.scheduledDate.includes('T')) {
                // Formato ISO: "YYYY-MM-DDTHH:MM:00"
                const [datePart, timePart] = ticket.scheduledDate.split('T');
                date = datePart;
                time = timePart.split(':').slice(0, 2).join(':'); // Solo HH:MM
              } else {
                // Formato: "YYYY-MM-DD HH:MM"
                const parts = ticket.scheduledDate.split(' ');
                date = parts[0];
                time = parts[1] || '';
              }
            }
            
            // Obtener nombre del técnico
            const normalizeRut = (rut: string) => {
              return rut.replace(/\./g, '').replace(/\s/g, '').toLowerCase().trim();
            };
            const techRut = ticket.assignedTechnician ? normalizeRut(ticket.assignedTechnician) : '';
            const technicianName = ticket.assignedTechnician 
              ? technicianNames[ticket.assignedTechnician] || technicianNames[techRut] || ticket.assignedTechnician
              : 'Sin asignar';
            
            return {
              id: ticket.id,
              ticketNumber: ticket.ticketNumber,
              date: date,
              time: time,
              ownerName: ticket.ownerName,
              property: `${ticket.tower} - Dep. ${ticket.municipalNumber}`,
              area: ticket.area,
              status: ticket.status,
              assignedTechnician: ticket.assignedTechnician,
              technicianName: technicianName,
            };
          })
          .sort((a, b) => {
            // Ordenar por fecha y hora
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA.getTime() - dateB.getTime();
          });

        setScheduledAppointments(scheduled);
      } catch (error) {
        console.error('Error loading scheduled appointments:', error);
      }
    };

    loadScheduledAppointments();

    // Escuchar cambios en tickets
    const handleTicketsUpdate = () => {
      loadScheduledAppointments();
    };

    window.addEventListener('ticketsUpdated', handleTicketsUpdate);
    return () => {
      window.removeEventListener('ticketsUpdated', handleTicketsUpdate);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Citas Programadas</h3>
        
        {scheduledAppointments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No hay horarios agendados aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-[#2B5F7F]">{appointment.ticketNumber}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'Aprobado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        Confirmada
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-[#2B5F7F]" />
                      <span className="font-semibold text-gray-900">
                        {new Date(appointment.date).toLocaleDateString('es-CL', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                      <Clock className="w-4 h-4 text-[#2B5F7F] ml-2" />
                      <span className="text-gray-700">{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{appointment.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{appointment.property}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-600">Área:</span>
                      <span className="text-sm text-gray-700">{appointment.area}</span>
                    </div>
                    {appointment.technicianName && (
                      <div className="flex items-center gap-2 mt-2">
                        <Wrench className="w-4 h-4 text-[#2B5F7F]" />
                        <span className="text-sm font-medium text-[#2B5F7F]">{appointment.technicianName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

