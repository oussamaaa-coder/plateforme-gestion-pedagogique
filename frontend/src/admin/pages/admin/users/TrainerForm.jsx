import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createTrainer, getTrainer, updateTrainer } from '../../../api/trainers';
import { extractApiError } from '../../../api/http';

const TrainerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        specialite: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isEditMode) return;
        let mounted = true;

        (async () => {
            try {
                const resp = await getTrainer(id);
                if (!mounted) return;
                const t = resp?.data;
                setFormData((prev) => ({
                    ...prev,
                    nom: t?.nom || '',
                    prenom: t?.prenom || '',
                    email: t?.email || '',
                    password: '',
                    specialite: t?.specialite || '',
                }));
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
            const payload = { ...formData };
            
            // In edit mode, if password is empty, don't send it
            if (isEditMode && !payload.password) {
                delete payload.password;
            }

            if (isEditMode) {
                await updateTrainer(id, payload);
                toast.success('Formateur mis à jour avec succès.');
            } else {
                await createTrainer(payload);
                toast.success('Formateur créé avec succès.');
            }

            navigate('/admin/trainers');
        } catch (e2) {
            toast.error(extractApiError(e2));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="premium-title">{isEditMode ? 'Modifier Formateur' : 'Ajouter Formateur'}</h1>
                </div>
            </div>
            
            <div className="row">
                <div className="col-md-12">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group-item">
                                <h2 className="premium-section-title">Informations Personnelles</h2>
                                
                                <div className="row">
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>Prénom</label>
                                            <input type="text" className="form-control" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" required />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>Nom</label>
                                            <input type="text" className="form-control" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" required />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>Spécialité</label>
                                            <input type="text" className="form-control" name="specialite" value={formData.specialite} onChange={handleChange} placeholder="Spécialité" />
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>Mot de passe {isEditMode && '(Laissez vide pour conserver l\'actuel)'}</label>
                                            <input type="password" title="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="Mot de passe" required={!isEditMode} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-end mt-4">
                                <Link to="/admin/trainers" className="btn-premium-outline me-3">Annuler</Link>
                                <button type="submit" className="btn-premium-primary" disabled={saving}>
                                    {saving ? 'Sauvegarde...' : 'Sauvegarder le profil'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerForm;
