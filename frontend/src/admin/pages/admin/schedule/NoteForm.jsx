import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createNote, getNote, updateNote } from '../../../api/notes';
import { listStudents } from '../../../api/students';
import { listModules } from '../../../api/modules';
import { listFilieres } from '../../../api/filieres';
import { listTrainers } from '../../../api/trainers';
import { extractApiError } from '../../../api/http';
import SearchableSelect from '../../../components/SearchableSelect';
import { PlusCircle, Pencil } from 'lucide-react';

const NoteForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        user_id: '',
        module_id: '',
        note: '',
        type_controle: 'CC',
        coefficient: '1',
        remarque: '',
        formateur_id: ''
    });
    const [students, setStudents] = useState([]);
    const [modules, setModules] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [filterFiliere, setFilterFiliere] = useState('');
    const [filterAnnee, setFilterAnnee] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [sResp, mResp, fResp, tResp] = await Promise.all([
                    listStudents({ per_page: 500 }),
                    listModules({ per_page: 500 }),
                    listFilieres({ per_page: 200 }),
                    listTrainers({ per_page: 200 })
                ]);
                if (!mounted) return;
                setStudents(sResp?.data?.data || []);
                setModules(mResp?.data?.data || []);
                setFilieres(fResp?.data?.data || []);
                setTrainers(tResp?.data?.data || []);
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
                const resp = await getNote(id);
                if (!mounted) return;
                const n = resp?.data;
                setFormData({
                    user_id: n?.user_id ? String(n.user_id) : '',
                    module_id: n?.module_id ? String(n.module_id) : '',
                    note: n?.note !== undefined ? String(n.note) : '',
                    type_controle: n?.type_controle || 'CC',
                    coefficient: n?.coefficient !== undefined ? String(n.coefficient) : '1',
                    remarque: n?.remarque || '',
                    formateur_id: n?.formateur_id ? String(n.formateur_id) : ''
                });
            } catch (e) {
                toast.error(extractApiError(e));
            }
        })();

        return () => { mounted = false; };
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            if (name === 'type_controle') {
                if (value === 'EFM' || value === 'EFM_Regional') {
                    next.coefficient = '2';
                } else if (prev.coefficient === '2') {
                    next.coefficient = '1';
                }
            }
            return next;
        });
    };

    // Options formatées pour le SearchableSelect
    const studentOptions = useMemo(() =>
        students.map((s) => ({
            value: String(s.id),
            label: `${s.prenom} ${s.nom} (${s.cin})`,
            subtitle: s.email || ''
        })),
    [students]);

    const trainerOptions = useMemo(() =>
        trainers.map((t) => ({
            value: String(t.id),
            label: `${t.prenom} ${t.nom}`,
            subtitle: t.email || ''
        })),
    [trainers]);

    // Options formatées : modules filtrés par filière et année
    const filteredModules = useMemo(() => {
        let result = modules;
        if (filterFiliere) result = result.filter(m => String(m.filiere_id) === filterFiliere);
        if (filterAnnee) result = result.filter(m => String(m.annee) === filterAnnee);
        return result;
    }, [modules, filterFiliere, filterAnnee]);

    const moduleOptions = useMemo(() =>
        filteredModules.map((m) => ({
            value: String(m.id),
            label: `${m.nom} (Année ${m.annee || '?'})`
        })),
    [filteredModules]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const payload = {
                ...formData,
                user_id: Number(formData.user_id),
                module_id: Number(formData.module_id),
                note: parseFloat(formData.note),
                coefficient: parseFloat(formData.coefficient),
                formateur_id: Number(formData.formateur_id)
            };
            if (isEditMode) {
                await updateNote(id, payload);
                toast.success('Note mise à jour avec succès.');
            } else {
                await createNote(payload);
                toast.success('Note enregistrée avec succès.');
            }
            navigate('/admin/notes');
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
                    <h1>{isEditMode ? 'Modifier la Note' : 'Saisir une Nouvelle Note'}</h1>
                    <div className="breadcrumb">
                        <span>Administration</span>
                        <span className="breadcrumb-separator">/</span>
                        <span>Scolarité</span>
                        <span className="breadcrumb-separator">/</span>
                        <Link to="/admin/notes" className="text-muted">Notes</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="text-primary">{isEditMode ? 'Édition' : 'Création'}</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <Link to="/admin/notes" className="btn btn-secondary">
                        Retour à la liste
                    </Link>
                </div>
            </div>
            
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <div className="form-section-title">
                                <PlusCircle size={18} className="text-primary" />
                                {isEditMode ? "Informations de l'Évaluation (Lecture seule)" : "Informations de l'Évaluation"}
                            </div>
                            
                            {isEditMode ? (
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="fw-bold">Étudiant</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={(() => {
                                                    const s = students.find(st => String(st.id) === formData.user_id);
                                                    return s ? `${s.prenom} ${s.nom} (${s.cin})` : 'Chargement...';
                                                })()} 
                                                disabled 
                                                style={{ background: '#f8fafc', cursor: 'not-allowed', fontWeight: '500' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="fw-bold">Module concerné</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={(() => {
                                                    const m = modules.find(mod => String(mod.id) === formData.module_id);
                                                    return m ? m.nom : 'Chargement...';
                                                })()} 
                                                disabled 
                                                style={{ background: '#f8fafc', cursor: 'not-allowed', fontWeight: '500' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row g-4">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label className="fw-bold">1. Sélectionner l'Étudiant</label>
                                            <SearchableSelect
                                                options={studentOptions}
                                                value={formData.user_id}
                                                onChange={(val) => {
                                                    setFormData(prev => ({ ...prev, user_id: val }));
                                                    const s = students.find(st => String(st.id) === val);
                                                    if (s && s.filiere_id) setFilterFiliere(String(s.filiere_id));
                                                }}
                                                placeholder="Rechercher par nom, prénom ou CIN..."
                                                required
                                            />
                                        </div>
                                    </div>

                                    {formData.user_id && (
                                        <>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="fw-bold">2. Confirmer la Filière</label>
                                                    <select className="form-control" value={filterFiliere} onChange={(e) => { setFilterFiliere(e.target.value); setFormData(prev => ({ ...prev, module_id: '' })); }}>
                                                        <option value="">Sélectionner une filière</option>
                                                        {filieres.map(f => <option key={f.id} value={String(f.id)}>{f.nom}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="fw-bold">3. Année Pédagogique</label>
                                                    <select className="form-control" value={filterAnnee} onChange={(e) => { setFilterAnnee(e.target.value); setFormData(prev => ({ ...prev, module_id: '' })); }}>
                                                        <option value="">Toutes les années</option>
                                                        <option value="1">1ère année</option>
                                                        <option value="2">2ème année</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {filterFiliere && (
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label className="fw-bold">4. Module concerné</label>
                                                <SearchableSelect
                                                    options={moduleOptions}
                                                    value={formData.module_id}
                                                    onChange={(val) => setFormData(prev => ({ ...prev, module_id: val }))}
                                                    placeholder="Sélectionner le module..."
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {(isEditMode || formData.module_id) && (
                            <div className="form-section animate-fade-up">
                                <div className="form-section-title">
                                    <Pencil size={18} className="text-primary" />
                                    Détails de la Note
                                </div>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="fw-bold">Type de Contrôle</label>
                                            <select name="type_controle" value={formData.type_controle} onChange={handleChange} required>
                                                <option value="CC">CC — Contrôle Continu</option>
                                                <option value="EFM">EFM — Examen Fin de Module</option>
                                                <option value="EFM_Regional">EFM Régional</option>
                                                <option value="EFF">EFF — Examen Fin de Formation</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            {(() => {
                                                const isEfm = formData.type_controle === 'EFM' || formData.type_controle === 'EFM_Regional';
                                                const maxNote = isEfm ? 40 : 20;
                                                return (
                                                    <>
                                                        <label className="fw-bold text-primary">Note (/{maxNote})</label>
                                                        <input 
                                                            type="number" 
                                                            step="0.01" 
                                                            min="0" 
                                                            max={maxNote} 
                                                            style={{ border: '2px solid var(--admin-accent)' }}
                                                            name="note" 
                                                            value={formData.note} 
                                                            onChange={handleChange} 
                                                            placeholder="0.00" 
                                                            required 
                                                        />
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label className="fw-bold">Coefficient</label>
                                            <input 
                                                type="number" 
                                                step="0.5" 
                                                min="0" 
                                                name="coefficient" 
                                                value={formData.coefficient} 
                                                onChange={handleChange} 
                                                required 
                                                disabled={isEditMode}
                                                style={isEditMode ? { background: '#f8fafc', cursor: 'not-allowed' } : {}}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label className="fw-bold">Remarque / Commentaire (Optionnel)</label>
                                            <textarea 
                                                name="remarque" 
                                                value={formData.remarque} 
                                                onChange={handleChange} 
                                                placeholder="Observations sur la performance de l'étudiant..." 
                                                rows="3"
                                                disabled={isEditMode}
                                                style={isEditMode ? { background: '#f8fafc', cursor: 'not-allowed' } : {}}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="form-footer">
                            <Link to="/admin/notes" className="btn btn-secondary">Annuler</Link>
                            <button type="submit" className="btn btn-primary px-5" disabled={saving || !formData.module_id}>
                                {saving ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                        Enregistrement...
                                    </>
                                ) : (
                                    isEditMode ? 'Mettre à jour la note' : 'Valider et Enregistrer'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NoteForm;
