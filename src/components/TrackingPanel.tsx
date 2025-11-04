import { Wrench, Clock, CheckCircle, XCircle, FileText, Upload, X, Eye, Plus } from 'lucide-react';
import { useState } from 'react';

interface WorkTracking {
  id: string;
  orderNumber: string;
  ownerName: string;
  property: string;
  area: string;
  status: string;
  workDetails: string[];
  startDate: string;
  updateDate: string;
  document?: string;
}

const mockWorks: WorkTracking[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      ownerName: 'Juan Pérez',
      property: 'Torre 1 - 101',
      area: 'Plomería',
      status: 'En Ejecución',
      workDetails: ['Se picó cerámica del baño', 'Se está conectando nueva tubería'],
      startDate: '2024-10-02',
      updateDate: '2024-10-08',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      ownerName: 'María González',
      property: 'Torre 2 - 205',
      area: 'Carpintería',
      status: 'Pendiente de Visita',
      workDetails: [],
      startDate: '2024-10-05',
      updateDate: '2024-10-05',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      ownerName: 'Carlos Rodríguez',
      property: 'Torre 3 - 310',
      area: 'Gasfitería',
      status: 'Terminada',
      workDetails: ['Reparación de tubería', 'Instalación de válvulas', 'Prueba de presión'],
      startDate: '2024-09-28',
      updateDate: '2024-10-06',
      document: 'certificado.pdf',
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      ownerName: 'Ana Martínez',
      property: 'Torre 1 - 115',
      area: 'Pintura',
      status: 'No Aplica',
      workDetails: [],
      startDate: '2024-09-15',
      updateDate: '2024-09-20',
    },
];

const statusConfig: Record<string, { color: string; icon: any; bgColor: string }> = {
    'Pendiente de Visita': {
      color: 'text-yellow-800',
      icon: Clock,
      bgColor: 'bg-yellow-100 border-yellow-200',
    },
    'En Ejecución': {
      color: 'text-blue-800',
      icon: Wrench,
      bgColor: 'bg-blue-100 border-blue-200',
    },
    'Terminada': {
      color: 'text-green-800',
      icon: CheckCircle,
      bgColor: 'bg-green-100 border-green-200',
    },
    'No Aplica': {
      color: 'text-gray-800',
      icon: XCircle,
      bgColor: 'bg-gray-100 border-gray-200',
    },
};

export default function TrackingPanel() {
  const [selectedWork, setSelectedWork] = useState<WorkTracking | null>(null);
  const [works, setWorks] = useState<WorkTracking[]>(mockWorks);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newActivity, setNewActivity] = useState<string>('');

  const handleAddActivity = () => {
    if (!selectedWork || !newActivity.trim()) return;

    const updatedWork = {
      ...selectedWork,
      workDetails: [...selectedWork.workDetails, newActivity.trim()],
      updateDate: new Date().toISOString().split('T')[0],
    };

    setWorks(works.map(w => w.id === selectedWork.id ? updatedWork : w));
    setSelectedWork(updatedWork);
    setNewActivity('');
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">
                {works.filter((w) => w.status === 'Pendiente de Visita').length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">En Ejecución</p>
              <p className="text-3xl font-bold text-blue-600">
                {works.filter((w) => w.status === 'En Ejecución').length}
              </p>
            </div>
            <Wrench className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Terminadas</p>
              <p className="text-3xl font-bold text-green-600">
                {works.filter((w) => w.status === 'Terminada').length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">No Aplica</p>
              <p className="text-3xl font-bold text-gray-600">
                {works.filter((w) => w.status === 'No Aplica').length}
              </p>
            </div>
            <XCircle className="w-10 h-10 text-gray-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Lista de Trabajos */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Trabajos en Seguimiento</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">N° Orden</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Propietario</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Propiedad</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Área</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actualización</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {works.map((work) => {
                const config = statusConfig[work.status];
                const Icon = config.icon;
                return (
                  <tr key={work.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{work.orderNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{work.ownerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{work.property}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{work.area}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.color}`}>
                        <Icon className="w-3 h-3" />
                        {work.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(work.updateDate).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedWork(work);
                          setNewStatus(work.status);
                          setIsUpdatingStatus(false);
                          setSelectedFile(null);
                          setNewActivity('');
                        }}
                        className="px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
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

      {/* Modal de Detalle */}
      {selectedWork && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedWork(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Detalle de Trabajo</h3>
                <p className="text-sm text-gray-600">{selectedWork.orderNumber}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedWork(null);
                  setIsUpdatingStatus(false);
                  setNewStatus('');
                  setSelectedFile(null);
                  setNewActivity('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información Básica */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Propietario</label>
                  <p className="text-gray-900">{selectedWork.ownerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Propiedad</label>
                  <p className="text-gray-900">{selectedWork.property}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Área</label>
                  <p className="text-gray-900">{selectedWork.area}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Estado</label>
                  {isUpdatingStatus ? (
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-[#2B5F7F] rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none bg-white animate-pulse shadow-lg"
                      autoFocus
                    >
                      <option value="Pendiente de Visita">Pendiente de Visita</option>
                      <option value="En Ejecución">En Ejecución</option>
                      <option value="Terminada">Terminada</option>
                      <option value="No Aplica">No Aplica</option>
                    </select>
                  ) : (
                    (() => {
                      const config = statusConfig[selectedWork.status];
                      const Icon = config.icon;
                      return (
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.bgColor} ${config.color}`}>
                          <Icon className="w-4 h-4" />
                          {selectedWork.status}
                        </span>
                      );
                    })()
                  )}
                </div>
              </div>

              {/* Bitácora de Actividades */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-3">Bitácora de Actividades</label>
                <div className="space-y-3">
                  {selectedWork.workDetails.length > 0 ? (
                    selectedWork.workDetails.map((detail, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-[#2B5F7F] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700 flex-1">{detail}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No hay actividades registradas aún</p>
                  )}
                  
                  {/* Formulario para agregar nueva actividad */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newActivity.trim()) {
                            handleAddActivity();
                          }
                        }}
                        placeholder="Escribe una nueva actividad..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none text-sm"
                      />
                      <button
                        onClick={handleAddActivity}
                        disabled={!newActivity.trim()}
                        className="px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documento (si terminada o si se está actualizando a terminada) */}
              {(selectedWork.status === 'Terminada' || (isUpdatingStatus && newStatus === 'Terminada')) && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-3">Documento Certificado</label>
                  {selectedWork.document && !isUpdatingStatus ? (
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-700">{selectedWork.document}</span>
                    </div>
                  ) : (
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                      <input
                        type="file"
                        id="document-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setSelectedFile(file);
                        }}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="document-upload" className="cursor-pointer">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {selectedFile ? selectedFile.name : 'Subir documento certificado'}
                          </p>
                          <button
                            type="button"
                            onClick={() => document.getElementById('document-upload')?.click()}
                            className="px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors"
                          >
                            {selectedFile ? 'Cambiar Archivo' : 'Seleccionar Archivo'}
                          </button>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Fechas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Inicio</label>
                  <p className="text-gray-900">{new Date(selectedWork.startDate).toLocaleDateString('es-CL')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Última Actualización</label>
                  <p className="text-gray-900">{new Date(selectedWork.updateDate).toLocaleDateString('es-CL')}</p>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {isUpdatingStatus ? (
                  <>
                    <button
                      onClick={() => {
                        setIsUpdatingStatus(false);
                        setNewStatus(selectedWork.status);
                        setSelectedFile(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        const updatedWork = {
                          ...selectedWork,
                          status: newStatus,
                          updateDate: new Date().toISOString().split('T')[0],
                          document: newStatus === 'Terminada' && selectedFile ? selectedFile.name : selectedWork.document,
                        };
                        setWorks(works.map(w => w.id === selectedWork.id ? updatedWork : w));
                        setSelectedWork(updatedWork);
                        setIsUpdatingStatus(false);
                        setSelectedFile(null);
                      }}
                      className="flex-1 px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors font-medium"
                    >
                      Guardar Cambios
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setSelectedWork(null);
                        setIsUpdatingStatus(false);
                        setNewStatus('');
                        setSelectedFile(null);
                        setNewActivity('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={() => {
                        setIsUpdatingStatus(true);
                        setNewStatus(selectedWork.status);
                        setSelectedFile(null);
                      }}
                      className="flex-1 px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors font-medium"
                    >
                      Actualizar Estado
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

