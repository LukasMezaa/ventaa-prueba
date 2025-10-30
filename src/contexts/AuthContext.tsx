import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../lib/mockData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
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
      };
    } else if (email === 'propietario@propietario.com' && password === 'propietario') {
      mockUser = {
        id: '2',
        email,
        name: 'Propietario',
        role: 'propietario',
      };
    } else {
      throw new Error('Credenciales inválidas. Use admin@admin.com / admin o propietario@propietario.com / propietario');
    }
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
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
