import { useState, useEffect, useMemo } from 'react';
import { ClipboardList, CheckCircle2, Clock, XCircle, AlertCircle, Filter, Download, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Order, mockOrders } from '../lib/mockData';

const statusColors: Record<string, string> = {
  'Completada': 'bg-green-100 text-green-800 border-green-200',
  'En Proceso': 'bg-blue-100 text-blue-800 border-blue-200',
  'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Cerrada Sin Respuesta': 'bg-gray-100 text-gray-800 border-gray-200',
};

interface FiltersType {
  status: string[];
  area: string[];
  tower: string[];
  dateFrom: string;
  dateTo: string;
}

export default function OrdersPanel({ searchQuery }: { searchQuery: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Order>('request_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 20;

  const [filters, setFilters] = useState<FiltersType>({
    status: [],
    area: [],
    tower: [],
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setOrders(mockOrders);
    setLoading(false);
  };

  const filteredOrders = useMemo(() => {
    let result = orders.filter((order) => {
      const matchesSearch =
        searchQuery === '' ||
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone.includes(searchQuery) ||
        order.observation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filters.status.length === 0 || filters.status.includes(order.status);

      const matchesArea =
        filters.area.length === 0 || filters.area.includes(order.area_specialty);

      const matchesTower =
        filters.tower.length === 0 || filters.tower.includes(order.tower);

      const matchesDateFrom =
        !filters.dateFrom || new Date(order.request_date) >= new Date(filters.dateFrom);

      const matchesDateTo =
        !filters.dateTo || new Date(order.request_date) <= new Date(filters.dateTo);

      return matchesSearch && matchesStatus && matchesArea && matchesTower && matchesDateFrom && matchesDateTo;
    });

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === null) return 1;
      if (bVal === null) return -1;

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [orders, searchQuery, filters, sortField, sortDirection]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const stats = useMemo(() => {
    const completed = orders.filter((o) => o.status === 'Completada').length;
    const inProgress = orders.filter((o) => o.status === 'En Proceso').length;
    const pending = orders.filter((o) => o.status === 'Pendiente').length;
    const closed = orders.filter((o) => o.status === 'Cerrada Sin Respuesta').length;

    return { total: orders.length, completed, inProgress, pending, closed };
  }, [orders]);

  const uniqueAreas = useMemo(() => [...new Set(orders.map((o) => o.area_specialty))], [orders]);
  const uniqueTowers = useMemo(() => [...new Set(orders.map((o) => o.tower))], [orders]);

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: keyof Order }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const exportToCSV = () => {
    const headers = ['Número de Orden', 'Propietario', 'Teléfono', 'Torre', 'N° Municipal', 'Fecha Solicitud', 'Método Recepción', 'Observación', 'Área', 'Estado', 'Fecha Agendada'];
    const rows = filteredOrders.map(order => [
      order.order_number,
      order.owner_name,
      order.phone,
      order.tower,
      order.municipal_number,
      order.request_date,
      order.reception_method,
      order.observation,
      order.area_specialty,
      order.status,
      order.scheduled_date || ''
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ordenes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B5F7F]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Órdenes</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <ClipboardList className="w-8 h-8 sm:w-10 sm:h-10 text-[#2B5F7F] opacity-20 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Completadas</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 opacity-20 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">En Proceso</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 opacity-20 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Pendientes</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 opacity-20 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Sin Respuesta</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-600">{stats.closed}</p>
            </div>
            <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600 opacity-20 flex-shrink-0" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Órdenes de Servicio</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
            <button
              onClick={exportToCSV}
              className="px-3 sm:px-4 py-2 bg-[#00B050] hover:bg-[#009040] text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
              <span className="sm:hidden">CSV</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <div className="space-y-2">
                  {['Completada', 'En Proceso', 'Pendiente', 'Cerrada Sin Respuesta'].map((status) => (
                    <label key={status} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, status: [...filters.status, status] });
                          } else {
                            setFilters({ ...filters, status: filters.status.filter((s) => s !== status) });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Área</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {uniqueAreas.map((area) => (
                    <label key={area} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.area.includes(area)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, area: [...filters.area, area] });
                          } else {
                            setFilters({ ...filters, area: filters.area.filter((a) => a !== area) });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Torre</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {uniqueTowers.map((tower) => (
                    <label key={tower} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.tower.includes(tower)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, tower: [...filters.tower, tower] });
                          } else {
                            setFilters({ ...filters, tower: filters.tower.filter((t) => t !== tower) });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{tower}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Desde</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Hasta</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFilters({ status: [], area: [], tower: [], dateFrom: '', dateTo: '' })}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('order_number')}>
                  <div className="flex items-center gap-1">N° Orden <SortIcon field="order_number" /></div>
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('owner_name')}>
                  <div className="flex items-center gap-1">Propietario <SortIcon field="owner_name" /></div>
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100 hidden sm:table-cell" onClick={() => handleSort('phone')}>
                  <div className="flex items-center gap-1">Teléfono <SortIcon field="phone" /></div>
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('tower')}>
                  <div className="flex items-center gap-1">Torre <SortIcon field="tower" /></div>
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100 hidden md:table-cell" onClick={() => handleSort('municipal_number')}>
                  <div className="flex items-center gap-1">N° Municipal <SortIcon field="municipal_number" /></div>
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('request_date')}>
                  <div className="flex items-center gap-1">Fecha <SortIcon field="request_date" /></div>
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100 hidden lg:table-cell" onClick={() => handleSort('area_specialty')}>
                  <div className="flex items-center gap-1">Área <SortIcon field="area_specialty" /></div>
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">Estado <SortIcon field="status" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-3 sm:px-4 py-3 text-sm font-medium text-gray-900">{order.order_number}</td>
                  <td className="px-3 sm:px-4 py-3 text-sm text-gray-700 truncate max-w-[120px]">{order.owner_name}</td>
                  <td className="px-3 sm:px-4 py-3 text-sm text-gray-700 hidden sm:table-cell">{order.phone}</td>
                  <td className="px-3 sm:px-4 py-3 text-sm text-gray-700">{order.tower}</td>
                  <td className="px-3 sm:px-4 py-3 text-sm text-gray-700 hidden md:table-cell">{order.municipal_number}</td>
                  <td className="px-3 sm:px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {new Date(order.request_date).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-sm text-gray-700 hidden lg:table-cell">{order.area_specialty}</td>
                  <td className="px-3 sm:px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-3 sm:px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredOrders.length)} de {filteredOrders.length} órdenes
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-xs sm:text-sm text-gray-700 px-2">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Detalle de Orden</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Número de Orden</label>
                  <p className="text-gray-900 font-semibold">{selectedOrder.order_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Estado</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Propietario</label>
                  <p className="text-gray-900">{selectedOrder.owner_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono</label>
                  <p className="text-gray-900">{selectedOrder.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Torre</label>
                  <p className="text-gray-900">{selectedOrder.tower}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">N° Municipal</label>
                  <p className="text-gray-900">{selectedOrder.municipal_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Área</label>
                  <p className="text-gray-900">{selectedOrder.area_specialty}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Solicitud</label>
                  <p className="text-gray-900">{new Date(selectedOrder.request_date).toLocaleDateString('es-CL')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Método Recepción</label>
                  <p className="text-gray-900">{selectedOrder.reception_method}</p>
                </div>
              </div>

              {selectedOrder.scheduled_date && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Agendada</label>
                  <p className="text-gray-900">{new Date(selectedOrder.scheduled_date).toLocaleDateString('es-CL')}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Observación</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedOrder.observation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
