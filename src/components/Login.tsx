import { useState } from 'react';
import { Building2, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [loginMode, setLoginMode] = useState<'normal' | 'temporal'>('normal');
  const [email, setEmail] = useState('');
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signInWithRut } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginMode === 'temporal') {
        await signInWithRut(rut, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2B5F7F] via-[#1a4a5f] to-[#00B050] p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2B5F7F] to-[#00B050] rounded-xl mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Constructora FJ</h1>
            <p className="text-gray-600">Alto San Miguel II</p>
            <p className="text-sm text-gray-500 mt-2">Sistema de Gestión Post-Venta</p>
          </div>

          {/* Selector de modo de login */}
          <div className="mb-6 flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setLoginMode('normal');
                setError('');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                loginMode === 'normal'
                  ? 'bg-white text-[#2B5F7F] shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Usuario Regular
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('temporal');
                setError('');
                setRut('');
                setPassword('');
              }}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                loginMode === 'temporal'
                  ? 'bg-white text-[#2B5F7F] shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Usuario Temporal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {loginMode === 'normal' ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none transition-all"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-2">
                  RUT (Usuario Temporal)
                </label>
                <input
                  id="rut"
                  type="text"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none transition-all"
                  placeholder="12345678-9"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none transition-all pr-12"
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
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#2B5F7F] to-[#00B050] text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Credenciales de prueba:</p>
            <div className="space-y-2 text-xs">
              {loginMode === 'normal' ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Administrador:</span>
                    <span className="font-mono text-gray-800">admin@admin.com / admin</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Propietario:</span>
                    <span className="font-mono text-gray-800">propietario@propietario.com / propietario</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Técnico 1:</span>
                    <span className="font-mono text-gray-800">12345678-9 / tecnico123</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Técnico 2:</span>
                    <span className="font-mono text-gray-800">98765432-1 / tecnico456</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
