import { Activity, Clock, CheckCircle, XCircle, FileText, Eye, X, Calendar, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
// import { mockTickets } from '../lib/mockData'; // Ocultado - descomentar si se necesita restaurar tickets mock
import { Ticket as TicketType } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';

export default function TrazabilityPanel() {
  const { user } = useAuth();
  
  // Cargar tickets desde localStorage o usar array vacío
  const loadTickets = (): TicketType[] => {
    const stored = localStorage.getItem('tickets');
    if (stored) {
      return JSON.parse(stored);
    }
    // Si no hay localStorage, inicializar con array vacío (mockTickets están ocultos)
    // Para restaurar tickets mock, cambiar [] por mockTickets
    const emptyTickets: TicketType[] = [];
    localStorage.setItem('tickets', JSON.stringify(emptyTickets));
    return emptyTickets;
  };
  
  const [tickets, setTickets] = useState<TicketType[]>(loadTickets());
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  // Escuchar eventos de actualización de tickets
  useEffect(() => {
    const handleTicketsUpdate = (event: CustomEvent) => {
      const updatedTickets = event.detail;
      setTickets(updatedTickets);
    };

    window.addEventListener('ticketsUpdated', handleTicketsUpdate as EventListener);
    return () => {
      window.removeEventListener('ticketsUpdated', handleTicketsUpdate as EventListener);
    };
  }, []);

  // Filtrar solo los tickets del propietario actual
  const ownerTickets = tickets.filter(t => t.ownerEmail === user?.email);

  const statusConfig: Record<string, { color: string; icon: any; bgColor: string; textColor: string; description: string }> = {
    'Pendiente': {
      color: 'text-yellow-800',
      icon: Clock,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      description: 'Tu ticket está pendiente de revisión por el administrador',
    },
    'Aprobado': {
      color: 'text-green-800',
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      description: 'Tu ticket ha sido aprobado y se ha creado una orden de trabajo',
    },
    'Rechazado': {
      color: 'text-red-800',
      icon: XCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      description: 'Tu ticket ha sido rechazado',
    },
    'Finalizado': {
      color: 'text-blue-800',
      icon: CheckCircle,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      description: 'Ticket finalizado. La visita se realizó y el problema fue resuelto',
    },
  };

  const getStatusCounts = () => {
    return {
      total: ownerTickets.length,
      pendientes: ownerTickets.filter(t => t.status === 'Pendiente').length,
      aprobados: ownerTickets.filter(t => t.status === 'Aprobado').length,
      rechazados: ownerTickets.filter(t => t.status === 'Rechazado').length,
      finalizados: ownerTickets.filter(t => t.status === 'Finalizado').length,
    };
  };

  const stats = getStatusCounts();

  // Calcular días transcurridos desde la creación
  const getDaysSinceCreation = (date: string) => {
    const created = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Obtener siguiente paso según el estado
  const getNextStep = (ticket: TicketType) => {
    switch (ticket.status) {
      case 'Pendiente':
        return 'Esperando revisión del administrador';
      case 'Aprobado':
        if (ticket.scheduledDate) {
          return `Visita programada para ${new Date(ticket.scheduledDate).toLocaleDateString('es-CL')}`;
        }
        return 'Orden de trabajo en proceso';
      case 'Rechazado':
        return 'Ticket rechazado. Puedes crear un nuevo ticket si es necesario';
      case 'Finalizado':
        return 'Ticket finalizado. La visita se realizó y el problema fue resuelto exitosamente';
      default:
        return '';
    }
  };

  // Obtener etapas del proceso
  const getProcessSteps = (ticket: TicketType) => {
    const steps = [
      { 
        label: 'Ticket Creado', 
        completed: true, 
        date: ticket.createdDate,
        icon: CheckCircle2 
      },
      { 
        label: 'En Revisión', 
        completed: ticket.status !== 'Pendiente',
        date: ticket.status !== 'Pendiente' ? ticket.createdDate : null,
        icon: Clock 
      },
      { 
        label: ticket.status === 'Rechazado' ? 'Rechazado' : 'Aprobado', 
        completed: ticket.status === 'Aprobado' || ticket.status === 'Rechazado' || ticket.status === 'Finalizado',
        date: ticket.approvedDate || null,
        icon: ticket.status === 'Rechazado' ? XCircle : CheckCircle,
        isError: ticket.status === 'Rechazado'
      },
    ];

    if ((ticket.status === 'Aprobado' || ticket.status === 'Finalizado') && ticket.orderNumber) {
      steps.push({
        label: 'Orden de Trabajo',
        completed: true,
        date: ticket.approvedDate || null,
        icon: FileText
      });
    }

    if (ticket.status === 'Finalizado') {
      steps.push({
        label: 'Ticket Finalizado',
        completed: true,
        date: ticket.approvedDate || null,
        icon: CheckCircle2
      });
    }

    return steps;
  };

  return (
    <div className="space-y-4">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Total</p>
              <p className="text-xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <FileText className="w-6 h-6 text-[#2B5F7F] opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Pendientes</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pendientes}</p>
            </div>
            <Clock className="w-6 h-6 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Aprobados</p>
              <p className="text-xl font-bold text-green-600">{stats.aprobados}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Rechazados</p>
              <p className="text-xl font-bold text-red-600">{stats.rechazados}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Finalizados</p>
              <p className="text-xl font-bold text-blue-600">{stats.finalizados}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-blue-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Lista Compacta de Tickets */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-800">Mis Tickets</h3>
        </div>
        
        {ownerTickets.length === 0 ? (
          <div className="p-8 text-center">
            <Activity className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No tienes tickets registrados aún</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {ownerTickets.map((ticket) => {
              const config = statusConfig[ticket.status];
              const StatusIcon = config.icon;
              const steps = getProcessSteps(ticket);
              const daysSince = getDaysSinceCreation(ticket.createdDate);
              const isExpanded = expandedTicketId === ticket.id;
              
              return (
                <div key={ticket.id}>
                  {/* Item de la lista - Clickable */}
                  <div
                    onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)}
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 ${config.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <StatusIcon className={`w-4 h-4 ${config.textColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">#{ticket.ticketNumber}</p>
                            <span className="text-xs text-gray-500">•</span>
                            <p className="text-xs text-gray-600 truncate">{ticket.area}</p>
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{ticket.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                          <StatusIcon className="w-3 h-3" />
                          {ticket.status}
                        </span>
                        <div className="w-4 h-4 flex items-center justify-center">
                          <Activity className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contenido Expandible - Seguimiento */}
                  {isExpanded && (
                    <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-4">
                      {/* Información rápida */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Creado</p>
                            <p className="text-xs font-medium text-gray-900">
                              {new Date(ticket.createdDate).toLocaleDateString('es-CL', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </p>
                            <p className="text-xs text-gray-500">Hace {daysSince}d</p>
                          </div>
                        </div>
                        
                        {ticket.preferredShift && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Preferencia</p>
                              <p className="text-xs font-medium text-gray-900">{ticket.preferredShift}</p>
                            </div>
                          </div>
                        )}

                        {ticket.orderNumber && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Orden</p>
                              <p className="text-xs font-semibold text-[#2B5F7F]">{ticket.orderNumber}</p>
                            </div>
                          </div>
                        )}

                        {ticket.scheduledDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-green-500" />
                            <div>
                              <p className="text-xs text-gray-500">Visita</p>
                              <p className="text-xs font-medium text-green-700">
                                {new Date(ticket.scheduledDate).toLocaleDateString('es-CL', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Timeline de Progreso */}
                      <div className="border-t border-gray-300 pt-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Progreso</p>
                        <div className="space-y-2">
                          {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            const isLast = index === steps.length - 1;
                            return (
                              <div key={index} className="flex gap-2">
                                <div className="flex flex-col items-center">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    step.completed 
                                      ? step.isError 
                                        ? 'bg-red-100 text-red-600' 
                                        : 'bg-green-100 text-green-600'
                                      : 'bg-gray-100 text-gray-400'
                                  }`}>
                                    <StepIcon className="w-3 h-3" />
                                  </div>
                                  {!isLast && (
                                    <div className={`w-0.5 h-6 ${
                                      steps[index + 1]?.completed ? 'bg-green-200' : 'bg-gray-200'
                                    }`} />
                                  )}
                                </div>
                                
                                <div className="flex-1 pb-2">
                                  <p className={`text-xs font-medium ${
                                    step.completed ? 'text-gray-900' : 'text-gray-500'
                                  }`}>
                                    {step.label}
                                  </p>
                                  {step.date && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {new Date(step.date).toLocaleDateString('es-CL', {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Próximo Paso */}
                      <div className="bg-blue-50 border border-blue-200 rounded p-2">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-blue-900">Próximo Paso</p>
                            <p className="text-xs text-blue-800 mt-0.5">{getNextStep(ticket)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Botón Ver Detalle Completo */}
                      <div className="flex justify-end pt-2 border-t border-gray-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(ticket);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-[#2B5F7F] hover:text-[#1a4968] hover:bg-[#2B5F7F]/5 rounded transition-colors flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ver Detalle Completo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-base font-bold text-gray-800">Detalle del Ticket</h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">N° Ticket</label>
                  <p className="text-sm text-gray-900 font-semibold">{selectedTicket.ticketNumber}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">Estado</label>
                  {(() => {
                    const config = statusConfig[selectedTicket.status];
                    const Icon = config.icon;
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {selectedTicket.status}
                      </span>
                    );
                  })()}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">Área</label>
                  <p className="text-sm text-gray-900">{selectedTicket.area}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">Fecha de Creación</label>
                  <p className="text-sm text-gray-900">{new Date(selectedTicket.createdDate).toLocaleString('es-CL')}</p>
                </div>
                {selectedTicket.preferredShift && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Jornada de Preferencia</label>
                    <p className="text-sm text-gray-900 font-semibold">{selectedTicket.preferredShift}</p>
                  </div>
                )}
                {selectedTicket.orderNumber && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">N° Orden</label>
                    <p className="text-sm text-gray-900 font-semibold text-[#2B5F7F]">{selectedTicket.orderNumber}</p>
                  </div>
                )}
                {selectedTicket.approvedDate && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Fecha de Aprobación</label>
                    <p className="text-sm text-gray-900">{new Date(selectedTicket.approvedDate).toLocaleString('es-CL')}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Descripción</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTicket.description}</p>
              </div>

              {selectedTicket.photo && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">Foto Adjunta</label>
                  <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                    <img
                      src={selectedTicket.photo}
                      alt="Foto del problema"
                      className="w-full max-h-64 object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Activity className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 mb-0.5">Información del Estado</p>
                    <p className="text-xs text-blue-800">{statusConfig[selectedTicket.status].description}</p>
                    {selectedTicket.orderNumber && (
                      <p className="text-xs text-blue-800 mt-1.5">
                        Tu solicitud ha sido procesada y se encuentra en seguimiento. Puedes revisar el progreso en el módulo de seguimiento de trabajos.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

