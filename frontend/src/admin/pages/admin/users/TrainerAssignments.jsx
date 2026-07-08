import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAssignments, saveAssignments, getTrainer, listAssignments } from '../../../api/trainers';
import { listGroupes } from '../../../api/groupes';
import { listModules } from '../../../api/modules';
import { extractApiError } from '../../../api/http';
import SearchableSelect from '../../../components/SearchableSelect';
import { ChevronRight, PlusCircle, Trash2, ArrowLeft, User, BookOpen, Layers } from 'lucide-react';

const TrainerAssignments = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [trainer, setTrainer] = useState(null);

    const [assignments, setAssignments] = useState([]); // Array of { groupe_id, module_id }
    const [groupes, setGroupes] = useState([]);
    const [modules, setModules] = useState([]);

    // Temporary row state
    const [newAssignment, setNewAssignment] = useState({ groupe_id: '', module_id: '' });
    const [allAssignments, setAllAssignments] = useState([]); // All assignments across all trainers

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const [tResp, aResp, gResp, mResp] = await Promise.all([
                    getTrainer(id),
                    getAssignments(id),
                    listGroupes({ per_page: 500 }),
                    listModules({ per_page: 1000 })
                ]);
                if (!mounted) return;

                setTrainer(tResp?.data);
                setAssignments(aResp?.data || []);
                setGroupes(gResp?.data?.data || []);
                setModules(mResp?.data?.data || []);

                // Load ALL assignments across all trainers for conflict detection
                try {
                    const allResp = await listAssignments({});
                    setAllAssignments(allResp?.data || []);
                } catch (_) { }
            } catch (e) {
                toast.error(extractApiError(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [id]);

    const groupeOptions = useMemo(() =>
        groupes.map(g => ({
            value: String(g.id),
            label: g.nom,
            subtitle: g.filiere?.nom ? `${g.filiere.nom} (${g.annee}${g.annee === 1 ? 'ère' : 'ème'} année)` : `${g.annee}${g.annee === 1 ? 'ère' : 'ème'} année`
        })),
        [groupes]);

    const moduleOptions = useMemo(() => {
        if (!newAssignment.groupe_id) return [];
        const selectedGroupe = groupes.find(g => String(g.id) === String(newAssignment.groupe_id));
        if (!selectedGroupe) return [];

        return modules
            .filter(m => {
                // Filter modules by filiere and year if possible
                if (selectedGroupe.filiere_id && String(m.filiere_id) !== String(selectedGroupe.filiere_id)) return false;
                // Year check (handle both '1' and '1ère année')
                let gYear = String(selectedGroupe.annee || '');
                if (gYear.includes('1')) gYear = '1'; else if (gYear.includes('2')) gYear = '2';
                let mYear = String(m.annee || '');
                if (mYear !== gYear) return false;
                return true;
            })
            .map(m => ({ value: String(m.id), label: m.nom }));
    }, [newAssignment.groupe_id, groupes, modules]);

    const handleAdd = () => {
        if (!newAssignment.groupe_id || !newAssignment.module_id) {
            toast.warning("Veuillez sélectionner un groupe et un module.");
            return;
        }
        // Check if already in this trainer's list
        const exists = assignments.some(a =>
            String(a.groupe_id) === String(newAssignment.groupe_id) &&
            String(a.module_id) === String(newAssignment.module_id)
        );
        if (exists) {
            toast.error("Cette assignation existe déjà dans la liste.");
            return;
        }

        // Check if another trainer already has this group+module
        const conflict = allAssignments.find(a =>
            String(a.groupe_id) === String(newAssignment.groupe_id) &&
            String(a.module_id) === String(newAssignment.module_id) &&
            String(a.formateur_id) !== String(id)
        );
        if (conflict) {
            const groupName = getGroupName(newAssignment.groupe_id);
            const moduleName = getModuleName(newAssignment.module_id);
            toast.error(`⚠️ Conflit : Le module "${moduleName}" pour le groupe "${groupName}" est déjà assigné à un autre formateur. Un groupe ne peut avoir qu'un seul enseignant par module.`);
            return;
        }

        setAssignments(prev => [{ ...newAssignment }, ...prev]);
        setNewAssignment(prev => ({ ...prev, module_id: '' }));
        toast.success("Assignation ajoutée à la liste.");
    };

    const handleRemove = (index) => {
        setAssignments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await saveAssignments(id, assignments.map(a => ({
                groupe_id: Number(a.groupe_id),
                module_id: Number(a.module_id)
            })));
            toast.success("Assignations sauvegardées avec succès.");
            navigate('/admin/trainers');
        } catch (e) {
            toast.error(extractApiError(e));
        } finally {
            setSaving(false);
        }
    };

    const getGroupName = (gid) => groupes.find(g => String(g.id) === String(gid))?.nom || 'Inconnu';
    const getModuleName = (mid) => modules.find(m => String(m.id) === String(mid))?.nom || 'Inconnu';

    if (loading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Chargement des données...</p>
        </div>
    );

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-left">
                    <div className="d-flex align-items-center gap-3">
                        <Link to="/admin/trainers" className="btn-premium-outline" style={{ padding: '8px' }}>
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1>Assigner Groupes & Modules</h1>
                            <div className="breadcrumb">
                                <Link to="/admin">Dashboard</Link>
                                <ChevronRight size={14} className="breadcrumb-separator" />
                                <Link to="/admin/trainers">Formateurs</Link>
                                <ChevronRight size={14} className="breadcrumb-separator" />
                                <span>{trainer?.prenom} {trainer?.nom}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-header-right">
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving || assignments.length === 0}>
                        {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </div>

            <div className="row">
                {/* Selection Form */}
                <div className="col-xl-4 col-lg-5">
                    <div className="form-section">
                        <div className="form-section-title">
                            <PlusCircle size={18} className="text-primary" />
                            Nouvelle Assignation
                        </div>

                        <div className="form-group">
                            <label className="d-flex align-items-center gap-2">
                                <Layers size={14} /> 1. Choisir un Groupe
                            </label>
                            <SearchableSelect
                                options={groupeOptions}
                                value={newAssignment.groupe_id}
                                onChange={(val) => setNewAssignment({ groupe_id: val, module_id: '' })}
                                placeholder="Sélectionner un groupe..."
                                selectSize={6}
                            />
                        </div>

                        <div className="form-group mt-4">
                            <label className="d-flex align-items-center gap-2">
                                <BookOpen size={14} /> 2. Choisir un Module
                            </label>
                            <SearchableSelect
                                options={moduleOptions}
                                value={newAssignment.module_id}
                                onChange={(val) => setNewAssignment(prev => ({ ...prev, module_id: val }))}
                                placeholder={newAssignment.groupe_id ? "Sélectionner un module..." : "Choisissez d'abord un groupe"}
                                disabled={!newAssignment.groupe_id}
                                selectSize={6}
                            />
                        </div>

                        <button
                            className="btn btn-primary w-100 mt-4 py-2"
                            onClick={handleAdd}
                            disabled={!newAssignment.groupe_id || !newAssignment.module_id}
                        >
                            <PlusCircle size={18} /> Ajouter à la liste
                        </button>

                        <div className="mt-4 p-3 rounded bg-light" style={{ fontSize: '12px', border: '1px dashed var(--admin-border)' }}>
                            <p className="mb-0 text-muted">
                                <i className="fa fa-info-circle me-1"></i>
                                Les modules sont automatiquement filtrés par la filière et l'année du groupe sélectionné.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Assignments List */}
                <div className="col-xl-8 col-lg-7">
                    <div className="table-card">
                        <div className="card-header-premium d-flex justify-content-between align-items-center p-3 border-bottom">
                            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                <User size={18} className="text-muted" />
                                Assignations Actuelles ({assignments.length})
                            </h6>
                            <span className="badge bg-primary-soft text-primary px-3">
                                {trainer?.prenom} {trainer?.nom}
                            </span>
                        </div>
                        <div className="table-wrapper" style={{ minHeight: '400px' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '50px' }}>#</th>
                                        <th>Groupe</th>
                                        <th>Module</th>
                                        <th style={{ width: '100px', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5">
                                                <div className="text-muted">
                                                    <Layers size={40} className="mb-3 opacity-20 d-block mx-auto" />
                                                    Aucune assignation pour ce formateur.
                                                </div>
                                            </td>
                                        </tr>
                                    ) : assignments.map((a, idx) => (
                                        <tr key={`${a.groupe_id}-${a.module_id}`}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                <span className="badge badge-info">{getGroupName(a.groupe_id)}</span>
                                            </td>
                                            <td>
                                                <span className="fw-medium">{getModuleName(a.module_id)}</span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    className="action-dropdown-btn text-danger"
                                                    onClick={() => handleRemove(idx)}
                                                    title="Supprimer l'assignation"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-3 border-top bg-light d-flex justify-content-between align-items-center">
                            <span className="small text-muted italic">N'oubliez pas de sauvegarder vos modifications.</span>
                            <div className="d-flex gap-2">
                                <Link to="/admin/trainers" className="btn-premium-outline">Annuler</Link>
                                <button className="btn btn-primary px-4" onClick={handleSave} disabled={saving || assignments.length === 0}>
                                    {saving ? 'Sauvegarde...' : 'Sauvegarder tout'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerAssignments;
