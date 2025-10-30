import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Download, AlertCircle } from 'lucide-react';

export default function DashboardPanel() {
  const monthlyData = [
    { month: 'Ene', enEjecucion: 3, pendientes: 5, cerradas: 8 },
    { month: 'Feb', enEjecucion: 4, pendientes: 6, cerradas: 7 },
    { month: 'Mar', enEjecucion: 2, pendientes: 4, cerradas: 10 },
    { month: 'Abr', enEjecucion: 5, pendientes: 7, cerradas: 9 },
    { month: 'May', enEjecucion: 3, pendientes: 5, cerradas: 12 },
    { month: 'Jun', enEjecucion: 6, pendientes: 8, cerradas: 11 },
  ];

  const statusData = [
    { name: 'Pendientes', value: 8 },
    { name: 'En Ejecución', value: 5 },
    { name: 'Terminadas', value: 12 },
    { name: 'No Aplica', value: 2 },
  ];

  const problemTypes = [
    { name: 'Plomería', count: 8 },
    { name: 'Electricidad', count: 6 },
    { name: 'Carpintería', count: 4 },
    { name: 'Pintura', count: 3 },
    { name: 'Gasfitería', count: 2 },
  ];

  const condominiumData = [
    { name: 'Torre A', count: 10 },
    { name: 'Torre B', count: 8 },
    { name: 'Torre C', count: 7 },
  ];

  const COLORS = ['#FDE047', '#3B82F6', '#22C55E', '#94A3B8'];

  return (
    <div className="space-y-6">
      {/* Resumen Ejecutivo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">En Ejecución</p>
              <p className="text-3xl font-bold">5</p>
            </div>
            <TrendingUp className="w-10 h-10 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 mb-1">Pendientes</p>
              <p className="text-3xl font-bold">8</p>
            </div>
            <AlertCircle className="w-10 h-10 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-1">Cerradas</p>
              <p className="text-3xl font-bold">12</p>
            </div>
            <Calendar className="w-10 h-10 opacity-20" />
          </div>
        </div>
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia Mensual */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Tendencia Mensual</h3>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="enEjecucion" fill="#3B82F6" name="En Ejecución" radius={[8, 8, 0, 0]} />
              <Bar dataKey="pendientes" fill="#FDE047" name="Pendientes" radius={[8, 8, 0, 0]} />
              <Bar dataKey="cerradas" fill="#22C55E" name="Cerradas" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por Estado */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Distribución por Estado</h3>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => `${props.name}: ${props.value}`}
                outerRadius={100}
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

      {/* Estadísticas por Tipo de Problema */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Estadísticas por Tipo de Problema</h3>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={problemTypes} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="count" fill="#2B5F7F" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficos Secundarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidencias por Condominio */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Incidencias por Condominio</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={condominiumData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#00B050" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabla de Problemas Recurrentes */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Problemas Recurrentes</h3>
          <div className="space-y-3">
            {problemTypes.map((problem, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2B5F7F] text-white flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-800">{problem.name}</span>
                </div>
                <span className="text-lg font-bold text-[#2B5F7F]">{problem.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Análisis de Tendencias */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Análisis de Tendencias</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Tendencia Actual</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-lg font-bold text-green-600">+12%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs mes anterior</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Tiempo Promedio</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-bold text-blue-600">4.5 días</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">resolución</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Tasa de Cumplimiento</p>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-600" />
              <span className="text-lg font-bold text-purple-600">87%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">en plazo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

