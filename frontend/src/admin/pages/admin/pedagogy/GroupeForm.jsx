import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createGroupe, getGroupe, updateGroupe } from '../../../api/groupes';
import { listFilieres } from '../../../api/filieres';
import { extractApiError } from '../../../api/http';
import SearchableSelect from '../../../components/SearchableSelect';
import { Users } from 'lucide-react';

const GroupeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        nom: '',
        filiere_id: '',
        annee: ''
    });
    const [filieres, setFilieres] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const resp = await listFilieres({ per_page: 200 });
                if (!mounted) return;
                setFilieres(resp?.data?.data || []);
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
                const resp = await getGroupe(id);
                if (!mounted) return;
                setFormData({
                    nom: resp?.data?.nom || '',
                    filiere_id: resp?.data?.filiere_id ? String(resp.data.filiere_id) : '',
                    annee: resp?.data?.annee || ''
                });
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

    // Options formatées pour le SearchableSelect
    const filiereOptions = useMemo(() =>
        filieres.map((f) => ({
            value: String(f.id),
            label: f.nom
        })),
    [filieres]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const payload = {
                ...formData,
                filiere_id: Number(formData.filiere_id)
            };
            if (isEditMode) {
                await updateGroupe(id, payload);
                toast.success('Groupe mis à jour avec succès.');
            } else {
                await createGroupe(payload);
                toast.success('Groupe créé avec succès.');
            }
            navigate('/admin/groupes');
        } catch (e2) {
            toast.error(extractApiError(e2));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-scope">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>{isEditMode ? 'Modifier le Groupe' : 'Nouveau Groupe'}</h1>
                    <div className="breadcrumb">
                        <span>Administration</span>
                        <span className="breadcrumb-separator">/</span>
                        <span>Pédagogie</span>
                        <span className="breadcrumb-separator">/</span>
                        <Link to="/admin/groupes" className="text-muted">Groupes</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="text-primary">{isEditMode ? 'Édition' : 'Création'}</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <Link to="/admin/groupes" className="btn btn-secondary">
                        Annuler
                    </Link>
                </div>
            </div>
            
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <div className="form-section-title">
                                <Users size={18} className="text-primary" />
                                Informations du Groupe
                            </div>
                            
                            <div className="row g-4">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label className="fw-bold">Nom du Groupe <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            name="nom" 
                                            value={formData.nom} 
                                            onChange={handleChange} 
                                            placeholder="ex: DEV101" 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="col-md-7">
                                    <div className="form-group">
                                        <label className="fw-bold">Filière <span className="text-danger">*</span></label>
                                        <SearchableSelect
                                            options={filiereOptions}
                                            value={formData.filiere_id}
                                            onChange={(val) => setFormData(prev => ({ ...prev, filiere_id: val }))}
                                            placeholder="Choisir une filière..."
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-md-5">
                                    <div className="form-group">
                                        <label className="fw-bold">Année <span className="text-danger">*</span></label>
                                        <select 
                                            name="annee" 
                                            value={formData.annee} 
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Sélectionner...</option>
                                            <option value="1">1ère année</option>
                                            <option value="2">2ème année</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-footer">
                            <Link to="/admin/groupes" className="btn btn-secondary">Annuler</Link>
                            <button type="submit" className="btn btn-primary px-5" disabled={saving}>
                                {saving ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                        Enregistrement...
                                    </>
                                ) : (
                                    isEditMode ? 'Mettre à jour le groupe' : 'Créer le groupe'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GroupeForm;
