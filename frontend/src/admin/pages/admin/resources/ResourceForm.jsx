import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createResource, getResource, updateResource } from '../../../api/resources';
import { listModules } from '../../../api/modules';
import { listGroupes } from '../../../api/groupes';
import { listFilieres } from '../../../api/filieres';
import { extractApiError } from '../../../api/http';
import SearchableSelect from '../../../components/SearchableSelect';
import { PlusCircle, FileText, Layout, Users, User, Pencil, Upload } from 'lucide-react';

const ResourceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        titre: '',
        type: 'Cours',
        fichier: null,
        module_id: '',
        groupe_id: '',
        formateur_id: ''
    });
    const [modules, setModules] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [filterFiliere, setFilterFiliere] = useState('');
    const [saving, setSaving] = useState(false);
    const [currentFilePath, setCurrentFilePath] = useState('');

    // Options formatées
    const moduleOptions = useMemo(() =>
        modules
            .filter(m => !filterFiliere || String(m.filiere_id) === filterFiliere)
            .map(m => ({
                value: String(m.id),
                label: `${m.nom} (Année ${m.annee || '?'})`,
            })),
    [modules, filterFiliere]);

    const groupeOptions = useMemo(() =>
        groupes.map(g => ({
            value: String(g.id),
            label: g.nom,
        })),
    [groupes]);

    // Options formatées pour le formateur (depuis le module sélectionné)
    const formateurOptions = useMemo(() => {
        if (!formData.module_id) return [];
        
        const selectedModule = modules.find(m => String(m.id) === formData.module_id);
        if (!selectedModule || !selectedModule.formateur) return [];
        
        return [{
            value: String(selectedModule.formateur.id),
            label: `${selectedModule.formateur.prenom} ${selectedModule.formateur.nom}`,
        }];
    }, [formData.module_id, modules]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [mResp, gResp, fResp] = await Promise.all([
                    listModules({ per_page: 500 }),
                    listGroupes({ per_page: 500 }),
                    listFilieres({ per_page: 200 })
                ]);
                if (!mounted) return;
                setModules(mResp?.data?.data || []);
                setGroupes(gResp?.data?.data || []);
                setFilieres(fResp?.data?.data || []);
            } catch (e) {
                toast.error(extractApiError(e));
            }
        })();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (!isEditMode) return;
        let mounted = true;

        (async () => {
            try {
                const resp = await getResource(id);
                if (!mounted) return;
                const r = resp?.data;
                setFormData({
                    titre: r?.titre || '',
                    type: r?.type || 'Cours',
                    fichier: null,
                    module_id: r?.module_id ? String(r.module_id) : '',
                    groupe_id: r?.groupe_id ? String(r.groupe_id) : '',
                    formateur_id: r?.formateur_id ? String(r.formateur_id) : ''
                });
                setCurrentFilePath(r?.file_url || '');
            } catch (e) {
                toast.error(extractApiError(e));
            }
        })();

        return () => { mounted = false; };
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, fichier: e.target.files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.titre || !formData.type || !formData.module_id || !formData.groupe_id) {
            toast.error('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        if (!isEditMode && !formData.fichier) {
            toast.error('Veuillez sélectionner un fichier à télécharger.');
            return;
        }

        try {
            setSaving(true);
            const payload = new FormData();
            payload.append('titre', formData.titre);
            payload.append('type', formData.type);
            payload.append('module_id', Number(formData.module_id));
            payload.append('groupe_id', Number(formData.groupe_id));
            if (formData.formateur_id) {
                payload.append('formateur_id', Number(formData.formateur_id));
            }
            
            if (formData.fichier) {
                payload.append('fichier', formData.fichier);
            }

            if (isEditMode) {
                await updateResource(id, payload);
                toast.success('Ressource mise à jour avec succès.');
            } else {
                await createResource(payload);
                toast.success('Ressource créée avec succès.');
            }
            navigate('/admin/resources');
        } catch (e) {
            toast.error(extractApiError(e));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-scope">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>{isEditMode ? 'Modifier la Ressource' : 'Nouvelle Ressource Pédagogique'}</h1>
                    <div className="breadcrumb">
                        <span>Administration</span>
                        <span className="breadcrumb-separator">/</span>
                        <span>Contenu</span>
                        <span className="breadcrumb-separator">/</span>
                        <Link to="/admin/resources" className="text-muted">Ressources</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="text-primary">{isEditMode ? 'Édition' : 'Création'}</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <Link to="/admin/resources" className="btn btn-secondary">
                        Annuler
                    </Link>
                </div>
            </div>
            
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <div className="form-section-title">
                                <FileText size={18} className="text-primary" />
                                Informations de base
                            </div>
                            
                            <div className="row g-4">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label className="fw-bold">Titre de la Ressource <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            name="titre" 
                                            value={formData.titre} 
                                            onChange={handleChange} 
                                            placeholder="ex: Introduction au Développement Web" 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="fw-bold">Type de Ressource <span className="text-danger">*</span></label>
                                        <select 
                                            name="type" 
                                            value={formData.type} 
                                            onChange={handleChange} 
                                            required
                                        >
                                            <option value="Cours">Cours</option>
                                            <option value="TD">TD</option>
                                            <option value="TP">TP</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label className="fw-bold">Fichier de la Ressource <span className="text-danger">{!isEditMode ? '*' : ''}</span></label>
                                        <div className={`file-upload-zone ${formData.fichier ? 'has-file' : ''}`}>
                                            <input 
                                                type="file" 
                                                id="resource-file"
                                                className="file-input-hidden"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                                                required={!isEditMode}
                                            />
                                            <label htmlFor="resource-file" className="file-upload-label">
                                                <div className="upload-icon-wrapper">
                                                    <Upload size={24} />
                                                </div>
                                                <div className="upload-text-content">
                                                    <span className="main-text">
                                                        {formData.fichier ? formData.fichier.name : (isEditMode ? 'Modifier le fichier' : 'Cliquer pour télécharger le fichier')}
                                                    </span>
                                                    <span className="sub-text">PDF, DOC, PPT ou ZIP (Max 10MB)</span>
                                                </div>
                                            </label>
                                        </div>
                                        
                                        {currentFilePath && !formData.fichier && (
                                            <div className="current-file-badge mt-3">
                                                <FileText size={14} />
                                                <span>Fichier actuel : {currentFilePath.split('/').pop()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="form-section-title">
                                <Layout size={18} className="text-primary" />
                                Classification & Affectation
                            </div>
                            
                            <div className="row g-4">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label className="fw-bold">Filière <span className="text-muted small fw-normal">(Filtre)</span></label>
                                        <select 
                                            value={filterFiliere}
                                            onChange={(e) => { setFilterFiliere(e.target.value); setFormData(prev => ({ ...prev, module_id: '' })); }}
                                        >
                                            <option value="">Sélectionner une filière</option>
                                            {filieres.map(f => <option key={f.id} value={String(f.id)}>{f.nom}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="fw-bold">Module <span className="text-danger">*</span></label>
                                        <SearchableSelect
                                            options={moduleOptions}
                                            value={formData.module_id}
                                            onChange={(val) => setFormData(prev => ({ ...prev, module_id: val }))}
                                            placeholder="Rechercher un module..."
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="fw-bold">Groupe Cible <span className="text-danger">*</span></label>
                                        <SearchableSelect
                                            options={groupeOptions}
                                            value={formData.groupe_id}
                                            onChange={(val) => setFormData(prev => ({ ...prev, groupe_id: val }))}
                                            placeholder="Rechercher un groupe..."
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="form-section-title">
                                <User size={18} className="text-primary" />
                                Responsable Pédagogique
                            </div>
                            
                            <div className="form-group mb-0">
                                <label className="fw-bold">Formateur</label>
                                {formData.module_id ? (
                                    <>
                                        <SearchableSelect
                                            options={formateurOptions}
                                            value={formData.formateur_id}
                                            onChange={(val) => setFormData(prev => ({ ...prev, formateur_id: val }))}
                                            placeholder="Le formateur assigné au module"
                                            required
                                        />
                                        {formateurOptions.length === 0 && (
                                            <div className="alert alert-warning mt-3 mb-0 p-2 d-flex align-items-center">
                                                <small>⚠️ Aucun formateur n'est actuellement assigné à ce module.</small>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="bg-light p-3 rounded-3 text-center border">
                                        <p className="text-muted small mb-0">Sélectionnez d'abord un module pour identifier le formateur responsable.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-footer mt-4">
                            <Link to="/admin/resources" className="btn btn-secondary">Annuler</Link>
                            <button type="submit" className="btn btn-primary px-5" disabled={saving}>
                                {saving ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                        Enregistrement...
                                    </>
                                ) : (
                                    isEditMode ? 'Mettre à jour la ressource' : 'Publier la ressource'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResourceForm;
