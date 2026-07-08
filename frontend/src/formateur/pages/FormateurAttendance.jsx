import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Save,
  ChevronRight,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getFormateurDashboard } from '../../admin/api/dashboard';
import { listGroupStudents } from '../../admin/api/trainers';
import { createAbsence } from '../../admin/api/absences';
import { extractApiError } from '../../admin/api/http';
import styles from './FormateurAttendance.module.css';

export default function FormateurAttendance() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [attendanceData, setAttendanceData] = useState({}); // student_id -> status
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSessions() {
      try {
        setLoading(true);
        const resp = await getFormateurDashboard();
        setSessions(resp?.data?.today_schedule || []);
      } catch (e) {
        toast.error("Erreur lors du chargement des séances.");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    }
    loadSessions();
  }, []);

  const handleSelectSession = async (session) => {
    setSelectedSession(session);
    setAttendanceData({});
    try {
      setLoadingStudents(true);
      const resp = await listGroupStudents(session.groupe_id);
      const studentList = resp?.data || [];
      setStudents(studentList);
      
      const initialAttendance = {};
      studentList.forEach(s => {
        initialAttendance[s.id] = 'present';
      });
      setAttendanceData(initialAttendance);
    } catch (e) {
      toast.error("Erreur lors du chargement des étudiants.");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!window.confirm("Voulez-vous valider la feuille de présence ?")) return;
    setSaving(true);
    try {
      const absencePromises = Object.entries(attendanceData)
        .filter(([_, status]) => status !== 'present')
        .map(([studentId, status]) => {
          return createAbsence({
            user_id: studentId,
            date: new Date().toISOString().split('T')[0],
            type: status === 'absent' ? 'Absence' : 'Retard',
            justifiee: false,
            commentaire: `Marqué par le formateur pendant la séance de ${selectedSession.module?.nom}`
          });
        });

      await Promise.all(absencePromises);
      toast.success("Présences enregistrées avec succès !");
      setSelectedSession(null);
    } catch (e) {
      toast.error("Erreur lors de l'enregistrement : " + extractApiError(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.shimmerHeader} />
        <div className={styles.shimmerGrid}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbItem}>Portail</span>
            <ChevronRight size={14} className={styles.breadcrumbSeparator} />
            <span className={styles.breadcrumbActive}>Séances & présences</span>
          </div>
          <h1>Appel & présences</h1>
          <p className={styles.subtitle}>Gérez l'assiduité de vos étudiants pour les séances d'aujourd'hui.</p>
        </div>
      </div>

      <div className={styles.content}>
        {!selectedSession ? (
          <div className={styles.sessionGrid}>
            <div className={styles.sectionTitle}>
              <Clock size={20} strokeWidth={2.5} className="text-primary" />
              <h2>Séances d'aujourd'hui</h2>
            </div>
            <div className={styles.sessionsList}>
              {sessions.length > 0 ? (
                sessions.map((session, idx) => (
                  <div key={idx} className={styles.sessionCard} onClick={() => handleSelectSession(session)}>
                    <div className={styles.sessionTime}>
                      <span className={styles.start}>{session.heure_debut}</span>
                      <span className={styles.end}>{session.heure_fin}</span>
                    </div>
                    <div className={styles.sessionInfo}>
                      <h3>{session.module?.nom}</h3>
                      <div className={styles.sessionMeta}>
                        <span className={styles.metaItem}><Users size={14} /> {session.groupe?.nom}</span>
                        <span className={styles.metaItem}><MapPin size={14} /> Salle {session.salle}</span>
                      </div>
                    </div>
                    <div className={styles.sessionAction}>
                      <button className={styles.btnAppel}>
                        Faire l'appel
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptySessions}>
                  <Calendar size={48} strokeWidth={1.5} />
                  <p>Aucune séance prévue pour aujourd'hui.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.attendanceArea}>
            <div className={styles.attendanceHeader}>
              <div className={styles.sessionBrief}>
                <button onClick={() => setSelectedSession(null)} className={styles.backBtn}>
                  <ChevronRight size={20} strokeWidth={2.5} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <div>
                  <h3>{selectedSession.module?.nom}</h3>
                  <p>{selectedSession.groupe?.nom} • {selectedSession.heure_debut} - {selectedSession.heure_fin}</p>
                </div>
              </div>
              <div className={styles.attendanceStats}>
                <div className={styles.statMini}>
                  <span className={styles.statLabel}>Présents</span>
                  <span className={styles.statVal}>{Object.values(attendanceData).filter(v => v === 'present').length}</span>
                </div>
                <div className={styles.statMini}>
                  <span className={styles.statLabel}>Absents</span>
                  <span className={styles.statValDanger}>{Object.values(attendanceData).filter(v => v === 'absent').length}</span>
                </div>
              </div>
            </div>

            <div className={styles.studentListCard}>
              {loadingStudents ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton h-12 w-full" />)}
                </div>
              ) : (
                <>
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Étudiant</th>
                          <th className={styles.textCenter}>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student.id}>
                            <td>
                              <div className={styles.studentRow}>
                                <div className={styles.avatar}>
                                  {student.prenom[0]}{student.nom[0]}
                                </div>
                                <div>
                                  <div className={styles.studentName}>{student.prenom} {student.nom}</div>
                                  <div className={styles.studentCin}>{student.cin}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className={styles.statusButtons}>
                                <button 
                                  className={`${styles.statusBtn} ${attendanceData[student.id] === 'present' ? styles.activePresent : ''}`}
                                  onClick={() => handleStatusChange(student.id, 'present')}
                                >
                                  <CheckCircle2 size={16} strokeWidth={2} />
                                  <span>Présent</span>
                                </button>
                                <button 
                                  className={`${styles.statusBtn} ${attendanceData[student.id] === 'late' ? styles.activeLate : ''}`}
                                  onClick={() => handleStatusChange(student.id, 'late')}
                                >
                                  <AlertCircle size={16} strokeWidth={2} />
                                  <span>Retard</span>
                                </button>
                                <button 
                                  className={`${styles.statusBtn} ${attendanceData[student.id] === 'absent' ? styles.activeAbsent : ''}`}
                                  onClick={() => handleStatusChange(student.id, 'absent')}
                                >
                                  <XCircle size={16} strokeWidth={2} />
                                  <span>Absent</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={styles.attendanceFooter}>
                    <button className={styles.saveBtn} onClick={handleSubmit} disabled={saving}>
                      {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} strokeWidth={2} />}
                      Valider les présences
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <footer className="mt-8 pt-8 border-t border-slate-200 flex justify-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          ISTA NTIC • PORTAIL FORMATEUR
        </p>
      </footer>
    </div>
  );
}
