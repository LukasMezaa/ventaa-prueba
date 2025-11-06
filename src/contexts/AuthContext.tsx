import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../lib/mockData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (rut: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simular verificación de sesión
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signIn = async (rut: string, password: string) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Usuarios por RUT y contraseña (todos los roles)
    // Nota: El RUT del propietario debe coincidir con uno en mockPropertyOwners
    const users: { [key: string]: { password: string; name: string; role: 'admin' | 'propietario' | 'tecnico' } } = {
      '12345678-9': { password: 'admin123', name: 'Administrador', role: 'admin' },
      '20.925.879-k': { password: 'propietario123', name: 'Propietario', role: 'propietario' },
      '20925879-k': { password: 'propietario123', name: 'Propietario', role: 'propietario' }, // Formato sin puntos
      '11111111-1': { password: 'tecnico123', name: 'Técnico (Carpintería)', role: 'tecnico' },
      '22222222-2': { password: 'tecnico123', name: 'Técnico (Gasfitería)', role: 'tecnico' },
      '33333333-3': { password: 'tecnico123', name: 'Técnico General', role: 'tecnico' },
    };
    
    const userData = users[rut];
    
    if (userData && userData.password === password) {
      const mockUser: User = {
        id: `user-${rut}`,
        email: `${rut}@sistema.com`,
        name: userData.name,
        role: userData.role,
        password: '',
        lastLogin: new Date().toISOString(),
        rut: rut, // Guardar el RUT para búsquedas posteriores
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } else {
      throw new Error('RUT o contraseña inválidos. Verifique las credenciales e intente nuevamente.');
    }
  };

  const signOut = async () => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
