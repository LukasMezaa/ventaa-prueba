import { useState, useEffect, useMemo } from 'react';
import { Users, Home, Shield, ShieldCheck, X, Mail, Phone, Filter, Plus } from 'lucide-react';
import { PropertyOwner, mockPropertyOwners } from '../lib/mockData';

const warrantyColors: Record<string, string> = {
  'Activa': 'bg-green-100 text-green-800 border-green-200',
  'Vencida': 'bg-red-100 text-red-800 border-red-200',
};

export default function OwnersPanel({ searchQuery }: { searchQuery: string }) {
  const [owners, setOwners] = useState<PropertyOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState<PropertyOwner | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedTower, setSelectedTower] = useState<string>('');
  const [selectedCondominium, setSelectedCondominium] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    phone: '',
    alternative_phone: '',
    condominium: 'condominio I',
    tower: '',
    municipal_number: '',
    email: '',
  });

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setLoading(true);
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setOwners(mockPropertyOwners);
    setLoading(false);
  };

  const handleCreateOwner = () => {
    const nowIso = new Date().toISOString();
    const towerValue = formData.tower.trim();
    
    // Formatear torre según el formato esperado
    let formattedTower = towerValue.toLowerCase();
    if (formattedTower.match(/^torre\s*\(?\d+\)?/)) {
      // Si ya tiene el formato correcto, mantenerlo
    } else if (formattedTower.match(/^\d+$/)) {
      formattedTower = `torre ${formattedTower}`;
    }

    const newOwner: PropertyOwner = {
      id: `asm2-${Date.now()}`,
      name: formData.name.trim(),
      rut: formData.rut.trim().toLowerCase(),
      phone: formData.phone.trim(),
      alternative_phone: formData.alternative_phone.trim() || null,
      condominium: formData.condominium.trim(),
      tower: formattedTower,
      municipal_number: formData.municipal_number.trim(),
      email: formData.email.trim().toLowerCase() || '',
      reception_date: nowIso,
      status: 'Activo',
      update_date: nowIso,
      warranty_years: 2,
      warranty_status: 'Activa',
      created_at: nowIso,
    };

    // Agregar al principio del array
    setOwners([newOwner, ...owners]);
    
    // Limpiar formulario
    setFormData({
      name: '',
      rut: '',
      phone: '',
      alternative_phone: '',
      condominium: 'condominio I',
      tower: '',
      municipal_number: '',
      email: '',
    });
    
    setShowCreateModal(false);
  };

  const filteredOwners = useMemo(() => {
    return owners.filter((owner) => {
      const matchesSearch =
        searchQuery === '' ||
        owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (owner.rut || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (owner.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner.phone.includes(searchQuery) ||
        owner.tower.toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner.municipal_number.includes(searchQuery);

      // Filtro por torre
      const matchesTower = selectedTower === '' || (() => {
        const towerLower = owner.tower.toLowerCase();
        if (selectedTower === '1') {
          // Torre 1 debe incluir también discapacitado (pero solo los de torre 1)
          return towerLower.includes('torre 1') || 
                 towerLower.includes('torre(1)');
        } else {
          // Para otras torres, buscar el número específico y excluir discapacitados de otras torres
          return towerLower.includes(`torre ${selectedTower}`) && 
                 !towerLower.includes('discapacitado');
        }
      })();

      // Filtro por condominio
      const matchesCondominium = selectedCondominium === '' || 
        owner.condominium.toLowerCase() === selectedCondominium.toLowerCase();

      return matchesSearch && matchesTower && matchesCondominium;
    });
  }, [owners, searchQuery, selectedTower, selectedCondominium]);

  const stats = useMemo(() => {
    const totalOwners = owners.length;
    const activeWarranties = owners.filter((o) => o.warranty_status === 'Activa').length;
    const expiredWarranties = owners.filter((o) => o.warranty_status === 'Vencida').length;

    return { totalOwners, activeWarranties, expiredWarranties };
  }, [owners]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B5F7F]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Propietarios</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalOwners}</p>
            </div>
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#2B5F7F] opacity-20 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Garantías Activas</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.activeWarranties}</p>
            </div>
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 opacity-20 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Garantías Vencidas</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.expiredWarranties}</p>
            </div>
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 opacity-20 flex-shrink-0" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Propietarios Registrados</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Propietario</span>
            </button>
          </div>

          {/* Botones de vista y filtros */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Botones de vista - Izquierda */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm ${
                  viewMode === 'cards'
                    ? 'bg-[#2B5F7F] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Tarjetas</span>
                <span className="sm:hidden">Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm ${
                  viewMode === 'table'
                    ? 'bg-[#2B5F7F] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Users className="w-4 h-4" />
                Tabla
              </button>
            </div>

            {/* Filtros - Continuación fluida */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <label className="text-sm text-gray-600 whitespace-nowrap">Filtros:</label>
              
              {/* Filtro de Torre */}
              <div className="relative">
                <select
                  value={selectedTower}
                  onChange={(e) => setSelectedTower(e.target.value)}
                  className="appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none text-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <option value="">Todas las Torres</option>
                  <option value="1">Torre 1 (incluye discapacitado)</option>
                  <option value="2">Torre 2</option>
                  <option value="3">Torre 3</option>
                  <option value="4">Torre 4</option>
                  <option value="5">Torre 5</option>
                </select>
              </div>

              {/* Filtro de Condominio */}
              <div className="relative">
                <select
                  value={selectedCondominium}
                  onChange={(e) => setSelectedCondominium(e.target.value)}
                  className="appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none text-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <option value="">Todos los Condominios</option>
                  <option value="condominio I">Condominio I</option>
                  <option value="condominio II">Condominio II</option>
                </select>
              </div>

              {/* Botón para limpiar filtros */}
              {(selectedTower !== '' || selectedCondominium !== '') && (
                <button
                  onClick={() => {
                    setSelectedTower('');
                    setSelectedCondominium('');
                  }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {viewMode === 'cards' ? (
          <div className="p-3 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredOwners.map((owner) => (
              <div
                key={owner.id}
                onClick={() => setSelectedOwner(owner)}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all cursor-pointer hover:border-[#2B5F7F]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{owner.name}</h4>
                    <p className="text-sm text-gray-600">{owner.condominium}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${warrantyColors[owner.warranty_status]}`}>
                    {owner.warranty_status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Home className="w-4 h-4" />
                    <span>{owner.tower} - {owner.municipal_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{owner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{owner.email || 'no adjunto correo'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#2B5F7F]" />
                    <span className="text-sm text-gray-600">{owner.warranty_years} años</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(owner.reception_date).toLocaleDateString('es-CL')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cliente</th>
                  <th className="px-2 sm:px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">RUT</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">N° Telefono 01</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Correo</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Condominio</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">N° Torre</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">N° Departamento</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase hidden lg:table-cell">Garantía</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOwners.map((owner) => (
                  <tr
                    key={owner.id}
                    onClick={() => setSelectedOwner(owner)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-3 sm:px-4 py-3 text-sm font-medium text-gray-900 truncate max-w-[200px]">{owner.name}</td>
                    <td className="px-2 sm:px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{owner.rut}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-gray-700">{owner.phone}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-gray-700 truncate max-w-[220px]">{owner.email || 'no adjunto correo'}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-gray-700 truncate max-w-[200px]">{owner.condominium}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-gray-700">{owner.tower}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-gray-700">{owner.municipal_number}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-gray-700 hidden lg:table-cell">{owner.warranty_years} años</td>
                    <td className="px-3 sm:px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${warrantyColors[owner.warranty_status]}`}>
                        {owner.warranty_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOwner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4" onClick={() => setSelectedOwner(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Detalle del Propietario</h3>
              <button
                onClick={() => setSelectedOwner(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{selectedOwner.name}</h4>
                  <p className="text-sm sm:text-base text-gray-600">{selectedOwner.condominium}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${warrantyColors[selectedOwner.warranty_status]}`}>
                  {selectedOwner.warranty_status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Torre</label>
                  <p className="text-gray-900 font-semibold">{selectedOwner.tower}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">RUT</label>
                  <p className="text-gray-900 font-semibold">{selectedOwner.rut}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Número de Departamento</label>
                  <p className="text-gray-900 font-semibold">{selectedOwner.municipal_number}</p>
                </div>
              </div>

              <div>
                <h5 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Información de Contacto</h5>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B5F7F] flex-shrink-0" />
                    <div className="min-w-0">
                      <label className="block text-xs font-medium text-gray-600">Teléfono Principal</label>
                      <p className="text-sm sm:text-base text-gray-900 truncate">{selectedOwner.phone}</p>
                    </div>
                  </div>
                  {selectedOwner.alternative_phone && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B5F7F] flex-shrink-0" />
                      <div className="min-w-0">
                        <label className="block text-xs font-medium text-gray-600">Teléfono Alternativo</label>
                        <p className="text-sm sm:text-base text-gray-900 truncate">{selectedOwner.alternative_phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B5F7F] flex-shrink-0" />
                    <div className="min-w-0">
                      <label className="block text-xs font-medium text-gray-600">Correo Electrónico</label>
                      <p className="text-sm sm:text-base text-gray-900 truncate">{selectedOwner.email || 'no adjunto correo'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Información de Garantía</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-[#2B5F7F]/10 to-[#00B050]/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B5F7F]" />
                      <label className="text-xs sm:text-sm font-medium text-gray-600">Años de Garantía</label>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{selectedOwner.warranty_years} años</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">Estado</label>
                    <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${warrantyColors[selectedOwner.warranty_status]}`}>
                      {selectedOwner.warranty_status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Recepción</label>
                  <p className="text-gray-900">{new Date(selectedOwner.reception_date).toLocaleDateString('es-CL')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Última Actualización</label>
                  <p className="text-gray-900">{new Date(selectedOwner.update_date).toLocaleDateString('es-CL')}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Estado del Propietario</label>
                <p className="text-gray-900 font-semibold">{selectedOwner.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear Propietario */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Crear Nuevo Propietario</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateOwner();
              }}
              className="p-4 sm:p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RUT *</label>
                  <input
                    type="text"
                    value={formData.rut}
                    onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none"
                    placeholder="12.345.678-9"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Principal *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none"
                    placeholder="+56912345678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Alternativo</label>
                  <input
                    type="tel"
                    value={formData.alternative_phone}
                    onChange={(e) => setFormData({ ...formData, alternative_phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none"
                    placeholder="+56987654321"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none"
                    placeholder="ejemplo@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condominio *</label>
                  <select
                    value={formData.condominium}
                    onChange={(e) => setFormData({ ...formData, condominium: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none bg-white"
                    required
                  >
                    <option value="condominio I">Condominio I</option>
                    <option value="condominio II">Condominio II</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Torre *</label>
                  <input
                    type="text"
                    value={formData.tower}
                    onChange={(e) => setFormData({ ...formData, tower: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none"
                    placeholder="1, 2, 3, 4, 5 o torre(1)/discapacitado"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Departamento *</label>
                  <input
                    type="text"
                    value={formData.municipal_number}
                    onChange={(e) => setFormData({ ...formData, municipal_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none"
                    placeholder="101"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors font-medium"
                >
                  Crear Propietario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
