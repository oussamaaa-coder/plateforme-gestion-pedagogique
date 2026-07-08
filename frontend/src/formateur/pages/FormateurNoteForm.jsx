import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Loader2, 
  ClipboardList, 
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { createNote } from '../../admin/api/notes';
import { listGroupStudents, listGroupModules } from '../../admin/api/trainers';
import { extractApiError } from '../../admin/api/http';
import { useAuth } from '../../admin/context/AuthContext';
import SearchableSelect from '../../core/components/ui/SearchableSelect';
import styles from './FormateurNoteForm.module.css';

export default function FormateurNoteForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const initialStudentId = searchParams.get('student_id') || '';
    const initialModuleId = searchParams.get('module_id') || '';
    const initialGroupeId = searchParams.get('groupe_id') || '';

    const [formData, setFormData] = useState({
        user_id: initialStudentId,
        module_id: initialModuleId,
        note: '',
        type_controle: 'CC',
        coefficient: '1',
        remarque: '',
        formateur_id: user?.id ? String(user.id) : ''
    });

    const [students, setStudents] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!initialGroupeId) return;
        (async () => {
            try {
                setLoading(true);
                const [sResp, mResp] = await Promise.all([
                    listGroupStudents(initialGroupeId),
                    listGroupModules(initialGroupeId)
                ]);
                setStudents(sResp?.data || []);
                setModules(mResp?.data || []);
            } catch (e) {
                toast.error(extractApiError(e));
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        })();
    }, [initialGroupeId]);

    useEffect(() => {
        if (user?.id) {
            setFormData(prev => ({ ...prev, formateur_id: String(user.id) }));
        }
    }, [user]);

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

    const studentOptions = useMemo(() =>
        students.map((s) => ({
            value: String(s.id),
            label: `${s.prenom} ${s.nom}`,
            subtitle: s.cin
        })),
    [students]);

    const moduleOptions = useMemo(() =>
        modules.map((m) => ({
            value: String(m.id),
            label: m.nom,
            subtitle: `Coeff: ${m.coefficient}`
        })),
    [modules]);

    const selectedStudent = useMemo(() => 
        students.find(s => String(s.id) === String(formData.user_id)),
    [students, formData.user_id]);

    const selectedModule = useMemo(() => 
        modules.find(m => String(m.id) === String(formData.module_id)),
    [modules, formData.module_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.formateur_id) return toast.error("Formateur non identifié.");
        
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
            await createNote(payload);
            toast.success('La note a été enregistrée avec succès.');
            navigate('/formateur/notes');
        } catch (e2) {
            toast.error(extractApiError(e2));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loader}>
                <div className={styles.shimmerHeader} />
                <div className={styles.shimmerForm} />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.breadcrumb}>
                        <Link to="/formateur" className={styles.breadcrumbItem}>Tableau de bord</Link>
                        <ChevronRight size={14} className={styles.breadcrumbSeparator} />
                        <Link to="/formateur/notes" className={styles.breadcrumbItem}>Notes</Link>
                        <ChevronRight size={14} className={styles.breadcrumbSeparator} />
                        <span className={styles.breadcrumbActive}>Nouvelle évaluation</span>
                    </div>
                    
                    <div className={styles.titleRow}>
                        <h1>Attribuer une note</h1>
                        <Link to="/formateur/classes" className={styles.backBtn}>
                            <ChevronLeft size={18} strokeWidth={2.5} />
                            Retour
                        </Link>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.formGrid}>
                    <form onSubmit={handleSubmit} className={styles.formCard}>
                        <div className={styles.cardHeader}>
                            <CheckCircle2 size={20} className={styles.headerIcon} strokeWidth={2.5} />
                            <h3>Détails de l'évaluation</h3>
                        </div>
                        
                        <div className={styles.cardBody}>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label className={styles.label}>Étudiant</label>
                                    {initialStudentId ? (
                                        <div className={styles.readOnlyInput}>
                                            <div className={styles.avatar}>
                                                {selectedStudent?.prenom[0]}{selectedStudent?.nom[0]}
                                            </div>
                                            <div className={styles.readOnlyInfo}>
                                                <span className={styles.mainInfo}>
                                                    {selectedStudent ? `${selectedStudent.prenom} ${selectedStudent.nom}` : 'Chargement...'}
                                                </span>
                                                <span className={styles.subInfo}>{selectedStudent?.cin}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <SearchableSelect
                                            options={studentOptions}
                                            value={formData.user_id}
                                            onChange={(val) => setFormData(prev => ({ ...prev, user_id: val }))}
                                            placeholder="Rechercher un étudiant..."
                                            required
                                        />
                                    )}
                                </div>
                                
                                <div className={styles.field}>
                                    <label className={styles.label}>Module</label>
                                    {initialModuleId ? (
                                        <div className={styles.readOnlyInput}>
                                            <div className={styles.moduleIcon}>
                                                <ClipboardList size={18} strokeWidth={2} />
                                            </div>
                                            <div className={styles.readOnlyInfo}>
                                                <span className={styles.mainInfo}>
                                                    {selectedModule ? selectedModule.nom : 'Chargement...'}
                                                </span>
                                                <span className={styles.subInfo}>Module de formation</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <SearchableSelect
                                            options={moduleOptions}
                                            value={formData.module_id}
                                            onChange={(val) => setFormData(prev => ({ ...prev, module_id: val }))}
                                            placeholder="Rechercher un module..."
                                            required
                                        />
                                    )}
                                </div>
                            </div>

                            <div className={styles.grid3}>
                                <div className={styles.field}>
                                    <label className={styles.label}>Type d'évaluation</label>
                                    <select className={styles.select} name="type_controle" value={formData.type_controle} onChange={handleChange} required>
                                        <option value="CC">Contrôle continu</option>
                                        <option value="EFM">EFM</option>
                                        <option value="EFM_Regional">EFM régional</option>
                                        <option value="EFF">Examen fin formation</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    {(() => {
                                        const isEfm = formData.type_controle === 'EFM' || formData.type_controle === 'EFM_Regional';
                                        const maxNote = isEfm ? 40 : 20;
                                        return (
                                            <>
                                                <label className={styles.label}>Note (/{maxNote})</label>
                                                <div className={styles.inputWithAddon}>
                                                    <input 
                                                        type="number" 
                                                        step="0.01" 
                                                        min="0" 
                                                        max={maxNote} 
                                                        className={styles.input} 
                                                        name="note" 
                                                        value={formData.note} 
                                                        onChange={handleChange} 
                                                        required 
                                                        placeholder="0.00" 
                                                    />
                                                    <span className={styles.addon}>/ {maxNote}</span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Coefficient</label>
                                    <input 
                                        type="number" 
                                        step="0.5" 
                                        min="0" 
                                        className={styles.input} 
                                        name="coefficient" 
                                        value={formData.coefficient} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Observations / remarques</label>
                                <textarea 
                                    className={styles.textarea} 
                                    name="remarque" 
                                    value={formData.remarque} 
                                    onChange={handleChange} 
                                    placeholder="Ajoutez un commentaire sur la performance de l'étudiant..." 
                                    rows="4" 
                                />
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                             <Link to="/formateur/notes" className={styles.cancelBtn}>
                                <X size={18} strokeWidth={2} />
                                Annuler
                             </Link>
                             <button type="submit" className={styles.submitBtn} disabled={saving}>
                                 {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} strokeWidth={2} />}
                                 {saving ? 'Enregistrement...' : 'Enregistrer la note'}
                             </button>
                        </div>
                    </form>

                    <div className={styles.helperCard}>
                        <div className={styles.helperHeader}>
                            <AlertCircle size={20} strokeWidth={2.5} className="text-primary" />
                            <h3>Conseils de saisie</h3>
                        </div>
                        <ul className={styles.helperList}>
                            <li>Vérifiez soigneusement la note avant d'enregistrer.</li>
                            {(() => {
                                const isEfm = formData.type_controle === 'EFM' || formData.type_controle === 'EFM_Regional';
                                const maxNote = isEfm ? 40 : 20;
                                return <li>Les notes doivent être comprises entre 0 et {maxNote}.</li>;
                            })()}
                            <li>Utilisez le champ coefficient pour ajuster le poids de l'évaluation.</li>
                            <li>Les remarques sont visibles par l'administration.</li>
                        </ul>
                        
                        <div className={styles.quickStats}>
                            <div className={styles.quickStatItem}>
                                <span className={styles.statLabel}>Moyenne classe</span>
                                <span className={styles.statValue}>12.45</span>
                            </div>
                            <div className={styles.quickStatItem}>
                                <span className={styles.statLabel}>Taux réussite</span>
                                <span className={styles.statValue}>78%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <footer className="mt-8 pt-8 border-t border-slate-200 flex justify-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    ISTA NTIC • PORTAIL FORMATEUR
                </p>
            </footer>
        </div>
    );
}
