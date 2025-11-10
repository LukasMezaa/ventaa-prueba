import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Calendar, Download } from 'lucide-react';
import { Order, mockOrders } from '../lib/mockData';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MetricsPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<'month' | 'quarter' | 'year'>('year');

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

  const monthlyTrends = useMemo(() => {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlyData: Record<string, { month: string; ordenes: number }> = {};

    orders.forEach((order) => {
      const date = new Date(order.createdDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { month: monthLabel, ordenes: 0 };
      }
      monthlyData[key].ordenes++;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([, value]) => value);
  }, [orders]);

  const statusData = useMemo(() => {
    const statusCount: Record<string, number> = {};
    orders.forEach((order) => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const areaData = useMemo(() => {
    const areaCount: Record<string, number> = {};
    orders.forEach((order) => {
      const area = order.area ?? 'Sin área';
      areaCount[area] = (areaCount[area] || 0) + 1;
    });

    return Object.entries(areaCount)
      .map(([name, ordenes]) => ({ name, ordenes }))
      .sort((a, b) => b.ordenes - a.ordenes);
  }, [orders]);

  const stats = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter((o) => o.status === 'Completada').length;
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';
    const avgResolutionTime = '4.5';

    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthlyOrders = orders.filter((o) => {
      const date = new Date(o.createdDate);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).length;

    return { total, completed, completionRate, avgResolutionTime, monthlyOrders };
  }, [orders]);

  const COLORS = ['#2B5F7F', '#00B050', '#FFA500', '#808080'];

  const exportReport = () => {
    const reportData = {
      fecha: new Date().toISOString().split('T')[0],
      estadisticas: stats,
      tendenciaMensual: monthlyTrends,
      distribucionEstado: statusData,
      distribucionArea: areaData,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_metricas_${new Date().toISOString().split('T')[0]}.json`;
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setPeriodFilter('month')}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
              periodFilter === 'month'
                ? 'bg-[#2B5F7F] text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Mes
          </button>
          <button
            onClick={() => setPeriodFilter('quarter')}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
              periodFilter === 'quarter'
                ? 'bg-[#2B5F7F] text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Trimestre
          </button>
          <button
            onClick={() => setPeriodFilter('year')}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
              periodFilter === 'year'
                ? 'bg-[#2B5F7F] text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Año
          </button>
        </div>
        <button
          onClick={exportReport}
          className="px-3 sm:px-4 py-2 bg-[#00B050] hover:bg-[#009040] text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar Reporte</span>
          <span className="sm:hidden">Exportar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Órdenes Totales</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-[#2B5F7F] opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tasa de Completitud</p>
              <p className="text-3xl font-bold text-[#00B050]">{stats.completionRate}%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-[#00B050] opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tiempo Promedio</p>
              <p className="text-3xl font-bold text-[#2B5F7F]">{stats.avgResolutionTime} días</p>
            </div>
            <Calendar className="w-10 h-10 text-[#2B5F7F] opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Órdenes del Mes</p>
              <p className="text-3xl font-bold text-gray-800">{stats.monthlyOrders}</p>
            </div>
            <Calendar className="w-10 h-10 text-gray-800 opacity-20" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Tendencia Mensual de Órdenes</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="ordenes"
                stroke="#2B5F7F"
                strokeWidth={3}
                dot={{ fill: '#2B5F7F', r: 5 }}
                activeDot={{ r: 7 }}
                name="Órdenes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => `${props.name}: ${(props.percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Órdenes por Área de Especialidad</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={areaData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
            <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="ordenes" fill="#00B050" radius={[8, 8, 0, 0]} name="Órdenes" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 overflow-hidden">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Tabla de Rendimiento por Área</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Área</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Órdenes</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Completadas</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pendientes</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">% Completitud</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {areaData.map((area) => {
                const areaOrders = orders.filter((o) => (o.area ?? 'Sin área') === area.name);
                const completed = areaOrders.filter((o) => o.status === 'Completada').length;
                const pending = areaOrders.filter((o) => o.status === 'Pendiente' || o.status === 'En Proceso').length;
                const completionRate = area.ordenes > 0 ? ((completed / area.ordenes) * 100).toFixed(1) : '0';

                return (
                  <tr key={area.name} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-3 text-sm font-medium text-gray-900">{area.name}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-gray-700">{area.ordenes}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-green-600 font-semibold">{completed}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-yellow-600 font-semibold">{pending}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px] sm:max-w-[100px]">
                          <div
                            className="bg-[#00B050] h-2 rounded-full transition-all"
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-xs sm:text-sm">{completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
