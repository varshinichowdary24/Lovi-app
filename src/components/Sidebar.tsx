import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Search, Briefcase, Bookmark, MapPin, MessageSquare, Bell, Settings, Shield,
  ChevronDown, X, ChevronUp, LogOut, User, HelpCircle, Mail, Home, FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../lib/useStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onProfileClick?: () => void;
}

export function Sidebar({ isOpen, onClose, onRefresh, onProfileClick }: SidebarProps) {
  const { currentUser, unreadCount, getUnreadMessageCount } = useStore();
  const unreadMessages = getUnreadMessageCount();
  const navigate = useNavigate();
  const location = useLocation();

  const mainItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', badge: undefined },
    { id: 'marketplace', label: 'Marketplace', icon: Search, path: '/marketplace', badge: undefined },
    { id: 'my-jobs', label: 'My Projects', icon: FolderKanbanIcon, path: '/my-jobs', badge: undefined },
    { id: 'saved', label: 'Saved Professionals', icon: Bookmark, path: '/saved', roles: ['Client'], badge: undefined },
    { id: 'nearby', label: 'Nearby Experts', icon: MapPin, path: '/nearby', badge: undefined },
  ];

  const supportItems = [
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages', badge: unreadMessages },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications', badge: unreadCount },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const filteredMain = mainItems.filter(item => {
    if (item.roles) return item.roles.includes(currentUser?.role || '');
    return true;
  });

  const navigateTo = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 w-[260px] bg-slate-950 z-50 flex flex-col transition-all duration-300 ease-in-out",
        "lg:translate-x-0 lg:static lg:block",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Section */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20 overflow-hidden">
            <img src="/Lovi-app/icon.svg" alt="Lovi" className="w-6 h-6" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Lovi</span>
          <span className="text-[9px] font-bold text-sky-400 bg-sky-400/10 px-1.5 py-0.5 rounded-full ml-auto border border-sky-400/20">BETA</span>
        </div>

        {/* Main Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main</p>
          {filteredMain.map(item => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.path)}
              badge={item.badge}
              onClick={() => navigateTo(item.path)}
            />
          ))}

          <div className="my-4 border-t border-white/5" />

          <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support</p>
          {supportItems.map(item => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.path)}
              badge={item.badge}
              onClick={() => navigateTo(item.path)}
            />
          ))}

          {currentUser?.role === 'Admin' && (
            <>
              <div className="my-4 border-t border-white/5" />
              <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin</p>
              <SidebarItem
                icon={Shield}
                label="Admin Panel"
                isActive={location.pathname === '/analytics'}
                onClick={() => navigateTo('/analytics')}
              />
            </>
          )}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/5 flex-shrink-0 space-y-3">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Need help?</p>
                <p className="text-[9px] text-slate-400">We're here 24/7</p>
              </div>
            </div>
            <button className="w-full py-2 bg-white/10 text-[11px] font-bold text-white rounded-lg hover:bg-white/20 transition-colors border border-white/5">
              Contact Support
            </button>
          </div>

          {currentUser && (
            <button
              onClick={() => { onProfileClick?.(); onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  currentUser.name?.charAt(0).toUpperCase() || <User className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[9px] text-slate-400">{currentUser.role}</p>
              </div>
              <ChevronUp className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ icon: Icon, label, isActive, badge, onClick }: {
  icon: any;
  label: string;
  isActive: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium group relative",
        isActive
          ? "text-white bg-white/10"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      <span className={cn(
        "absolute left-0 w-0.5 h-5 rounded-r-full transition-all",
        isActive ? "bg-sky-400" : "bg-transparent"
      )} />
      <Icon className={cn(
        "w-4.5 h-4.5 flex-shrink-0 transition-colors",
        isActive ? "text-sky-400" : "text-slate-500 group-hover:text-sky-400"
      )} />
      <span className="truncate">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto min-w-[18px] h-4.5 bg-sky-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </motion.button>
  );
}

function FolderKanbanIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <path d="M8 10v4" />
      <path d="M12 10v2" />
      <path d="M16 10v6" />
    </svg>
  );
}
