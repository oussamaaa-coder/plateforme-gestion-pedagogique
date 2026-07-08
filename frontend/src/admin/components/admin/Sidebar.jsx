import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../../public_face/assets/images/logo-ofppt.png';
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
    Bell
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const { user } = useAuth();
    
    // Simple helper to add "active" class
    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <div className="sidebar" id="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Link to="/admin">
                        <img src={logo} className="img-fluid logo" alt="Logo" style={{ maxHeight: '50px' }} />
                        <img src={logo} className="img-fluid logo-small" alt="Logo" style={{ maxHeight: '30px', display: 'none' }} />
                    </Link>
                </div>
            </div>
            <div className="sidebar-inner slimscroll">
                <div id="sidebar-menu" className="sidebar-menu">
                    {/* Main */}
                    <ul>
                        <li className="menu-title"><span>Main</span></li>
                        <li className="submenu">
                            <Link to="/admin"><LayoutDashboard size={18} className="me-2" /> <span> Dashboard</span></Link>
                        </li>
                    </ul>
                    {/* /Main */}

                    {/* Users Management (admin only) */}
                    {user?.role === 'admin' && (
                        <ul>
                            <li className="menu-title"><span>Gestion des utilisateurs</span></li>
                            <li>
                                <Link to="/admin/students" className={isActive('/admin/students')}><Users size={18} className="me-2" /> <span>Étudiants</span></Link>
                            </li>
                            <li>
                                <Link to="/admin/trainers" className={isActive('/admin/trainers')}><UserCheck size={18} className="me-2" /> <span>Formateurs</span></Link>
                            </li>
                            <li>
                                <Link to="/admin/administrators" className={isActive('/admin/administrators')}><ShieldCheck size={18} className="me-2" /> <span>Administrateurs</span></Link>
                            </li>
                        </ul>
                    )}
                    {/* /Users Management */}

                    {/* Pedagogical Structure */}
                    <ul>
                        <li className="menu-title"><span>Structure pédagogique</span></li>
                        <li>
                            <Link to="/admin/filieres" className={isActive('/admin/filieres')}><Layers size={18} className="me-2" /> <span>Filières</span></Link>
                        </li>
                        <li>
                            <Link to="/admin/groupes" className={isActive('/admin/groupes')}><Users size={18} className="me-2" /> <span>Groupes</span></Link>
                        </li>
                        <li>
                            <Link to="/admin/modules" className={isActive('/admin/modules')}><BookOpen size={18} className="me-2" /> <span>Modules</span></Link>
                        </li>
                    </ul>
                    {/* /Pedagogical Structure */}

                    {/* Schedule */}
                    <ul>
                        <li className="menu-title"><span>Planing</span></li>                           
                        <li>
                            <Link to="/admin/schedule" className={isActive('/admin/schedule')}><Calendar size={18} className="me-2" /> <span>Emplois du temps</span></Link>
                        </li>
                        <li>
                            <Link to="/admin/absences/students" className={isActive('/admin/absences/students')}><UserX size={18} className="me-2" /> <span>Absences Étudiants</span></Link>
                        </li>
                        <li>
                            <Link to="/admin/absences/trainers" className={isActive('/admin/absences/trainers')}><UserMinus size={18} className="me-2" /> <span>Absences Formateurs</span></Link>
                        </li>
                        <li>
                            <Link to="/admin/notes" className={isActive('/admin/notes')}><FileText size={18} className="me-2" /> <span>Notes</span></Link>
                        </li>
                    </ul>
                    {/* /Schedule */}

                    {/* Resources & Content */}
                    <ul>
                        <li className="menu-title"><span>Ressources & Contenu</span></li>                           
                        <li>
                            <Link to="/admin/resources" className={isActive('/admin/resources')}><Folder size={18} className="me-2" /> <span>Ressources</span></Link>
                        </li>
                        {user?.role === 'admin' && (
                            <li>
                                <Link to="/admin/news" className={isActive('/admin/news')}><Newspaper size={18} className="me-2" /> <span>News</span></Link>
                            </li>
                        )}
                        <li>
                            <Link to="/admin/notifications" className={isActive('/admin/notifications')}><Bell size={18} className="me-2" /> <span>Notifications</span></Link>
                        </li>
                    </ul>
                    {/* /Resources & Content */}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
