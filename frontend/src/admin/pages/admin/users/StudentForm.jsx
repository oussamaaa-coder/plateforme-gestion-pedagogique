import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createStudent, getStudent, updateStudent } from '../../../api/students';
import { listFilieres } from '../../../api/filieres';
import { listGroupes } from '../../../api/groupes';
import { extractApiError } from '../../../api/http';

const StudentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        date_naissance: '',
        cin: '',
        filiere_id: '',
        groupe_id: '',
        numero_liste: '',
        annee_scolaire: ''
    });
    const [filieres, setFilieres] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [fResp, gResp] = await Promise.all([
                    listFilieres({ per_page: 200 }),
                    listGroupes({ 
                        per_page: 200, 
                        exclude_saturated: 1, 
                        current_student_id: id ? Number(id) : undefined 
                    }),
                ]);
                if (!mounted) return;
                setFilieres(fResp?.data?.data || []);
                setGroupes(gResp?.data?.data || []);
            } catch (e) {
                toast.error(extractApiError(e));
            }
        })();

        return () => { mounted = false; };
    }, [id, isEditMode]);

    useEffect(() => {
        if (!isEditMode) return;
        let mounted = true;

        (async () => {
            try {
                const resp = await getStudent(id);
                if (!mounted) return;
                const s = resp?.data;
                setFormData((prev) => ({
                    ...prev,
                    nom: s?.nom || '',
                    prenom: s?.prenom || '',
                    email: s?.email || '',
                    password: '',
                    date_naissance: s?.date_naissance ? s.date_naissance.substring(0, 10) : '',
                    cin: s?.cin || '',
                    filiere_id: s?.filiere_id ? String(s.filiere_id) : '',
                    groupe_id: s?.groupe_id ? String(s.groupe_id) : '',
                    numero_liste: s?.numero_liste != null ? String(s.numero_liste) : '',
                    annee_scolaire: s?.annee_scolaire || '',
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
            const payload = {
                ...formData,
                filiere_id: Number(formData.filiere_id),
                groupe_id: Number(formData.groupe_id),
                numero_liste: formData.numero_liste ? Number(formData.numero_liste) : null,
            };

            if (isEditMode) {
                await updateStudent(id, payload);
                toast.success('Étudiant mis à jour avec succès.');
            } else {
                await createStudent(payload);
                toast.success('Étudiant créé avec succès.');
            }

            navigate('/admin/students');
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
                    <h1 className="premium-title">{isEditMode ? 'Modifier Étudiant' : 'Ajouter Étudiant'}</h1>
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
                                            <label>CIN</label>
                                            <input type="text" className="form-control" name="cin" value={formData.cin} onChange={handleChange} placeholder="CIN" required />
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
                                            <label>Date de Naissance</label>
                                            <input type="date" className="form-control" name="date_naissance" value={formData.date_naissance} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="pass-group" id="passwordInput1">
                                            <div className="form-group">
                                                <label>Mot de passe {isEditMode ? "(Optionnel)" : ""}</label>
                                                <input 
                                                    type="password" 
                                                    className="form-control pass-input" 
                                                    name="password" 
                                                    value={formData.password} 
                                                    onChange={handleChange} 
                                                    placeholder={isEditMode ? "Laisser vide pour conserver" : "Mot de passe"} 
                                                    required={!isEditMode} 
                                                />
                                                <span className="toggle-password feather-eye"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group-item">
                                <h2 className="premium-section-title">Détails Pédagogiques</h2>
                                <div className="row">
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>Filière</label>
                                            <select className="form-control" name="filiere_id" value={formData.filiere_id} onChange={handleChange} required>
                                                <option value="">Sélectionner une Filière</option>
                                                {filieres.map((f) => (
                                                    <option key={f.id} value={String(f.id)}>{f.nom}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>Groupe</label>
                                            <select className="form-control" name="groupe_id" value={formData.groupe_id} onChange={handleChange} required>
                                                <option value="">Sélectionner un Groupe</option>
                                                {groupes
                                                    .filter((g) => !formData.filiere_id || String(g.filiere_id) === String(formData.filiere_id))
                                                    .map((g) => (
                                                        <option key={g.id} value={String(g.id)}>{g.nom}</option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>N° Liste (Généré automatiquement)</label>
                                            <input type="text" className="form-control" name="numero_liste" value={formData.numero_liste || ''} placeholder="Calculé après enregistrement" readOnly disabled />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>Année Scolaire</label>
                                            <input type="text" className="form-control" name="annee_scolaire" value={formData.annee_scolaire} onChange={handleChange} placeholder="ex: 2023-2024" required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-end mt-4">
                                <Link to="/admin/students" className="btn-premium-outline me-3">Annuler</Link>
                                <button type="submit" className="btn-premium-primary" disabled={saving}>
                                    {saving ? 'Sauvegarde...' : 'Enregistrer l\'étudiant'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentForm;
