import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OwnersPanel from './components/OwnersPanel';
import PortalPanel from './components/PortalPanel';
import TrackingPanel from './components/TrackingPanel';
import AdminPanel from './components/AdminPanel';
import TicketsPanel from './components/TicketsPanel';
import TrazabilityPanel from './components/TrazabilityPanel';
import SchedulingPanel from './components/SchedulingPanel';
import DashboardPanel from './components/DashboardPanel';
import NotificationsPanel from './components/NotificationsPanel';

function Dashboard() {
  const { loading, user } = useAuth();
  // Para técnicos, iniciar en tickets; para otros, en portal
  const [activeSection, setActiveSection] = useState(user?.role === 'tecnico' ? 'tickets' : 'portal');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Actualizar sección inicial cuando cambia el usuario
  useEffect(() => {
    if (user?.role === 'tecnico' && activeSection === 'portal') {
      setActiveSection('tickets');
    }
  }, [user, activeSection]);

  const getSectionTitle = (section: string) => {
    if (section === 'portal') {
      return user?.role === 'admin' ? 'Portal de Administrador' : 'Portal del Propietario';
    }
    const titles: Record<string, string> = {
      tickets: 'Sistema de Tickets',
      trazability: 'Trazabilidad',
      owners: 'Gestión de Propietarios',
      tracking: 'Seguimiento de Trabajos',
      scheduling: 'Agendamiento',
      dashboard: 'Dashboard y Reportes',
      notifications: 'Notificaciones',
      admin: 'Administración',
    };
    return titles[section] || section;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B5F7F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-[230px] transition-all duration-300">
        <Header
          title={getSectionTitle(activeSection)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="pt-16 px-3 sm:px-4 md:px-6 pb-8 transition-all duration-300">
          {activeSection === 'portal' && user?.role !== 'tecnico' && <PortalPanel onNavigate={setActiveSection} />}
          {activeSection === 'tickets' && <TicketsPanel />}
          {activeSection === 'trazability' && <TrazabilityPanel />}
          {activeSection === 'owners' && <OwnersPanel searchQuery={searchQuery} />}
          {activeSection === 'tracking' && <TrackingPanel />}
          {activeSection === 'scheduling' && <SchedulingPanel />}
          {activeSection === 'dashboard' && <DashboardPanel />}
          {activeSection === 'notifications' && <NotificationsPanel />}
          {activeSection === 'admin' && <AdminPanel />}
          {user?.role === 'tecnico' && activeSection === 'portal' && (
            <div className="text-center py-12">
              <p className="text-gray-600">Selecciona una opción del menú lateral</p>
            </div>
          )}
        </main>
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B5F7F]"></div>
      </div>
    );
  }

  return user ? <Dashboard /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
