import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createAbsence, getAbsence, updateAbsence } from '../../../api/absences';
import { listStudents } from '../../../api/students';
import { listTrainers } from '../../../api/trainers';
import { listModules } from '../../../api/modules';
import { listGroupes } from '../../../api/groupes';
import { extractApiError } from '../../../api/http';
import SearchableSelect from '../../../components/SearchableSelect';

const AbsenceForm = ({ role }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        user_id: '',
        module_id: '',
        date: '',
        nombre_heures: '',
        justifie: false,
        emploi_temps_id: ''
    });
    const [people, setPeople] = useState([]);
    const [modules, setModules] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [loadingPeople, setLoadingPeople] = useState(false);
    const [saving, setSaving] = useState(false);

    const personLabel = role === 'formateur' ? 'Formateur' : 'Étudiant';
    const backPath = role === 'formateur' ? '/admin/absences/trainers' : '/admin/absences/students';

    // Charger les listes initiales (Modules et Groupes)
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [mResp, gResp] = await Promise.all([
                    listModules({ per_page: 500 }),
                    role === 'etudiant' ? listGroupes({ per_page: 500 }) : Promise.resolve({ data: { data: [] } })
                ]);
                if (!mounted) return;
                
                const mRaw = mResp?.data?.data || mResp?.data || [];
                const gRaw = gResp?.data?.data || gResp?.data || [];
                
                setModules(Array.isArray(mRaw) ? mRaw : []);
                setGroups(Array.isArray(gRaw) ? gRaw : []);
            } catch (e) {
                toast.error(extractApiError(e));
            }
        })();
        return () => { mounted = false; };
    }, [role]);

    // Charger les personnes (avec filtre possible par groupe pour les étudiants)
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoadingPeople(true);
                const params = { per_page: 500 };
                if (role === 'etudiant' && selectedGroupId) {
                    params.groupe_id = selectedGroupId;
                }

                const resp = role === 'formateur' 
                    ? await listTrainers(params) 
                    : await listStudents(params);
                
                if (!mounted) return;
                const raw = resp?.data?.data || resp?.data || [];
                setPeople(Array.isArray(raw) ? raw : []);
            } catch (e) {
                console.error("Erreur chargement personnes:", e);
            } finally {
                if (mounted) setLoadingPeople(false);
            }
        })();
        return () => { mounted = false; };
    }, [role, selectedGroupId]);

    useEffect(() => {
        if (!isEditMode) return;
        let mounted = true;

        (async () => {
            try {
                const resp = await getAbsence(id);
                if (!mounted) return;
                const a = resp?.data;
                setFormData({
                    user_id: a?.user_id != null ? String(a.user_id) : '',
                    module_id: a?.module_id != null ? String(a.module_id) : '',
                    date: a?.date ? (typeof a.date === 'string' ? a.date.split('T')[0] : a.date) : '',
                    nombre_heures: a?.nombre_heures ?? '',
                    justifie: !!a?.justifie,
                    emploi_temps_id: a?.emploi_temps_id != null ? String(a.emploi_temps_id) : ''
                });
            } catch (e) {
                toast.error(extractApiError(e));
            }
        })();

        return () => { mounted = false; };
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value 
        }));
    };

    // Options formatées pour le SearchableSelect
    const peopleOptions = useMemo(() =>
        people.map((p) => ({
            value: String(p.id),
            label: `${p.prenom} ${p.nom}`,
            subtitle: p.email || ''
        })),
    [people]);

    const moduleOptions = useMemo(() =>
        modules.map((m) => ({
            value: String(m.id),
            label: m.nom
        })),
    [modules]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const payload = {
                user_id: Number(formData.user_id),
                module_id: Number(formData.module_id),
                date: formData.date,
                nombre_heures: Number(formData.nombre_heures),
                justifie: !!formData.justifie,
                emploi_temps_id: formData.emploi_temps_id ? Number(formData.emploi_temps_id) : null
            };
            
            if (isEditMode) {
                await updateAbsence(id, payload);
                toast.success('Absence mise à jour avec succès.');
            } else {
                await createAbsence(payload);
                toast.success('Absence enregistrée avec succès.');
            }
            navigate(backPath);
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
                    <h5>{isEditMode ? `Modifier Absence ${personLabel}` : `Enregistrer une Absence ${personLabel}`}</h5>
                </div>
            </div>
            
            <div className="row">
                <div className="col-md-12">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group-item">
                                <div className="row">
                                    {role === 'etudiant' && (
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label className="text-primary fw-bold">Filtrer par Groupe (Optionnel)</label>
                                                <select 
                                                    className="form-control" 
                                                    value={selectedGroupId} 
                                                    onChange={(e) => {
                                                        setSelectedGroupId(e.target.value);
                                                        setFormData(prev => ({ ...prev, user_id: '' })); // Reset student when group changes
                                                    }}
                                                >
                                                    <option value="">Tous les groupes</option>
                                                    {groups.map(g => (
                                                        <option key={g.id} value={g.id}>{g.nom} ({g.filiere?.code || 'N/A'})</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>{personLabel} <span className="text-danger">*</span></label>
                                            <SearchableSelect
                                                options={peopleOptions}
                                                value={formData.user_id}
                                                onChange={(val) => setFormData(prev => ({ ...prev, user_id: val }))}
                                                placeholder={loadingPeople ? 'Chargement...' : `Rechercher un ${personLabel.toLowerCase()}...`}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>Module</label>
                                            <SearchableSelect
                                                options={moduleOptions}
                                                value={formData.module_id}
                                                onChange={(val) => setFormData(prev => ({ ...prev, module_id: val }))}
                                                placeholder="Rechercher un module..."
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>Date de l'Absence</label>
                                            <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="form-group">
                                            <label>Nombre d'heures</label>
                                            <input type="number" step="0.5" className="form-control" name="nombre_heures" value={formData.nombre_heures} onChange={handleChange} placeholder="ex: 2" required />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 mt-2">
                                        <div className="form-group mb-0">
                                            <label className="flex justify-between items-center cursor-pointer py-2">
                                                <span className="text-sm font-semibold text-slate-700">Absence Justifiée</span>
                                                <div className="relative">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only" 
                                                        checked={formData.justifie} 
                                                        onChange={(e) => setFormData(prev => ({ ...prev, justifie: e.target.checked }))} 
                                                    />
                                                    <div className={`block w-10 h-5 rounded-full transition-colors duration-300 ${formData.justifie ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                                                    <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${formData.justifie ? 'translate-x-5' : ''}`}></div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-end">
                                <Link to={backPath} className="btn btn-primary cancel me-2">Annuler</Link>
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

export default AbsenceForm;
