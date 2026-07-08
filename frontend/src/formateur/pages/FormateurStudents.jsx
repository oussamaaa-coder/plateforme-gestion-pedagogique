import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  ChevronRight,
  MessageSquare,
  GraduationCap,
  Calendar,
  UserSquare2,
  X,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { listMyGroupes, listGroupStudents, sendMessageToStudent } from '../../admin/api/trainers';
import { extractApiError } from '../../admin/api/http';
import { useSearchParams } from 'react-router-dom';
import styles from './FormateurStudents.module.css';
import PageHeader from '../../core/components/ui/PageHeader';
import CustomSelect from '../../core/components/ui/CustomSelect';

export default function FormateurStudents() {
  const [searchParams] = useSearchParams();
  const [groupes, setGroupes] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedGroupId, setSelectedGroupId] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Messaging state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (groupes.length > 0 || selectedGroupId !== 'all') {
      const timer = setTimeout(() => {
        fetchStudents();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, selectedGroupId, groupes]);

  const fetchInitialData = async () => {
    try {
      const gResp = await listMyGroupes();
      const groupsData = gResp?.data || [];
      setGroupes(groupsData);
    } catch (e) {
      toast.error(extractApiError(e));
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      if (selectedGroupId === 'all') {
        if (groupes.length === 0) {
           setStudents([]);
           return;
        }
        const allStudentsPromises = groupes.map(g => listGroupStudents(g.id, { search: searchTerm }));
        const allResps = await Promise.all(allStudentsPromises);
        let allStudents = [];
        allResps.forEach((resp, idx) => {
          const groupStudents = (resp?.data || []).map(s => ({
            ...s,
            groupe_nom: groupes[idx].nom,
            groupe_id: groupes[idx].id
          }));
          allStudents = [...allStudents, ...groupStudents];
        });
        const uniqueStudents = Array.from(new Map(allStudents.map(s => [s.id, s])).values());
        setStudents(uniqueStudents);
      } else {
        const resp = await listGroupStudents(selectedGroupId, { search: searchTerm });
        const groupObj = groupes.find(g => String(g.id) === String(selectedGroupId));
        const groupStudents = (resp?.data || []).map(s => ({
          ...s,
          groupe_nom: groupObj?.nom || 'Groupe',
          groupe_id: selectedGroupId
        }));
        setStudents(groupStudents);
      }
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (student) => {
    setSelectedStudent(student);
    setShowMessageModal(true);
    setMessageText('');
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      setSending(true);
      await sendMessageToStudent({
        student_id: selectedStudent.id,
        message: messageText
      });
      toast.success("Message envoyé avec succès !");
      setShowMessageModal(false);
      setMessageText('');
    } catch (e) {
      toast.error("Erreur lors de l'envoi : " + extractApiError(e));
    } finally {
      setSending(false);
    }
  };

  const handleDetails = (student) => {
    setSelectedStudent(student);
    setShowMessageModal(false); // Make sure we don't open message modal
  };

  const breadcrumb = [
    { label: 'Tableau de bord', path: '/formateur' },
    { label: 'Mes étudiants' }
  ];

  return (
    <div className={styles.pageWrapper}>
      <PageHeader 
        breadcrumb={breadcrumb}
        title="Gestion des étudiants"
        subtitle="Consultez la liste de tous les étudiants de vos groupes respectifs."
        icon={<UserSquare2 size={24} />}
      />

      <div className={styles.pageBody}>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} strokeWidth={2} />
            <input 
              type="text" 
              placeholder="Rechercher par nom, email ou CIN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.filters}>
            <CustomSelect 
              options={[
                { value: 'all', label: 'Tous les groupes' },
                ...groupes.map(g => ({ value: String(g.id), label: g.nom }))
              ]}
              value={selectedGroupId}
              onChange={setSelectedGroupId}
              icon={<Filter size={16} strokeWidth={2.5} />}
            />
          </div>
        </div>

        <div className={styles.grid}>
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton h-64 rounded-3xl" />
            ))
          ) : students.length > 0 ? (
            students.map(student => (
              <div key={student.id} className={styles.studentCard}>
                <div className={styles.cardTop}>
                  <div className={styles.avatar}>
                    {student.prenom[0]}{student.nom[0]}
                  </div>
                  <div className={styles.mainInfo}>
                    <h3>{student.prenom} {student.nom}</h3>
                    <span className={styles.groupBadge}>{student.groupe_nom}</span>
                  </div>
                </div>
                
                <div className={styles.cardBody}>
                  <div className={styles.infoItem}>
                    <Calendar size={14} strokeWidth={2} />
                    <span>Inscrit le {new Date(student.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <Mail size={14} strokeWidth={2} />
                    <span>{student.email || 'Email non renseigné'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <GraduationCap size={14} strokeWidth={2} />
                    <span>CIN: {student.cin || 'N/A'}</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <button className={styles.contactBtn} onClick={() => handleContact(student)}>
                    <MessageSquare size={16} strokeWidth={2} />
                    Message
                  </button>
                  <button className={styles.profileBtn} onClick={() => handleDetails(student)}>
                    Détails
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>
              <Users size={64} strokeWidth={1.5} />
              <h2>Aucun étudiant trouvé</h2>
              <p>Essayez d'ajuster vos filtres ou votre recherche.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Détails Étudiant */}
      {selectedStudent && !showMessageModal && (
        <div className={styles.modalOverlay} onClick={() => setSelectedStudent(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <div className={styles.modalAvatar}>
                  {selectedStudent.prenom[0]}{selectedStudent.nom[0]}
                </div>
                <div>
                  <h3>{selectedStudent.prenom} {selectedStudent.nom}</h3>
                  <span className={styles.modalSubtitle}>Profil Étudiant</span>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedStudent(null)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.infoGrid}>
                <div className={styles.infoSection}>
                  <h4>Informations Personnelles</h4>
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Nom complet</span>
                    <span className={styles.infoValue}>{selectedStudent.prenom} {selectedStudent.nom}</span>
                  </div>
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>{selectedStudent.email || 'N/A'}</span>
                  </div>
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Date de naissance</span>
                    <span className={styles.infoValue}>{selectedStudent.date_naissance ? new Date(selectedStudent.date_naissance).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>CIN / Matricule</span>
                    <span className={styles.infoValue}>{selectedStudent.cin || selectedStudent.matricule || 'N/A'}</span>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h4>Cursus Académique</h4>
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Filière</span>
                    <span className={styles.infoValue}>{selectedStudent.filiere?.nom || 'N/A'}</span>
                  </div>
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Groupe</span>
                    <span className={styles.infoValue}>{selectedStudent.groupe_nom || 'N/A'}</span>
                  </div>
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Année scolaire</span>
                    <span className={styles.infoValue}>{selectedStudent.annee_scolaire || 'N/A'}</span>
                  </div>
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Numéro de liste</span>
                    <span className={styles.infoValue}>#{selectedStudent.numero_liste || '--'}</span>
                  </div>
                </div>
              </div>

              {selectedStudent.specialite && (
                <div className={styles.specialiteSection}>
                  <span className={styles.infoLabel}>Spécialité / Option</span>
                  <p className={styles.specialiteText}>{selectedStudent.specialite}</p>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setSelectedStudent(null)}>Fermer</button>
              <button className={styles.submitBtn} onClick={() => handleContact(selectedStudent)}>
                <Mail size={18} />
                Contacter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Envoyer Message */}
      {showMessageModal && selectedStudent && (
        <div className={styles.modalOverlay} onClick={() => setShowMessageModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                 <div className={styles.modalAvatar} style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                   <Mail size={24} />
                 </div>
                 <div>
                   <h3>Nouveau message</h3>
                   <span className={styles.modalSubtitle}>À: {selectedStudent.prenom} {selectedStudent.nom}</span>
                 </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowMessageModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.field}>
                <label className={styles.infoLabel}>Votre message</label>
                <textarea 
                  className={styles.textarea} 
                  rows="5"
                  placeholder="Écrivez votre message ici... L'étudiant recevra une notification."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <p className="text-[10px] text-slate-400 mt-2">
                  Ce message sera envoyé sous forme de notification instantanée dans le compte de l'étudiant.
                </p>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowMessageModal(false)}>Annuler</button>
              <button 
                className={styles.submitBtn} 
                onClick={handleSendMessage}
                disabled={sending || !messageText.trim()}
              >
                {sending ? 'Envoi...' : 'Envoyer la notification'}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


