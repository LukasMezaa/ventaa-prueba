import { FileText, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';

interface Request {
  id: string;
  orderNumber: string;
  ownerName: string;
  phone: string;
  tower: string;
  municipalNumber: string;
  requestDate: string;
  receptionMethod: string;
  observation: string;
  area: string;
  status: string;
}

export default function RequestsPanel() {
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      ownerName: 'Juan Pérez',
      phone: '+56912345678',
      tower: 'Torre 1',
      municipalNumber: '101',
      requestDate: '2024-10-01',
      receptionMethod: 'Portal del Propietario',
      observation: 'Fuga en el baño',
      area: 'Plomería',
      status: 'Pendiente de Visita',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      ownerName: 'María González',
      phone: '+56987654321',
      tower: 'Torre 2',
      municipalNumber: '205',
      requestDate: '2024-10-05',
      receptionMethod: 'Manual',
      observation: 'Problema con la puerta del balcón',
      area: 'Carpintería',
      status: 'Pendiente de Visita',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      ownerName: 'Carlos Rodríguez',
      phone: '+56923456789',
      tower: 'Torre 3',
      municipalNumber: '310',
      requestDate: '2024-10-08',
      receptionMethod: 'Portal del Propietario',
      observation: 'Reparar tubería de gas',
      area: 'Gasfitería',
      status: 'Pendiente de Visita',
    },
  ]);

  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    tower: '',
    municipalNumber: '',
    receptionMethod: 'Manual',
    observation: '',
    area: '',
  });

  const generateOrderNumber = (): string => {
    const year = new Date().getFullYear();
    const lastOrder = requests
      .filter((r) => r.orderNumber.startsWith(`ORD-${year}-`))
      .sort((a, b) => {
        const numA = parseInt(a.orderNumber.split('-')[2] || '0');
        const numB = parseInt(b.orderNumber.split('-')[2] || '0');
        return numB - numA;
      })[0];

    if (lastOrder) {
      const lastNum = parseInt(lastOrder.orderNumber.split('-')[2] || '0');
      const newNum = String(lastNum + 1).padStart(3, '0');
      return `ORD-${year}-${newNum}`;
    }
    return `ORD-${year}-001`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: Request = {
      id: Date.now().toString(),
      orderNumber: generateOrderNumber(),
      ownerName: formData.ownerName,
      phone: formData.phone,
      tower: formData.tower,
      municipalNumber: formData.municipalNumber,
      requestDate: new Date().toISOString().split('T')[0],
      receptionMethod: formData.receptionMethod,
      observation: formData.observation,
      area: formData.area,
      status: 'Pendiente de Visita',
    };

    setRequests([newRequest, ...requests]);
    
    // Limpiar formulario
    setFormData({
      ownerName: '',
      phone: '',
      tower: '',
      municipalNumber: '',
      receptionMethod: 'Manual',
      observation: '',
      area: '',
    });
    
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Solicitudes</p>
              <p className="text-3xl font-bold text-gray-800">{requests.length}</p>
            </div>
            <FileText className="w-10 h-10 text-[#2B5F7F] opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">
                {requests.filter((r) => r.status === 'Pendiente de Visita').length}
              </p>
            </div>
            <FileText className="w-10 h-10 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Desde Portal</p>
              <p className="text-3xl font-bold text-blue-600">
                {requests.filter((r) => r.receptionMethod === 'Portal del Propietario').length}
              </p>
            </div>
            <FileText className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Manual</p>
              <p className="text-3xl font-bold text-green-600">
                {requests.filter((r) => r.receptionMethod === 'Manual').length}
              </p>
            </div>
            <FileText className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Panel de Solicitudes */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Solicitudes Registradas</h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Solicitud Manual
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">N° Orden</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Propietario</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Teléfono</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Torre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">N° Departamento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Método</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{request.orderNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{request.ownerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{request.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{request.tower}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{request.municipalNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(request.requestDate).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{request.receptionMethod}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nueva Solicitud */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-800">Nueva Solicitud Manual</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Propietario</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Torre</label>
                  <input
                    type="text"
                    value={formData.tower}
                    onChange={(e) => setFormData({ ...formData, tower: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">N° Departamento</label>
                  <input
                    type="text"
                    value={formData.municipalNumber}
                    onChange={(e) => setFormData({ ...formData, municipalNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                    required
                  />
                </div>

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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observación</label>
                <textarea
                  value={formData.observation}
                  onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                  required
                />
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
                  Registrar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

