import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FolderOpen, 
  MessageSquare, 
  UserCircle,
  ChevronRight,
  Star,
  Activity,
  Bell
} from 'lucide-react';
import { useAuth } from '../../../admin/context/AuthContext';
import { fullName, getInitials } from '../../../core';
import logo from '../../../public_face/assets/images/logo-ofppt.png';

export default function StudentSidebar() {
  const { user } = useAuth();

  const links = [
    { to: '/student', end: true, label: 'Tableau de bord', icon: LayoutDashboard },
    { to: '/student/emploi-du-temps', label: 'Emploi du temps', icon: Calendar },
    { to: '/student/ressources', label: 'Médiathèque', icon: FolderOpen },
    { to: '/student/notes', label: 'Mes Notes', icon: Star },
    { to: '/student/assiduite', label: 'Mon Assiduité', icon: Activity },
    { to: '/student/notifications', label: 'Notifications', icon: Bell },
    { to: '/student/discussions', label: 'Discussions', icon: MessageSquare },
    { to: '/student/profil', label: 'Mon Profil', icon: UserCircle },
  ];

  return (
    <aside className="h-full flex flex-col bg-white">
      {/* Logo Header */}
      <div className="p-6">
        <Link to="/student" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <img src={logo} alt="OFPPT" className="w-7 h-7 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 tracking-tight">ISTA NTIC SYBA</span>
            <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">Portail Étudiant</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <div className="pb-4 px-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Menu Principal</span>
        </div>
        {links.map((link, i) => (
          <NavLink 
            key={i}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `
              flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm shadow-indigo-100/50' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <link.icon 
                    size={20} 
                    className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} 
                  />
                  <span className="text-[14px]">{link.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-indigo-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 mt-auto border-t border-slate-100">
        <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3 hover:bg-slate-100 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-200">
            {getInitials(fullName(user))}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-slate-900 truncate">{fullName(user)}</span>
            <span className="text-xs text-slate-500">Étudiant</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

