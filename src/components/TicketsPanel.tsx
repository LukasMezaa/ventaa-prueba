import { Ticket, Plus, CheckCircle, XCircle, Clock, FileText, X } from 'lucide-react';
import { useState } from 'react';
import { Ticket as TicketType, mockTickets } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';

export default function TicketsPanel() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [tickets, setTickets] = useState<TicketType[]>(mockTickets);
  const [formData, setFormData] = useState({
    description: '',
    area: '',
    scheduledDate: '',
    scheduledTime: '',
  });

  const isAdmin = user?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTicket: TicketType = {
      id: String(tickets.length + 1),
      ticketNumber: `TKT-2024-${String(tickets.length + 1).padStart(3, '0')}`,
      ownerName: user?.name || 'Propietario',
      ownerEmail: user?.email || '',
      phone: '+56912345678',
      tower: 'Torre A',
      municipalNumber: '101',
      description: formData.description,
      area: formData.area,
      scheduledDate: formData.scheduledDate && formData.scheduledTime ? `${formData.scheduledDate} ${formData.scheduledTime}` : null,
      status: 'Pendiente',
      approvedBy: null,
      approvedDate: null,
      createdDate: new Date().toISOString(),
      orderNumber: null,
    };
    
    setTickets([...tickets, newTicket]);
    setShowModal(false);
    setFormData({ description: '', area: '', scheduledDate: '', scheduledTime: '' });
  };

  const handleApprove = (ticketId: string, approve: boolean) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: approve ? 'Aprobado' : 'Rechazado',
          approvedBy: approve ? user?.email || '' : null,
          approvedDate: approve ? new Date().toISOString() : null,
          orderNumber: approve ? `ORD-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}` : null,
        };
      }
      return ticket;
    }));
    setSelectedTicket(null);
  };

  const statusConfig: Record<string, { color: string; icon: any; bgColor: string; textColor: string }> = {
    'Pendiente': {
      color: 'text-yellow-800',
      icon: Clock,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
    },
    'Aprobado': {
      color: 'text-green-800',
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
    },
    'Rechazado': {
      color: 'text-red-800',
      icon: XCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
    },
  };

  const filteredTickets = isAdmin ? tickets : tickets.filter(t => t.ownerEmail === user?.email);

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
              <p className="text-3xl font-bold text-gray-800">{filteredTickets.length}</p>
            </div>
            <FileText className="w-10 h-10 text-[#2B5F7F] opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">
                {filteredTickets.filter((t) => t.status === 'Pendiente').length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Aprobados</p>
              <p className="text-3xl font-bold text-green-600">
                {filteredTickets.filter((t) => t.status === 'Aprobado').length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Panel de Tickets */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {isAdmin ? 'Tickets de Propietarios' : 'Mis Tickets'}
          </h3>
          {!isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Ticket
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">N° Ticket</th>
                {isAdmin && <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Propietario</th>}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Descripción</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Área</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Fecha Programada</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => {
                const config = statusConfig[ticket.status];
                const Icon = config.icon;
                return (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{ticket.ticketNumber}</td>
                    {isAdmin && <td className="px-4 py-3 text-sm text-gray-700">{ticket.ownerName}</td>}
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{ticket.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{ticket.area}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {ticket.scheduledDate ? new Date(ticket.scheduledDate).toLocaleString('es-CL') : 'No programada'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor}`}>
                        <Icon className="w-3 h-3" />
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-3 py-1 text-sm text-[#2B5F7F] hover:text-[#1a4968] hover:underline"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nueva Solicitud (Propietario) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-800">Nuevo Ticket</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Problema</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                  placeholder="Describe el problema que necesitas resolver..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Plomería">Plomería</option>
                    <option value="Electricidad">Electricidad</option>
                    <option value="Carpintería">Carpintería</option>
                    <option value="Pintura">Pintura</option>
                    <option value="Gasfitería">Gasfitería</option>
                    <option value="Albañilería">Albañilería</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Deseada</label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Deseada</label>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors"
                >
                  Crear Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalle y Aprobación (Admin) */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-800">Detalle del Ticket</h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">N° Ticket</label>
                  <p className="text-gray-900 font-semibold">{selectedTicket.ticketNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Estado</label>
                  {(() => {
                    const config = statusConfig[selectedTicket.status];
                    const Icon = config.icon;
                    return (
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
                        <Icon className="w-4 h-4" />
                        {selectedTicket.status}
                      </span>
                    );
                  })()}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Propietario</label>
                  <p className="text-gray-900">{selectedTicket.ownerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono</label>
                  <p className="text-gray-900">{selectedTicket.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Torre</label>
                  <p className="text-gray-900">{selectedTicket.tower} - {selectedTicket.municipalNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Área</label>
                  <p className="text-gray-900">{selectedTicket.area}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Descripción</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedTicket.description}</p>
              </div>

              {selectedTicket.scheduledDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Programada</label>
                  <p className="text-gray-900">{new Date(selectedTicket.scheduledDate).toLocaleString('es-CL')}</p>
                </div>
              )}

              {isAdmin && selectedTicket.status === 'Pendiente' && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">Acción del Administrador:</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(selectedTicket.id, true)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Aprobar y Crear Orden
                    </button>
                    <button
                      onClick={() => handleApprove(selectedTicket.id, false)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

