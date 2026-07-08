import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../../admin/context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

export default function StudentHeader({ toggleSidebar }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden" 
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <NotificationDropdown />

        <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

        <button 
          className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 font-medium text-sm"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}

