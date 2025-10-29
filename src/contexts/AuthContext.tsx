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
    // Login libre - acepta cualquier email/password
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
    };
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
