import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Mail, 
  Settings, 
  Bell, 
  Lock, 
  Globe, 
  ChevronRight,
  Camera,
  CheckCircle2,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../../admin/context/AuthContext';
import { fullName, getInitials } from '../../core';
import styles from './FormateurProfile.module.css';

export default function FormateurProfile() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  
  const profileData = {
    name: fullName(user),
    initials: getInitials(fullName(user)),
    departement: 'Département Digital & IA',
    statut: 'Formateur permanent',
    matricule: 'F-' + (user?.id || '000').toString().padStart(5, '0'),
    email: user?.email || 'formateur@ofppt.ma',
    phone: '+212 6 00 00 00 00',
    speciality: 'Développement web fullstack'
  };

  const sections = [
    {
      title: 'Sécurité',
      links: [
        { label: 'Changer le mot de passe', icon: <Lock size={18} strokeWidth={2} />, description: 'Mettez à jour votre mot de passe régulièrement.' },
        { label: 'Double authentification', icon: <Shield size={18} strokeWidth={2} />, description: 'Ajoutez une couche de sécurité supplémentaire.' },
      ]
    },
    {
      title: 'Préférences',
      links: [
        { label: 'Notifications', icon: <Bell size={18} strokeWidth={2} />, description: 'Gérez vos alertes et rappels de séances.' },
        { label: 'Langue de l\'interface', icon: <Globe size={18} strokeWidth={2} />, description: 'Français (Maroc)' },
      ]
    }
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbItem}>Portail</span>
            <ChevronRight size={14} className={styles.breadcrumbSeparator} />
            <span className={styles.breadcrumbActive}>Mon profil & paramètres</span>
          </div>
          <h1>Mon profil</h1>
          <p className={styles.subtitle}>Gérez vos informations personnelles et vos préférences de compte.</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainGrid}>
          {/* Left Column: Personal Info */}
          <div className={styles.leftCol}>
            <div className={styles.profileCard}>
              <div className={styles.profileHero}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatar}>
                    {profileData.initials}
                  </div>
                  <button className={styles.cameraBtn}><Camera size={16} /></button>
                </div>
                <div className={styles.heroText}>
                  <h2>{profileData.name}</h2>
                  <span className={styles.roleBadge}>
                    <CheckCircle2 size={14} strokeWidth={2.5} />
                    {profileData.statut}
                  </span>
                </div>
              </div>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Matricule</span>
                  <span className={styles.value}>{profileData.matricule}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Spécialité</span>
                  <span className={styles.value}>{profileData.speciality}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Département</span>
                  <span className={styles.value}>{profileData.departement}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>{profileData.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Téléphone</span>
                  <span className={styles.value}>{profileData.phone}</span>
                </div>
              </div>

              <button className={styles.editBtn}>
                Modifier mes informations
              </button>
            </div>
          </div>

          {/* Right Column: Settings & Preferences */}
          <div className={styles.rightCol}>
            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Apparence</h3>
                <div className={styles.linkItem} onClick={toggleDarkMode}>
                    <div className={styles.linkIcon}>
                        {darkMode ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
                    </div>
                    <div className={styles.linkContent}>
                        <h4>Mode sombre</h4>
                        <p>{darkMode ? 'Désactiver le mode sombre' : 'Activer le mode sombre pour une lecture plus reposante'}</p>
                    </div>
                    <div className={`${styles.toggle} ${darkMode ? styles.toggleActive : ''}`}>
                        <div className={styles.toggleCircle} />
                    </div>
                </div>
            </div>

            {sections.map((section, idx) => (
              <div key={idx} className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
                <div className={styles.linkList}>
                  {section.links.map((link, lIdx) => (
                    <div key={lIdx} className={styles.linkItem}>
                      <div className={styles.linkIcon}>
                        {link.icon}
                      </div>
                      <div className={styles.linkContent}>
                        <h4>{link.label}</h4>
                        <p>{link.description}</p>
                      </div>
                      <ChevronRight size={18} className={styles.chevron} strokeWidth={2} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <footer className="mt-8 pt-8 border-t border-slate-200 flex justify-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          ISTA NTIC • PORTAIL FORMATEUR
        </p>
      </footer>
    </div>
  );
}
