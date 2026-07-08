import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
    getAllNotifications, 
    deleteNotification, 
    broadcastNotification, 
    createNotification 
} from '../../api/notifications';
import { extractApiError } from '../../api/http';
import { http } from '../../api/http';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { 
    PlusCircle, 
    RefreshCw, 
    Bell, 
    Trash2, 
    Send, 
    Users, 
    Clock,
    User,
    CheckCircle2,
    AlertTriangle,
    Info,
    Search,
    ChevronLeft,
    ChevronRight,
    X,
    Layout,
    Settings
} from 'lucide-react';

const NOTIF_TYPE_CONFIG = {
    info:    { icon: Info,          color: 'var(--admin-info)', bg: 'var(--admin-info-light)', border: '#bfdbfe' },
    warning: { icon: AlertTriangle, color: 'var(--admin-warning)', bg: 'var(--admin-warning-light)', border: '#fde68a' },
    success: { icon: CheckCircle2,  color: 'var(--admin-success)', bg: 'var(--admin-success-light)', border: '#bbf7d0' },
    absence: { icon: Clock,          color: 'var(--admin-danger)', bg: 'var(--admin-danger-light)', border: '#fecaca' },
    note:    { icon: Bell,           color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
    system:  { icon: Send,           color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
};

const NotificationsList = () => {
    const [notifications, setNotifications] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [recipientRole, setRecipientRole] = useState('etudiant');
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [showUserResults, setShowUserResults] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [formData, setFormData] = useState({
        user_id: '',
        title: '',
        message: '',
        type: 'info',
        roles: [] // For broadcast
    });

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                search: searchTerm || undefined,
                type: filterType || undefined,
                page: currentPage,
                per_page: 15
            };
            const resp = await getAllNotifications(params);
            setNotifications(resp?.data?.data || []);
            setTotalPages(resp?.data?.last_page || 1);
        } catch (e) {
            toast.error(extractApiError(e));
        } finally {
            setLoading(false);
        }
    }, [searchTerm, filterType, currentPage]);

    const fetchUsers = useCallback(async (role = recipientRole, searchTermInput = userSearchTerm) => {
        try {
            let endpoint = '/students';
            if (role === 'formateur') endpoint = '/trainers';
            if (role === 'admin') endpoint = '/administrators';

            const { data: resp } = await http.get(endpoint, { 
                params: { 
                    per_page: searchTermInput ? 100 : 50,
                    search: searchTermInput || undefined 
                } 
            });
            setUsers(resp?.data?.data || []);
        } catch (e) {
            console.error('Failed to fetch users', e);
        }
    }, [recipientRole, userSearchTerm]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        if (showModal && !isBroadcasting) {
            const timer = setTimeout(() => {
                fetchUsers();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [showModal, isBroadcasting, fetchUsers]);

    const handleDeleteClick = (id) => {
        setConfirmDeleteId(id);
    };

    const handleDeleteConfirm = async () => {
        if (!confirmDeleteId) return;
        try {
            await deleteNotification(confirmDeleteId);
            setNotifications(notifications.filter(n => n.id !== confirmDeleteId));
            toast.success('Notification supprimée');
            setConfirmDeleteId(null);
        } catch (e) {
            toast.error(extractApiError(e));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (isBroadcasting) {
                await broadcastNotification({
                    title: formData.title,
                    message: formData.message,
                    type: formData.type,
                    roles: formData.roles.length > 0 ? formData.roles : undefined
                });
                toast.success('Diffusion réussie !');
            } else {
                if (!formData.user_id) {
                    toast.warning('Veuillez sélectionner un destinataire');
                    setFormLoading(false);
                    return;
                }
                await createNotification({
                    user_id: formData.user_id,
                    title: formData.title,
                    message: formData.message,
                    type: formData.type
                });
                toast.success('Notification envoyée !');
            }
            setShowModal(false);
            setFormData({ user_id: '', title: '', message: '', type: 'info', roles: [] });
            setUserSearchTerm('');
            fetchNotifications();
        } catch (e) {
            toast.error(extractApiError(e));
        } finally {
            setFormLoading(false);
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterType('');
        setCurrentPage(1);
    };

    return (
        <div className="admin-scope">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Gestion des Notifications</h1>
                    <div className="breadcrumb">
                        <span>Administration</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="text-primary">Notifications</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <button 
                        className="btn btn-secondary shadow-sm"
                        onClick={() => {
                            setIsBroadcasting(false);
                            setShowModal(true);
                            setFormData({ user_id: '', title: '', message: '', type: 'info', roles: [] });
                            setUserSearchTerm('');
                        }}
                    >
                        <PlusCircle size={18} /> Notification Directe
                    </button>
                    <button 
                        className="btn btn-primary shadow-sm"
                        onClick={() => {
                            setIsBroadcasting(true);
                            setShowModal(true);
                            setFormData({ user_id: '', title: '', message: '', type: 'info', roles: [] });
                        }}
                    >
                        <Users size={18} /> Diffusion Globale
                    </button>
                </div>
            </div>

            {/* Barre de Filtres Horizontal */}
            <div className="filter-card mb-4">
                <div className="row align-items-end g-3">
                    <div className="col-12 col-md-5">
                        <div className="form-group mb-0">
                            <label className="mb-2">Recherche</label>
                            <div className="search-container w-100">
                                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input 
                                    type="text" 
                                    placeholder="Message, titre ou utilisateur..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-3">
                        <div className="form-group mb-0">
                            <label className="mb-2">Type</label>
                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                <option value="">Tous les types</option>
                                <option value="info">Information</option>
                                <option value="warning">Avertissement</option>
                                <option value="success">Succès</option>
                                <option value="absence">Absence</option>
                                <option value="note">Note</option>
                                <option value="system">Système</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-12 col-md-4 d-flex justify-content-md-end">
                        <button className="btn btn-secondary flex-grow-1 flex-md-grow-0" onClick={resetFilters} style={{ height: '42px', marginRight: '12px' }}>
                            <RefreshCw size={16} /> Réinitialiser
                        </button>
                        <button className="btn btn-primary px-4 flex-grow-1 flex-md-grow-0" onClick={fetchNotifications} style={{ height: '42px' }}>
                            Filtrer
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="table-card overflow-hidden">
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '250px' }}>Utilisateur</th>
                                <th>Notification</th>
                                <th style={{ width: '130px' }}>Type</th>
                                <th style={{ width: '110px' }}>Status</th>
                                <th style={{ width: '130px' }}>Date</th>
                                <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                        <p className="mt-2 text-muted">Chargement...</p>
                                    </td>
                                </tr>
                            ) : notifications.length > 0 ? (
                                notifications.map(notif => {
                                    const config = NOTIF_TYPE_CONFIG[notif.type] || NOTIF_TYPE_CONFIG.info;
                                    const Icon = config.icon;
                                    return (
                                        <tr key={notif.id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                                                        <User size={18} className="text-muted" />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-capitalize">{notif.user?.prenom} {notif.user?.nom}</div>
                                                        <div className="text-muted small text-uppercase" style={{fontSize: '10px'}}>{notif.user?.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{maxWidth: '300px'}}>
                                                    <div className="fw-bold text-truncate">{notif.title || 'Sans titre'}</div>
                                                    <div className="text-muted small text-truncate">{notif.message}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span 
                                                    className="badge border d-inline-flex align-items-center gap-1"
                                                    style={{ background: config.bg, color: config.color, borderColor: 'transparent' }}
                                                >
                                                    <Icon size={12} /> {notif.type}
                                                </span>
                                            </td>
                                            <td>
                                                {notif.is_read ? (
                                                    <span className="badge bg-success-light text-success">Lue</span>
                                                ) : (
                                                    <span className="badge bg-warning-light text-warning">Non lue</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="text-muted small d-flex align-items-center gap-1">
                                                    <Clock size={12} /> {new Date(notif.created_at).toLocaleDateString('fr-FR')}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <button 
                                                    className="btn btn-ghost text-danger p-1"
                                                    onClick={() => handleDeleteClick(notif.id)}
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-0">
                                        <div className="no-data-card border-0 m-0">
                                            <div className="no-data-icon">
                                                <Bell size={40} />
                                            </div>
                                            <h4>Aucune notification</h4>
                                            <p>Nous n'avons trouvé aucune notification correspondant à vos critères.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center py-4 border-top">
                        <div className="pagination-container p-2 bg-white rounded-pill shadow-sm border">
                            <button 
                                className="btn btn-ghost btn-sm rounded-pill px-3" 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                <ChevronLeft size={16} /> Précédent
                            </button>
                            <div className="d-inline-flex gap-1 mx-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button 
                                        key={i} 
                                        className={`btn btn-sm rounded-circle p-0 ${currentPage === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
                                        style={{ width: '32px', height: '32px' }}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button 
                                className="btn btn-ghost btn-sm rounded-pill px-3" 
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Suivant <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal - Add / Broadcast */}
            {showModal && (
                <div className="premium-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="premium-modal-content animate__animated animate__fadeInUp" onClick={e => e.stopPropagation()}>
                        <div className="premium-modal-header">
                            <div className="d-flex align-items-center gap-3">
                                <div className="modal-icon-wrapper bg-primary-light text-primary">
                                    {isBroadcasting ? <Users size={24} /> : <Send size={24} />}
                                </div>
                                <div>
                                    <h5 className="mb-0 fw-bold">{isBroadcasting ? 'Diffuser une Annonce' : 'Notification Directe'}</h5>
                                    <p className="text-muted small mb-0">{isBroadcasting ? 'Envoyer à tous les utilisateurs ciblés' : 'Message personnalisé à un utilisateur'}</p>
                                </div>
                            </div>
                            <button className="btn-close-modal" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="premium-modal-body">
                            <form onSubmit={handleSubmit}>
                                {!isBroadcasting ? (
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-5">
                                            <div className="form-group mb-0">
                                                <label className="fw-bold mb-2 small text-uppercase">Rôle</label>
                                                <select 
                                                    className="form-select"
                                                    value={recipientRole}
                                                    onChange={e => {
                                                        setRecipientRole(e.target.value);
                                                        setUserSearchTerm('');
                                                        setFormData({...formData, user_id: ''});
                                                    }}
                                                >
                                                    <option value="etudiant">Étudiant</option>
                                                    <option value="formateur">Formateur</option>
                                                    <option value="admin">Administrateur</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-7">
                                            <div className="form-group mb-0 position-relative">
                                                <label className="fw-bold mb-2 small text-uppercase">Destinataire</label>
                                                <div className="search-container w-100">
                                                    <Search size={16} className="search-icon" />
                                                    <input 
                                                        type="text" 
                                                        placeholder={`Chercher ${recipientRole}...`}
                                                        value={userSearchTerm}
                                                        onChange={e => {
                                                            setUserSearchTerm(e.target.value);
                                                            if (formData.user_id) setFormData({...formData, user_id: ''});
                                                        }}
                                                        onFocus={() => setShowUserResults(true)}
                                                    />
                                                </div>

                                                {showUserResults && userSearchTerm && !formData.user_id && (
                                                    <div className="user-results-dropdown shadow-lg border">
                                                        {users.length > 0 ? (
                                                            users.map(u => (
                                                                <div 
                                                                    key={u.id} 
                                                                    className="user-result-item d-flex align-items-center gap-2"
                                                                    onClick={() => {
                                                                        setFormData({...formData, user_id: u.id});
                                                                        setUserSearchTerm(`${u.prenom || ''} ${u.nom || ''}`.trim() || u.name);
                                                                        setShowUserResults(false);
                                                                    }}
                                                                >
                                                                    <div className="avatar-xs bg-light rounded-circle d-flex align-items-center justify-content-center">
                                                                        <User size={12} className="text-muted" />
                                                                    </div>
                                                                    <div className="flex-grow-1 overflow-hidden">
                                                                        <div className="fw-bold small text-truncate">{u.prenom} {u.nom}</div>
                                                                        <div className="text-muted" style={{fontSize: '10px'}}>{u.email}</div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-3 text-center text-muted small">Aucun résultat</div>
                                                        )}
                                                    </div>
                                                )}

                                                {formData.user_id && (
                                                    <div className="selected-user-badge mt-2 animate__animated animate__fadeIn">
                                                        <CheckCircle2 size={14} />
                                                        <span>{userSearchTerm} sélectionné</span>
                                                        <X size={14} className="ms-auto cursor-pointer" onClick={() => {
                                                            setFormData({...formData, user_id: ''});
                                                            setUserSearchTerm('');
                                                        }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <label className="fw-bold mb-3 small text-uppercase d-block">Destinataires cibles</label>
                                        <div className="role-selector-grid">
                                            {[
                                                {id: 'etudiant', label: 'Étudiants', icon: <User size={16}/>},
                                                {id: 'formateur', label: 'Formateurs', icon: <Users size={16}/>},
                                                {id: 'admin', label: 'Admins', icon: <Settings size={16}/>}
                                            ].map(r => (
                                                <div 
                                                    key={r.id} 
                                                    className={`role-chip ${formData.roles.includes(r.id) ? 'active' : ''}`}
                                                    onClick={() => {
                                                        const newRoles = formData.roles.includes(r.id)
                                                            ? formData.roles.filter(role => role !== r.id)
                                                            : [...formData.roles, r.id];
                                                        setFormData({...formData, roles: newRoles});
                                                    }}
                                                >
                                                    {r.icon}
                                                    <span>{r.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <small className="text-muted mt-2 d-block">Laissez vide pour envoyer à tous les utilisateurs enregistrés.</small>
                                    </div>
                                )}

                                <div className="row g-3 mb-4">
                                    <div className="col-md-8">
                                        <div className="form-group mb-0">
                                            <label className="fw-bold mb-2 small text-uppercase">Titre du message</label>
                                            <input 
                                                type="text" 
                                                placeholder="Sujet de la notification..."
                                                value={formData.title}
                                                onChange={e => setFormData({...formData, title: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-0">
                                            <label className="fw-bold mb-2 small text-uppercase">Type</label>
                                            <select 
                                                value={formData.type}
                                                onChange={e => setFormData({...formData, type: e.target.value})}
                                            >
                                                <option value="info">Information</option>
                                                <option value="warning">Avertissement</option>
                                                <option value="success">Succès</option>
                                                <option value="absence">Absence</option>
                                                <option value="note">Note</option>
                                                <option value="system">Système</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mb-4">
                                    <label className="fw-bold mb-2 small text-uppercase">Contenu du message</label>
                                    <textarea 
                                        rows="4" 
                                        required 
                                        placeholder="Écrivez votre message ici..."
                                        value={formData.message}
                                        onChange={e => setFormData({...formData, message: e.target.value})}
                                    ></textarea>
                                </div>

                                <div className="premium-modal-footer">
                                    <button type="button" className="btn btn-secondary px-4" onClick={() => setShowModal(false)}>Annuler</button>
                                    <button type="submit" className="btn btn-primary px-4 shadow-sm" disabled={formLoading}>
                                        {formLoading ? (
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                        ) : <Send size={16} className="me-2" />}
                                        {formLoading ? 'Envoi...' : (isBroadcasting ? 'Diffuser' : 'Envoyer')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                show={confirmDeleteId != null}
                title="Supprimer la notification"
                message="Êtes-vous sûr de vouloir supprimer cette notification ? Cette action est irréversible."
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDeleteId(null)}
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                variant="danger"
            />
        </div>
    );
};

export default NotificationsList;
