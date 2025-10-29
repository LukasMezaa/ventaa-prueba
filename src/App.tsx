import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OrdersPanel from './components/OrdersPanel';
import OwnersPanel from './components/OwnersPanel';
import MetricsPanel from './components/MetricsPanel';

function Dashboard() {
  const { loading } = useAuth();
  const [activeSection, setActiveSection] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sectionTitles: Record<string, string> = {
    orders: 'Órdenes de Servicio',
    owners: 'Propietarios',
    metrics: 'Métricas y Reportes',
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
          {activeSection === 'orders' && <OrdersPanel searchQuery={searchQuery} />}
          {activeSection === 'owners' && <OwnersPanel searchQuery={searchQuery} />}
          {activeSection === 'metrics' && <MetricsPanel />}
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
