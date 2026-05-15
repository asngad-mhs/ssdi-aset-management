import React, { useState, useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { AssetList } from './pages/AssetList';
import { AuditTrail } from './pages/AuditTrail';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

export default function App() {
  const currentUser = useAppStore((state) => state.currentUser);
  const isInitialized = useAppStore((state) => state.isInitialized);
  const setupListeners = useAppStore((state) => state.setupListeners);
  const [activePath, setActivePath] = useState('dashboard');

  useEffect(() => {
    let unsub = () => {};
    if (currentUser) {
      unsub = setupListeners();
    }
    return () => unsub();
  }, [currentUser, setupListeners]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activePath) {
      case 'dashboard':
        return <Dashboard />;
      case 'assets':
        return <AssetList />;
      case 'reports':
        return <Reports />;
      case 'audit':
        return <AuditTrail />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppLayout activePath={activePath} onNavigate={setActivePath}>
      {renderContent()}
    </AppLayout>
  );
}
