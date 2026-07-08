import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2,
  Calendar, 
  ClipboardCheck,
  GraduationCap,
  FolderOpen, 
  MessageSquare, 
  Settings,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../../../admin/context/AuthContext';
import { fullName, getInitials } from '../../../core';
import logo from '../../../public_face/assets/images/logo-ofppt.png';
import styles from './FormateurSidebar.module.css';

export default function FormateurSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navGroups = [
    {
      label: 'Principal',
      items: [
        { path: '/formateur', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
      ]
    },
    {
      label: 'Académique',
      items: [
        { path: '/formateur/classes', icon: <Users size={20} />, label: 'Mes groupes' },
        { path: '/formateur/students', icon: <UserSquare2 size={20} />, label: 'Mes étudiants' },
        { path: '/formateur/emploi-du-temps', icon: <Calendar size={20} />, label: 'Emploi du temps' },
      ]
    },
    {
      label: 'Pédagogique',
      items: [
        { path: '/formateur/attendance', icon: <ClipboardCheck size={20} />, label: 'Présences' },
        { path: '/formateur/notes', icon: <GraduationCap size={20} />, label: 'Notes & examens' },
        { path: '/formateur/resources', icon: <FolderOpen size={20} />, label: 'Ressources' },
      ]
    },
    {
      label: 'Paramètres',
      items: [
        { path: '/formateur/discussions', icon: <MessageSquare size={20} />, label: 'Messagerie' },
        { path: '/formateur/profile', icon: <UserIcon size={20} />, label: 'Mon profil' },
      ]
    }
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <img src={logo} alt="OFPPT" className={styles.logo} />
        <span className={styles.brand}>ISTA NTIC SYBA</span>
      </div>

      <nav className={styles.nav}>
        {navGroups.map((group, idx) => (
          <div key={idx} className={styles.navGroup}>
            <span className={styles.groupLabel}>{group.label}</span>
            {group.items.map((item, iIdx) => (
              <NavLink 
                key={iIdx}
                to={item.path} 
                className={({ isActive }) => 
                  `${styles.navItem} ${isActive ? styles.activeItem : ''}`
                }
                end={item.path === '/formateur'}
              >
                <span className={styles.iconWrapper}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

    </aside>
  );
}
