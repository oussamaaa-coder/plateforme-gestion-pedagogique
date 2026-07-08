import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../api/dashboard';
import { toast } from 'react-toastify';
import { extractApiError } from '../../api/http';
import { 
    GraduationCap, 
    Presentation, 
    Layers, 
    BookOpen, 
    TrendingUp, 
    UserCircle, 
    Calendar, 
    CheckCircle, 
    XCircle,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';
import { getInitials } from '../../../core';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await getDashboardStats();
                setData(resp.data);
            } catch (err) {
                toast.error(extractApiError(err));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div className="admin-spinner" />
            </div>
        );
    }

    const { stats, recent_news, recent_absences, filiere_distribution } = data || {};

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Tableau de bord</h1>
                    <div className="breadcrumb">
                        <span>Administration</span>
                        <ChevronRight size={14} className="breadcrumb-separator" />
                        <span>Accueil</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: '500' }}>
                        Dernière mise à jour: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Étudiants', val: stats?.students_count || 0, icon: GraduationCap, color: '#3B82F6', bg: '#EFF6FF' },
                    { label: 'Formateurs', val: stats?.trainers_count || 0, icon: Presentation, color: '#8B5CF6', bg: '#F5F3FF' },
                    { label: 'Groupes', val: stats?.groupes_count || 0, icon: Layers, color: '#F59E0B', bg: '#FFFBEB' },
                    { label: 'Modules', val: stats?.modules_count || 0, icon: BookOpen, color: '#10B981', bg: '#ECFDF5' },
                ].map((stat, i) => (
                    <div key={i} className="table-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: stat.bg, color: stat.color }}>
                                <stat.icon size={24} />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--admin-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ArrowUpRight size={14} /> +2%
                            </span>
                        </div>
                        <div>
                            <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--admin-text-muted)', marginBottom: '4px' }}>{stat.label}</p>
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--admin-text-main)', margin: 0 }}>{stat.val}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Main Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Recent News */}
                <div className="table-card">
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--admin-text-main)', margin: 0 }}>Actualités Récentes</h2>
                        <Link to="/admin/news" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Voir tout</Link>
                    </div>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Date</th>
                                    <th style={{ textAlign: 'center' }}>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_news?.map(news => (
                                    <tr key={news.id}>
                                        <td style={{ fontWeight: '600', fontSize: '13px' }}>
                                            {news.titre.replace(/<[^>]*>/g, '').substring(0, 40)}...
                                        </td>
                                        <td style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                                            {new Date(news.created_at).toLocaleDateString()}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`badge ${news.statut === 'publiee' ? 'badge-success' : 'badge-warning'}`}>
                                                {news.statut}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Filiere Distribution */}
                <div className="table-card">
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-border)' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--admin-text-main)', margin: 0 }}>Répartition par Filière</h2>
                    </div>
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filiere_distribution?.map(item => (
                            <div key={item.filiere_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--admin-surface)', borderRadius: 'var(--radius-md)' }}>
                                <div>
                                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--admin-text-main)', margin: 0 }}>{item.filiere?.nom || 'Inconnue'}</h3>
                                    <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>Effectif total</span>
                                </div>
                                <span className="badge badge-info" style={{ fontSize: '14px', padding: '6px 12px' }}>{item.total}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Absences Table */}
            <div className="table-card">
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-border)' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--admin-text-main)', margin: 0 }}>Suivi des Absences</h2>
                </div>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Étudiant</th>
                                <th>Filière & Groupe</th>
                                <th>Date d'absence</th>
                                <th style={{ textAlign: 'center' }}>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent_absences?.map(abs => (
                                <tr key={abs.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="avatar-circle" style={{ width: '32px', height: '32px', fontSize: '11px' }}>
                                                {getInitials(`${abs.user?.prenom} ${abs.user?.nom}`)}
                                            </div>
                                            <span style={{ fontWeight: '600' }}>{abs.user?.prenom} {abs.user?.nom}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600', fontSize: '13px' }}>{abs.user?.groupe?.nom || 'N/A'}</span>
                                            <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{abs.user?.groupe?.filiere?.nom || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                                        <Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                        {new Date(abs.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {abs.justifie ?
                                            <span className="badge badge-success">Justifiée</span> :
                                            <span className="badge badge-danger">Non justifiée</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .admin-spinner { width: 40px; height: 40px; border: 4px solid var(--admin-accent-soft); border-top-color: var(--admin-accent); border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}} />
        </div>
    );
};

export default Dashboard;
