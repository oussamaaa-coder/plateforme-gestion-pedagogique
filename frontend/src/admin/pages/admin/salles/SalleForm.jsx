import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createSalle, getSalle, updateSalle } from '../../../api/salles';
import { extractApiError } from '../../../api/http';

const SalleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        nom: '',
        type: '',
        capacite: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isEditMode) return;
        let mounted = true;

        (async () => {
            try {
                const resp = await getSalle(id);
                if (!mounted) return;
                const data = resp?.data;
                setFormData({
                    nom: data?.nom || '',
                    type: data?.type || '',
                    capacite: data?.capacite || ''
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
            const payload = {
                ...formData,
                capacite: formData.capacite ? Number(formData.capacite) : null
            };

            if (isEditMode) {
                await updateSalle(id, payload);
                toast.success('Salle mise à jour avec succès.');
            } else {
                await createSalle(payload);
                toast.success('Salle créée avec succès.');
            }
            navigate('/admin/salles');
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
                    <h1 className="premium-title">{isEditMode ? 'Modifier Salle' : 'Ajouter Salle'}</h1>
                </div>
            </div>
            
            <div className="row">
                <div className="col-md-12">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group-item">
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Nom de la Salle</label>
                                            <input type="text" className="form-control" name="nom" value={formData.nom} onChange={handleChange} placeholder="Ex: Salle 101, Labo A..." required />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>Type de Salle</label>
                                            <select className="form-control" name="type" value={formData.type} onChange={handleChange}>
                                                <option value="">Sélectionner un type</option>
                                                <option value="Cours">Cours</option>
                                                <option value="Spécialisation">Spécialisation</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>Capacité (Nombre de personnes)</label>
                                            <input type="number" className="form-control" name="capacite" value={formData.capacite} onChange={handleChange} placeholder="Ex: 30" min="1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-end mt-4">
                                <Link to="/admin/salles" className="btn-premium-outline me-3">Annuler</Link>
                                <button type="submit" className="btn-premium-primary" disabled={saving}>
                                    {saving ? 'Sauvegarde...' : 'Sauvegarder la Salle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalleForm;
