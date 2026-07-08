import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createFiliere, getFiliere, updateFiliere } from '../../../api/filieres';
import { extractApiError } from '../../../api/http';
import { BookOpen } from 'lucide-react';

const FiliereForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        nom: '',
        description: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isEditMode) return;
        let mounted = true;

        (async () => {
            try {
                const resp = await getFiliere(id);
                if (!mounted) return;
                setFormData({
                    nom: resp?.data?.nom || '',
                    description: resp?.data?.description || ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            if (isEditMode) {
                await updateFiliere(id, formData);
                toast.success('Filière mise à jour avec succès.');
            } else {
                await createFiliere(formData);
                toast.success('Filière créée avec succès.');
            }
            navigate('/admin/filieres');
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
                    <h1>{isEditMode ? 'Modifier la Filière' : 'Nouvelle Filière'}</h1>
                    <div className="breadcrumb">
                        <span>Administration</span>
                        <span className="breadcrumb-separator">/</span>
                        <span>Pédagogie</span>
                        <span className="breadcrumb-separator">/</span>
                        <Link to="/admin/filieres" className="text-muted">Filières</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="text-primary">{isEditMode ? 'Édition' : 'Création'}</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <Link to="/admin/filieres" className="btn btn-secondary">
                        Annuler
                    </Link>
                </div>
            </div>
            
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <div className="form-section-title">
                                <BookOpen size={18} className="text-primary" />
                                Informations de la Filière
                            </div>
                            
                            <div className="form-group mb-4">
                                <label className="fw-bold">Nom de la Filière <span className="text-danger">*</span></label>
                                <input 
                                    type="text" 
                                    name="nom" 
                                    value={formData.nom} 
                                    onChange={handleChange} 
                                    placeholder="ex: Développement Digital" 
                                    required 
                                />
                            </div>

                            <div className="form-group mb-0">
                                <label className="fw-bold">Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    placeholder="Détails sur la filière..." 
                                    rows="5"
                                ></textarea>
                            </div>
                        </div>
                        
                        <div className="form-footer">
                            <Link to="/admin/filieres" className="btn btn-secondary">Annuler</Link>
                            <button type="submit" className="btn btn-primary px-5" disabled={saving}>
                                {saving ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                        Enregistrement...
                                    </>
                                ) : (
                                    isEditMode ? 'Mettre à jour' : 'Créer la Filière'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FiliereForm;
