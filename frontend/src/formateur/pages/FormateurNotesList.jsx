import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, 
  PlusCircle, 
  Trash2, 
  Search,
  Filter,
  Download,
  MoreVertical,
  FileText
} from 'lucide-react';
import { toast } from 'react-toastify';
import { listNotes, deleteNote } from '../../admin/api/notes';
import { extractApiError } from '../../admin/api/http';
import { useAuth } from '../../admin/context/AuthContext';
import styles from './FormateurNotesList.module.css';

import CustomSelect from '../../core/components/ui/CustomSelect';

const FormateurNotesList = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGroupe, setFilterGroupe] = useState('');

    const fetchNotes = useCallback(async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const resp = await listNotes({ formateur_id: user.id, per_page: 50 });
            setNotes(resp?.data?.data || []);
        } catch (e) {
            toast.error(extractApiError(e));
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchNotes();
        // Fetch groups for filtering
        (async () => {
            try {
                const { listMyGroupes } = await import('../../admin/api/trainers');
                const resp = await listMyGroupes();
                setGroupes(resp?.data || []);
            } catch (e) {
                console.error("Failed to fetch groups for filter", e);
            }
        })();
    }, [fetchNotes]);

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.")) return;
        try {
            await deleteNote(id);
            setNotes(prev => prev.filter(n => n.id !== id));
            toast.success("La note a été supprimée avec succès.");
        } catch (e) {
            toast.error(extractApiError(e));
        }
    };

    const filteredNotes = notes.filter(note => {
        const matchesSearch = 
            note.user?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.user?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.module?.nom?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesGroup = !filterGroupe || String(note.groupe_id) === filterGroupe;
        
        return matchesSearch && matchesGroup;
    });

    if (loading) {
        return (
            <div className={styles.loader}>
                <div className="fm-spinner" />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.breadcrumb}>
                        <Link to="/formateur" className={styles.breadcrumbItem}>Tableau de bord</Link>
                        <span className={styles.separator}>/</span>
                        <span className={styles.breadcrumbActive}>Notes & Évaluations</span>
                    </div>
                    
                    <div className={styles.titleRow}>
                        <h1>Notes & Évaluations</h1>
                        <Link to="/formateur/classes" className={styles.addBtn}>
                            <PlusCircle size={20} />
                            Saisir des notes
                        </Link>
                    </div>
                    
                    <p className={styles.subtitle}>Gérez les évaluations et les résultats académiques de vos étudiants.</p>
                </div>
            </div>

            {/* Content Section */}
            <div className={styles.content}>
                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <div className={styles.searchBox}>
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Rechercher un étudiant ou un module..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className={styles.filters}>
                        <CustomSelect 
                            options={[
                                { value: '', label: 'Tous les groupes' },
                                ...groupes.map(g => ({ value: String(g.id), label: g.nom }))
                            ]}
                            value={filterGroupe}
                            onChange={setFilterGroupe}
                            icon={<Filter size={16} />}
                        />
                        <button className={styles.filterBtn} onClick={() => {
                            if (filteredNotes.length === 0) return toast.info("Aucune donnée à exporter.");
                            
                            const headers = ["Étudiant", "Groupe", "Module", "Type", "Note"];
                            const rows = filteredNotes.map(n => [
                                `${n.user?.prenom} ${n.user?.nom}`,
                                n.groupe?.nom || 'N/A',
                                n.module?.nom,
                                n.type_controle,
                                n.note
                            ]);

                            const csvContent = [
                                headers.join(","),
                                ...rows.map(r => r.join(","))
                            ].join("\n");

                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement("a");
                            const url = URL.createObjectURL(blob);
                            link.setAttribute("href", url);
                            link.setAttribute("download", `notes_${user?.nom}_${new Date().toISOString().split('T')[0]}.csv`);
                            link.style.visibility = 'hidden';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            toast.success("Exportation terminée !");
                        }}>
                            <Download size={18} />
                            Exporter
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className={styles.tableCard}>
                    {filteredNotes.length === 0 ? (
                        <div className={styles.empty}>
                            <FileText size={48} />
                            <p>Aucune note enregistrée ne correspond à votre recherche.</p>
                        </div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Étudiant</th>
                                        <th>Module</th>
                                        <th>Type d'évaluation</th>
                                        <th className={styles.textCenter}>Résultat</th>
                                        <th className={styles.textRight}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredNotes.map((note) => (
                                        <tr key={note.id}>
                                            <td>
                                                <div className={styles.userInfo}>
                                                    <div className={styles.userAvatar}>
                                                        {note.user?.prenom[0]}{note.user?.nom[0]}
                                                    </div>
                                                    <div className={styles.userDetails}>
                                                        <span className={styles.userName}>{note.user?.prenom} {note.user?.nom}</span>
                                                        <span className={styles.userGroup}>{note.groupe?.nom || 'Groupe N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={styles.moduleName}>{note.module?.nom}</span>
                                            </td>
                                            <td>
                                                <span className={styles.typeBadge}>{note.type_controle}</span>
                                            </td>
                                            <td className={styles.textCenter}>
                                                {(() => {
                                                    const isEfm = note.type_controle === 'EFM' || note.type_controle === 'EFM_Regional';
                                                    const maxNote = isEfm ? 40 : 20;
                                                    const isPassed = isEfm ? note.note >= 20 : note.note >= 10;
                                                    return (
                                                        <div className={`${styles.noteBadge} ${isPassed ? styles.noteSuccess : styles.noteDanger}`}>
                                                            <span className={styles.noteValue}>{note.note}</span>
                                                            <span className={styles.noteTotal}>/ {maxNote}</span>
                                                        </div>
                                                    );
                                                })()}
                                            </td>
                                            <td className={styles.textRight}>
                                                <div className={styles.actions}>
                                                    <button onClick={() => handleDelete(note.id)} className={styles.deleteBtn} title="Supprimer">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormateurNotesList;
