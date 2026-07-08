import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserSettings, updateUserSettings, getSiteSettings, updateSiteSettings } from '../../api/settings';
import { toast } from 'react-toastify';
import { 
    User, 
    Globe, 
    Moon, 
    Sun,
    Bell, 
    ShieldCheck, 
    Settings as SettingsIcon,
    Save,
    Layout,
    UserCircle,
    Mail,
    KeyRound
} from 'lucide-react';
import { updateAdministrator } from '../../api/administrators';

const Settings = () => {
  const { user, refreshUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingUser, setSavingUser] = useState(false);
  const [savingSite, setSavingSite] = useState(false);

  const [userSettings, setUserSettings] = useState({
    theme: 'light',
    locale: 'fr',
    notify_email: true,
    notify_push: true,
    notify_alerts: true,
  });

  const [siteSettings, setSiteSettings] = useState({
    supported_locales: ['fr', 'en'],
    default_locale: 'fr',
  });

  const [profileForm, setProfileForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user) {
      setProfileForm((prev) => ({
        ...prev,
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [userResp, siteResp] = await Promise.all([
          getUserSettings(),
          isAdmin ? getSiteSettings() : Promise.resolve(null),
        ]);

        if (!mounted) return;

        if (userResp?.data) {
          setUserSettings((prev) => ({
            ...prev,
            ...userResp.data,
          }));
        }

        if (isAdmin && siteResp?.data) {
          setSiteSettings((prev) => ({
            ...prev,
            ...siteResp.data,
          }));
        }
      } catch (e) {
        toast.error('Impossible de charger les paramètres.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  const handleUserChange = (e) => {
    const { name, type, checked, value } = e.target;
    setUserSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSiteChange = (e) => {
    const { name, value } = e.target;
    setSiteSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    setSavingUser(true);
    try {
      await updateUserSettings(userSettings);
      toast.success('Vos préférences ont été mises à jour.');
    } catch {
      toast.error('Erreur lors de la mise à jour de vos préférences.');
    } finally {
      setSavingUser(false);
    }
  };

  const handleSubmitSite = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSavingSite(true);
    try {
      await updateSiteSettings(siteSettings);
      toast.success('Les paramètres du site ont été mis à jour.');
    } catch {
      toast.error('Erreur lors de la mise à jour des paramètres du site.');
    } finally {
      setSavingSite(false);
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateAdministrator(user.id, profileForm);
      toast.success('Profil mis à jour avec succès.');
      await refreshUser();
      // Optionally reset password fields
      setProfileForm(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      }));
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de la mise à jour du profil.';
      toast.error(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
        <div className="admin-scope">
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Chargement des paramètres...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="admin-scope">
      <div className="page-header">
        <div className="page-header-left">
            <h1>Paramètres Généraux</h1>
            <div className="breadcrumb">
                <span>Administration</span>
                <span className="breadcrumb-separator">/</span>
                <span className="text-primary">Paramètres</span>
            </div>
        </div>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-xl-6 col-lg-8">
            <form onSubmit={handleSubmitProfile} className="mb-4">
                <div className="form-section">
                    <div className="form-section-title">
                        <UserCircle size={18} className="text-primary" />
                        Mon Profil
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="fw-bold">Prénom</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    value={profileForm.prenom}
                                    onChange={handleProfileChange}
                                    placeholder="Votre prénom"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="fw-bold">Nom</label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={profileForm.nom}
                                    onChange={handleProfileChange}
                                    placeholder="Votre nom"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <label className="fw-bold">Adresse Email</label>
                                <div className="position-relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileForm.email}
                                        onChange={handleProfileChange}
                                        placeholder="votre@email.com"
                                        required
                                    />
                                    <Mail size={16} className="position-absolute end-0 top-50 translate-middle-x text-muted" style={{ marginRight: '10px' }} />
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <hr className="my-2 opacity-50" />
                            <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-3 mt-3">
                                <KeyRound size={16} className="text-primary" />
                                Sécurité du Compte
                            </h6>
                            <p className="text-muted small mb-4">Laissez les champs de mot de passe vides si vous ne souhaitez pas les modifier.</p>
                        </div>

                        <div className="col-12">
                            <div className="form-group">
                                <label className="fw-bold">Mot de passe actuel</label>
                                <input
                                    type="password"
                                    name="current_password"
                                    value={profileForm.current_password}
                                    onChange={handleProfileChange}
                                    placeholder="Mot de passe actuel"
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="fw-bold">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    value={profileForm.new_password}
                                    onChange={handleProfileChange}
                                    placeholder="Min. 8 caractères"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="fw-bold">Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    name="new_password_confirmation"
                                    value={profileForm.new_password_confirmation}
                                    onChange={handleProfileChange}
                                    placeholder="Confirmer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-footer border-top-0 mt-4 p-0">
                        <button type="submit" className="btn btn-primary px-5" disabled={savingProfile}>
                            {savingProfile ? (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            ) : <Save size={18} className="me-2" />}
                            Mettre à jour mon profil
                        </button>
                    </div>
                </div>
            </form>

            <form onSubmit={handleSubmitUser}>
                <div className="form-section">
                    <div className="form-section-title">
                        <User size={18} className="text-primary" />
                        Mes Préférences
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="fw-bold">Langue de l'interface</label>
                                <select
                                    name="locale"
                                    value={userSettings.locale || 'fr'}
                                    onChange={handleUserChange}
                                >
                                    <option value="fr">Français (FR)</option>
                                    <option value="en">Anglais (EN)</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="fw-bold mb-3 d-block">Thème visuel</label>
                                <div className="d-flex gap-2">
                                    <button
                                        type="button"
                                        className={`btn ${userSettings.theme === 'light' ? 'btn-primary' : 'btn-outline-secondary'} flex-grow-1 d-flex align-items-center justify-content-center gap-2`}
                                        onClick={() => handleUserChange({ target: { name: 'theme', value: 'light', type: 'radio' } })}
                                        style={{ height: '42px' }}
                                    >
                                        <Sun size={18} /> Mode Clair
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${userSettings.theme === 'dark' ? 'btn-primary' : 'btn-outline-secondary'} flex-grow-1 d-flex align-items-center justify-content-center gap-2`}
                                        onClick={() => handleUserChange({ target: { name: 'theme', value: 'dark', type: 'radio' } })}
                                        style={{ height: '42px' }}
                                    >
                                        <Moon size={18} /> Mode Sombre
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="notification-preferences-container mt-2">
                                <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-4">
                                    <Bell size={18} className="text-primary" />
                                    Préférences de Notifications
                                </h6>
                                
                                <div className="notification-settings-list">
                                    <div className="notification-setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Alertes par e-mail</div>
                                            <div className="setting-description text-muted small">Recevez un e-mail pour les mises à jour importantes et les annonces.</div>
                                        </div>
                                        <div className="custom-switch">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="notify_email"
                                                name="notify_email"
                                                checked={!!userSettings.notify_email}
                                                onChange={handleUserChange}
                                            />
                                            <label htmlFor="notify_email"></label>
                                        </div>
                                    </div>

                                    <div className="notification-setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Notifications Push</div>
                                            <div className="setting-description text-muted small">Alertes instantanées dans votre navigateur même si vous ne naviguez pas sur le site.</div>
                                        </div>
                                        <div className="custom-switch">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="notify_push"
                                                name="notify_push"
                                                checked={!!userSettings.notify_push}
                                                onChange={handleUserChange}
                                            />
                                            <label htmlFor="notify_push"></label>
                                        </div>
                                    </div>

                                    <div className="notification-setting-item">
                                        <div className="setting-info">
                                            <div className="setting-label">Alertes système critiques</div>
                                            <div className="setting-description text-muted small">Notifications concernant la maintenance et les alertes de sécurité prioritaires.</div>
                                        </div>
                                        <div className="custom-switch">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="notify_alerts"
                                                name="notify_alerts"
                                                checked={!!userSettings.notify_alerts}
                                                onChange={handleUserChange}
                                            />
                                            <label htmlFor="notify_alerts"></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-footer border-top-0 mt-4 p-0">
                        <button type="submit" className="btn btn-primary px-5" disabled={savingUser}>
                            {savingUser ? (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            ) : <Save size={18} className="me-2" />}
                            Enregistrer mes préférences
                        </button>
                    </div>
                </div>
            </form>

            {isAdmin && (
                <form onSubmit={handleSubmitSite} className="mt-4">
                    <div className="form-section">
                        <div className="form-section-title">
                            <Globe size={18} className="text-primary" />
                            Paramètres du Site
                        </div>
                        
                        <div className="row g-4">
                            <div className="col-12">
                                <div className="form-group">
                                    <label className="fw-bold">Langue par défaut (Globale)</label>
                                    <select
                                        name="default_locale"
                                        value={siteSettings.default_locale || 'fr'}
                                        onChange={handleSiteChange}
                                    >
                                        <option value="fr">Français</option>
                                        <option value="en">Anglais</option>
                                    </select>
                                    <small className="text-muted d-block mt-2">
                                        Cette langue sera appliquée par défaut lors de la création de nouveaux comptes.
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div className="form-footer border-top-0 mt-4 p-0">
                            <button type="submit" className="btn btn-primary px-5" disabled={savingSite}>
                                {savingSite ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : <ShieldCheck size={18} className="me-2" />}
                                Mettre à jour les paramètres globaux
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

