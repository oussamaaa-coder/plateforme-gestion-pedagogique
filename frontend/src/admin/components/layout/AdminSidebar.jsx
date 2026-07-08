import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Layers, 
  BookOpen, 
  Calendar, 
  UserX, 
  UserMinus, 
  FileText, 
  Folder, 
  Newspaper, 
  Bell,
  Building2,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fullName, getInitials } from '../../../core';
import logo from '../../../public_face/assets/images/logo-ofppt.png';

/**
 * AdminSidebar Component
 * Redesigned navigation for the new Premium Admin Module.
 */
export default function AdminSidebar() {
  const { user } = useAuth();

  const navGroups = [
    {
      title: "Général",
      items: [
        { to: "/admin", end: true, icon: <LayoutDashboard />, label: "Dashboard" },
      ]
    },
    {
      title: "Gestion des Utilisateurs",
      roles: ['admin'],
      items: [
        { to: "/admin/students", icon: <Users />, label: "Étudiants" },
        { to: "/admin/trainers", icon: <UserCheck />, label: "Formateurs" },
        { to: "/admin/administrators", icon: <ShieldCheck />, label: "Administrateurs" },
      ]
    },
    {
      title: "Structure Pédagogique",
      items: [
        { to: "/admin/filieres", icon: <Layers />, label: "Filières" },
        { to: "/admin/groupes", icon: <Users />, label: "Groupes" },
        { to: "/admin/modules", icon: <BookOpen />, label: "Modules" },
        { to: "/admin/salles", icon: <Building2 />, label: "Salles" },
      ]
    },
    {
      title: "Planification",
      items: [
        { to: "/admin/schedule", icon: <Calendar />, label: "Emploi du temps" },
        { to: "/admin/absences/students", icon: <UserX />, label: "Absences Étudiants" },
        { to: "/admin/absences/trainers", icon: <UserMinus />, label: "Absences Formateurs" },
        { to: "/admin/notes", icon: <FileText />, label: "Notes" },
      ]
    },
    {
      title: "Contenu",
      items: [
        { to: "/admin/resources", icon: <Folder />, label: "Ressources" },
        { to: "/admin/news", icon: <Newspaper />, label: "Actualités" },
        { to: "/admin/notifications", icon: <Bell />, label: "Notifications" },
        { to: "/admin/settings", icon: <Settings />, label: "Paramètres" },
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo Zone */}
      <Link to="/admin" className="sidebar-logo-zone" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px 20px', textDecoration: 'none' }}>
        <div style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
          <img src={logo} alt="Logo OFPPT" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title" style={{ color: 'white', fontSize: '15px', fontWeight: '800', display: 'block' }}>ISTA NTIC</span>
          <span className="sidebar-logo-subtitle" style={{ color: '#93C5FD', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SYBA</span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto' }}>
        {navGroups.map((group, gIdx) => {
          if (group.roles && !group.roles.includes(user?.role)) return null;

          return (
            <div key={gIdx} style={{ marginBottom: '1rem' }}>
              <div className="sidebar-section-label">{group.title}</div>
              {group.items.map((item, iIdx) => (
                <NavLink 
                  key={iIdx}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => 
                    `sidebar-nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

    </div>
  );
}
