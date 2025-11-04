import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../lib/mockData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithRut: (rut: string, password: string) => Promise<void>;
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

  const signIn = async (email: string, password: string) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let mockUser: User | null = null;
    
    // Validar credenciales específicas
    if (email === 'admin@admin.com' && password === 'admin') {
      mockUser = {
        id: '1',
        email,
        name: 'Administrador',
        role: 'admin',
        password: '',
        lastLogin: new Date().toISOString(),
      };
    } else if (email === 'propietario@propietario.com' && password === 'propietario') {
      mockUser = {
        id: '2',
        email,
        name: 'Propietario',
        role: 'propietario',
        password: '',
        lastLogin: new Date().toISOString(),
      };
    } else {
      throw new Error('Credenciales inválidas. Use admin@admin.com / admin o propietario@propietario.com / propietario');
    }
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signInWithRut = async (rut: string, password: string) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Usuarios técnicos temporales (RUT y contraseña del sistema)
    const technicians: { [key: string]: { password: string; name: string } } = {
      '12345678-9': { password: 'tecnico123', name: 'Técnico Juan' },
      '98765432-1': { password: 'tecnico456', name: 'Técnico María' },
    };
    
    const tech = technicians[rut];
    
    if (tech && tech.password === password) {
      const mockUser: User = {
        id: `tech-${rut}`,
        email: `${rut}@temporal.com`,
        name: tech.name,
        role: 'tecnico',
        password: '',
        lastLogin: new Date().toISOString(),
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } else {
      throw new Error('RUT o contraseña inválidos. Use 12345678-9 / tecnico123 o 98765432-1 / tecnico456');
    }
  };

  const signOut = async () => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInWithRut, signOut }}>
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
