import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/useStore';
import { store } from '../lib/store';
import { cn } from '../lib/utils';
import {
  Menu, Search, Bell, Mail, ChevronDown, User as UserIcon, Settings, LogOut, Award
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  onToggleNotifications: () => void;
  onProfileClick: () => void;
  onLogoClick: () => void;
  unreadCount: number;
}

export function Header({ onMenuClick, onToggleNotifications, onProfileClick, onLogoClick, unreadCount }: HeaderProps) {
  const { currentUser, getUnreadMessageCount } = useStore();
  const navigate = useNavigate();
  const unreadMessages = getUnreadMessageCount();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="h-16 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors">
          <Menu className="w-5 h-5 text-[#64748B]" />
        </button>
        <div
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          onClick={onLogoClick}
        >
          <div className="w-7 h-7 rounded-lg bg-[#0EA5E9] flex items-center justify-center shadow-sm shadow-[#0EA5E9]/20 group-hover:scale-105 transition-transform overflow-hidden">
            <img src="/Lovi-app/icon.svg" alt="Lovi" className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-[#0F172A] tracking-tight hidden sm:inline">Lovi</span>
        </div>

        <div className="relative hidden md:block w-80 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
          <input
            type="text"
            placeholder="Search jobs, professionals, or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#94A3B8] bg-white border border-[#E2E8F0] px-1.5 py-0.5 rounded font-mono hidden lg:inline">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/messages')} className="relative p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors group">
          <Mail className="w-5 h-5 text-[#64748B] group-hover:text-[#0EA5E9] transition-colors" />
          {unreadMessages > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[#0EA5E9] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-1 border border-white">
              {unreadMessages > 9 ? '9+' : unreadMessages}
            </span>
          )}
        </button>

        <button className="relative p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors group" onClick={onToggleNotifications}>
          <Bell className="w-5 h-5 text-[#64748B] group-hover:text-[#0EA5E9] transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[#F59E0B] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-1 border border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="w-px h-6 bg-[#E2E8F0] mx-1" />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-1 hover:bg-[#F8FAFC] p-1.5 pr-3 rounded-lg transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                currentUser?.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#0F172A] leading-tight">{currentUser?.name?.split(' ')[0] || 'User'}</p>
              <p className="text-[9px] text-[#94A3B8] font-medium">{currentUser?.role || 'Member'}</p>
            </div>
            <ChevronDown className={cn("w-3.5 h-3.5 text-[#94A3B8] transition-transform", showUserMenu && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-[#E2E8F0] shadow-xl shadow-[#0F172A]/5 overflow-hidden"
              >
                <div className="p-3 border-b border-[#E2E8F0]">
                  <p className="text-sm font-semibold text-[#0F172A]">{currentUser?.name}</p>
                  <p className="text-[11px] text-[#64748B]">{currentUser?.email}</p>
                </div>
                <div className="p-1.5">
                  <UserMenuItem icon={UserIcon} label="Profile" onClick={() => { onProfileClick(); setShowUserMenu(false); }} />
                  <UserMenuItem icon={Settings} label="Settings" onClick={() => { navigate('/Settings'); setShowUserMenu(false); }} />
                  <UserMenuItem icon={Award} label="Badges & Achievements" onClick={() => setShowUserMenu(false)} />
                </div>
                <div className="p-1.5 border-t border-[#E2E8F0]">
                  <button onClick={() => { store.signOut(); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

function UserMenuItem({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ x: 2 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
    >
      <Icon className="w-4 h-4" />
      {label}
    </motion.button>
  );
}
