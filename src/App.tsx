import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OwnersPanel from './components/OwnersPanel';
import PortalPanel from './components/PortalPanel';
import SchedulingPanel from './components/SchedulingPanel';
import RequestsPanel from './components/RequestsPanel';
import TrackingPanel from './components/TrackingPanel';
import DashboardPanel from './components/DashboardPanel';
import NotificationsPanel from './components/NotificationsPanel';
import AdminPanel from './components/AdminPanel';
import TicketsPanel from './components/TicketsPanel';

function Dashboard() {
  const { loading } = useAuth();
  const [activeSection, setActiveSection] = useState('portal');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sectionTitles: Record<string, string> = {
    portal: 'Portal del Propietario',
    tickets: 'Sistema de Tickets',
    owners: 'Gestión de Propietarios',
    scheduling: 'Sistema de Agendamiento',
    requests: 'Recepción de Solicitudes',
    tracking: 'Seguimiento de Trabajos',
    dashboard: 'Dashboard y Reportes',
    notifications: 'Notificaciones',
    admin: 'Administración',
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
          title={sectionTitles[activeSection]}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="pt-16 px-3 sm:px-4 md:px-6 pb-8 transition-all duration-300">
          {activeSection === 'portal' && <PortalPanel onNavigate={setActiveSection} />}
          {activeSection === 'tickets' && <TicketsPanel />}
          {activeSection === 'owners' && <OwnersPanel searchQuery={searchQuery} />}
          {activeSection === 'scheduling' && <SchedulingPanel />}
          {activeSection === 'requests' && <RequestsPanel />}
          {activeSection === 'tracking' && <TrackingPanel />}
          {activeSection === 'dashboard' && <DashboardPanel />}
          {activeSection === 'notifications' && <NotificationsPanel />}
          {activeSection === 'admin' && <AdminPanel />}
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
