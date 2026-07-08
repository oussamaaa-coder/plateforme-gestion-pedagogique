import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createAdministrator, getAdministrator, updateAdministrator } from '../../../api/administrators';
import { extractApiError } from '../../../api/http';

const AdministratorForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isEditMode) return;
        let mounted = true;

        (async () => {
            try {
                const resp = await getAdministrator(id);
                if (!mounted) return;
                const a = resp?.data;
                setFormData((prev) => ({
                    ...prev,
                    nom: a?.nom || '',
                    prenom: a?.prenom || '',
                    email: a?.email || '',
                    password: '',
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
                await updateAdministrator(id, payload);
                toast.success('Administrateur mis à jour avec succès.');
            } else {
                await createAdministrator(payload);
                toast.success('Administrateur créé avec succès.');
            }

            navigate('/admin/administrators');
        } catch (e2) {
            toast.error(extractApiError(e2));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div className="content-page-header">
                    <h5>{isEditMode ? 'Modifier Administrateur' : 'Ajouter Administrateur'}</h5>
                </div>
            </div>
            
            <div className="row">
                <div className="col-md-12">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group-item">
                                <h5 className="form-title">Informations Personnelles</h5>
                                
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
                                            <label>Mot de passe {isEditMode && '(Laissez vide pour conserver l\'actuel)'}</label>
                                            <input type="password" title="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="Mot de passe" required={!isEditMode} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-end">
                                <Link to="/admin/administrators" className="btn btn-primary cancel me-2">Annuler</Link>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdministratorForm;
