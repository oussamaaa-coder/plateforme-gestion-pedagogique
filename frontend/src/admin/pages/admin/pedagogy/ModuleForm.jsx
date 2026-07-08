// frontend/src/admin/pages/admin/pedagogy/ModuleForm.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createModule, getModule, updateModule } from '../../../api/modules';
import { listFilieres } from '../../../api/filieres';
import { extractApiError } from '../../../api/http';
import SearchableSelect from '../../../components/SearchableSelect';
import { BookOpen } from 'lucide-react';

const ModuleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        nom: '',
        coefficient: 1,
        annee: '1',
        filiere_id: ''
    });
    const [filieres, setFilieres] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const fResp = await listFilieres({ per_page: 200 });
                if (!mounted) return;
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
                const resp = await getModule(id);
                if (!mounted) return;
                const m = resp?.data ?? resp;
                if (!m || m.id == null) return;
                setFormData({
                    nom: m.nom ?? '',
                    coefficient: m.coefficient ?? 1,
                    annee: m.annee != null ? String(m.annee) : '1',
                    filiere_id: m.filiere_id != null ? String(m.filiere_id) : ''
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
                filiere_id: Number(formData.filiere_id),
                coefficient: Number(formData.coefficient),
                annee: Number(formData.annee)
            };
            if (isEditMode) {
                await updateModule(id, payload);
                toast.success('Module mis à jour avec succès.');
            } else {
                await createModule(payload);
                toast.success('Module créé avec succès.');
            }
            navigate('/admin/modules');
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
                    <h1>{isEditMode ? 'Modifier le Module' : 'Nouveau Module'}</h1>
                    <div className="breadcrumb">
                        <span>Administration</span>
                        <span className="breadcrumb-separator">/</span>
                        <span>Pédagogie</span>
                        <span className="breadcrumb-separator">/</span>
                        <Link to="/admin/modules" className="text-muted">Modules</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="text-primary">{isEditMode ? 'Édition' : 'Création'}</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <Link to="/admin/modules" className="btn btn-secondary">
                        Annuler
                    </Link>
                </div>
            </div>
            
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <div className="form-section-title">
                                <BookOpen size={18} className="text-primary" />
                                Informations Pédagogiques
                            </div>
                            
                            <div className="row g-4">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label className="fw-bold">Nom du Module <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            name="nom" 
                                            value={formData.nom} 
                                            onChange={handleChange} 
                                            placeholder="ex: Algorithmique et Structures de Données" 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="fw-bold">Filière <span className="text-danger">*</span></label>
                                        <SearchableSelect
                                            options={filiereOptions}
                                            value={formData.filiere_id}
                                            onChange={(val) => setFormData(prev => ({ ...prev, filiere_id: val }))}
                                            placeholder="Sélectionner une filière..."
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="fw-bold">Année <span className="text-danger">*</span></label>
                                        <select name="annee" value={formData.annee} onChange={handleChange} required>
                                            <option value="1">1ère année</option>
                                            <option value="2">2ème année</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="fw-bold">Coefficient <span className="text-danger">*</span></label>
                                        <input 
                                            type="number" 
                                            step="0.5" 
                                            name="coefficient" 
                                            value={formData.coefficient} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-footer">
                            <Link to="/admin/modules" className="btn btn-secondary">Annuler</Link>
                            <button type="submit" className="btn btn-primary px-5" disabled={saving}>
                                {saving ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                        Enregistrement...
                                    </>
                                ) : (
                                    isEditMode ? 'Mettre à jour' : 'Créer le Module'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModuleForm;