import { useState } from 'react';
import { Building2, Eye, EyeOff, Loader2, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(rut, password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadManual = () => {
    // Crear un enlace temporal para descargar el PDF
    const link = document.createElement('a');
    link.href = '/Manual-CFJ.pdf'; // Ruta del PDF en la carpeta public
    link.download = 'Manual-CFJ.pdf';
    link.target = '_blank'; // Abrir en nueva pestaña si no se puede descargar
    
    // Manejar error si el archivo no existe
    link.onerror = () => {
      alert('El archivo de la guía de postventa no está disponible. Por favor, contacte al administrador.');
    };
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2B5F7F] via-[#1a4a5f] to-[#00B050] p-4 relative">
      {/* Botón de descarga de guía en esquina superior derecha - Solo visible en desktop */}
      <div className="hidden sm:block absolute top-4 right-4 z-10">
        <button
          onClick={handleDownloadManual}
          className="group flex flex-col items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all backdrop-blur-sm border border-white/20 text-white hover:border-white/30 text-center"
          title="Descargar Guía de Postventa"
        >
          <p className="text-xs leading-tight max-w-[200px]">
            Si quieres informarte más sobre el manual de uso, cuidado y mantención de la vivienda,{' '}
            <span className="font-semibold underline decoration-2 underline-offset-2">haz clic aquí</span>
          </p>
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Manual de uso</span>
          </div>
        </button>
      </div>
      
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 relative">
          {/* Botón de descarga dentro del login - Solo visible en móvil */}
          <div className="sm:hidden absolute top-2 right-2 z-10">
            <button
              onClick={handleDownloadManual}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2B5F7F]/10 hover:bg-[#2B5F7F]/20 rounded-lg transition-all border border-[#2B5F7F]/20 text-[#2B5F7F] hover:border-[#2B5F7F]/30"
              title="Descargar Guía de Postventa"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium">Manual</span>
            </button>
          </div>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#2B5F7F] to-[#00B050] rounded-xl mb-3">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Constructora FJ</h1>
            <p className="text-xs text-gray-500">Sistema de Gestión Post-Venta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-1.5">
                RUT
              </label>
              <input
                id="rut"
                type="text"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none transition-all"
                placeholder="12345678-9"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#2B5F7F] to-[#00B050] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Credenciales por rol:</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Administrador:</span>
                <span className="font-mono text-gray-800">12345678-9 / admin123</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Propietario:</span>
                <span className="font-mono text-gray-800">20.925.879-k / propietario123</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Técnico (Carpintería):</span>
                <span className="font-mono text-gray-800">11111111-1 / tecnico123</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Técnico (Gasfitería):</span>
                <span className="font-mono text-gray-800">22222222-2 / tecnico123</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Técnico General:</span>
                <span className="font-mono text-gray-800">33333333-3 / tecnico123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
