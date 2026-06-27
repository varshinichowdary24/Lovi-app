import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { store } from '../lib/store';
import { useStore } from '../lib/useStore';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { unreadCount } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRefresh = async () => {
    toast.loading('Syncing data...', { id: 'refresh' });
    try {
      await store.load();
      toast.success('Data synchronized!', { id: 'refresh' });
    } catch (err) {
      toast.error('Sync failed.', { id: 'refresh' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Toaster position="bottom-right" />
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onToggleNotifications={() => setShowNotifications(prev => !prev)}
        onProfileClick={() => setShowProfileModal(true)}
        onLogoClick={() => navigate('/marketplace')}
        unreadCount={unreadCount}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onRefresh={handleRefresh}
          onProfileClick={() => setShowProfileModal(true)}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
