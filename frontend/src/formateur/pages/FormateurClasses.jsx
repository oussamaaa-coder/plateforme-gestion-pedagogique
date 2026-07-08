import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap, 
  ClipboardList,
  Search,
  MoreVertical,
  User,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { listMyGroupes, listGroupStudents, listGroupModules } from '../../admin/api/trainers';
import { extractApiError } from '../../admin/api/http';
import styles from './FormateurClasses.module.css';
import PageHeader from '../../core/components/ui/PageHeader';

export default function FormateurClasses() {
  const [groupes, setGroupes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingSub, setLoadingSub] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGroupes();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchGroupes = async () => {
    try {
      setLoading(true);
      const data = await listMyGroupes({ search: searchTerm });
      setGroupes(data?.data || []);
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setLoading(false);
    }
  };


  const handleSelectGroup = async (groupe) => {
    setSelectedGroup(groupe);
    setSelectedModule(null);
    try {
      setLoadingSub(true);
      const mResp = await listGroupModules(groupe.id);
      setModules(mResp?.data || []);
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setLoadingSub(false);
    }
  };

  useEffect(() => {
    if (selectedModule) {
      const timer = setTimeout(() => {
        handleSelectModule(selectedModule);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, selectedModule]);

  const handleSelectModule = async (module) => {
    setSelectedModule(module);
    try {
      setLoadingSub(true);
      const sResp = await listGroupStudents(selectedGroup.id, { search: searchTerm });
      setStudents(sResp?.data || []);
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setLoadingSub(false);
    }
  };


  const handleBack = () => {
    if (selectedModule) {
      setSelectedModule(null);
      setStudents([]);
    } else {
      setSelectedGroup(null);
      setModules([]);
    }
  };

  const filteredItems = (items, field) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item[field]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (field === 'nom' && item.prenom?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.shimmerHeader} />
        <div className={styles.shimmerGrid}>
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // Build breadcrumb items dynamically
  const breadcrumbItems = [
    { label: 'Tableau de bord', path: '/formateur' },
    { label: 'Mes groupes', path: selectedGroup ? '/formateur/classes' : null }
  ];
  if (selectedGroup) {
    breadcrumbItems.push({ 
      label: selectedGroup.nom, 
      path: selectedModule ? null : null // Active if no module
    });
  }
  if (selectedModule) {
    breadcrumbItems.push({ label: selectedModule.nom });
  }

  const pageTitle = selectedModule 
    ? selectedModule.nom 
    : (selectedGroup ? selectedGroup.nom : 'Mes groupes');

  const pageSubtitle = selectedModule 
    ? 'Liste des étudiants inscrits à ce module.' 
    : (selectedGroup ? 'Choisissez un module pour consulter les étudiants.' : 'Gérez vos groupes et modules assignés.');

  return (
    <div className={styles.pageWrapper}>
      <PageHeader 
        breadcrumb={breadcrumbItems}
        title={pageTitle}
        subtitle={pageSubtitle}
        icon={selectedModule ? <BookOpen size={24} /> : <Users size={24} />}
        actions={selectedGroup && (
          <button onClick={handleBack} className={styles.backBtn}>
            <ChevronLeft size={18} strokeWidth={2.5} />
            Retour
          </button>
        )}
      />


      <div className={styles.pageBody}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} strokeWidth={2} />
            <input 
              type="text" 
              placeholder={selectedModule ? "Rechercher un étudiant..." : "Rechercher un groupe..."} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {!selectedGroup ? (
          /* Groupes Grid */
          <div className={styles.grid}>
            {groupes.map(cls => (

              <div key={cls.id} className={styles.groupCard} onClick={() => handleSelectGroup(cls)}>
                <div className={styles.groupHeader}>
                  <div className={styles.groupAvatar}>
                    {cls.nom.substring(0, 2).toUpperCase()}
                  </div>
                  <div className={styles.groupBadge}>
                    {cls.annee === 1 ? '1ère année' : '2ème année'}
                  </div>
                </div>
                <div className={styles.groupBody}>
                  <h3>{cls.nom}</h3>
                  <p>{cls.filiere?.nom || 'Filière non définie'}</p>
                </div>
                <div className={styles.groupFooter}>
                  <div className={styles.stat}>
                    <Users size={16} strokeWidth={2} />
                    <span>{cls.students_count || 0} étudiants</span>
                  </div>
                  <ArrowRight size={18} className={styles.arrow} />
                </div>
              </div>
            ))}
            {groupes.length === 0 && (
              <div className={styles.empty}>
                <Users size={48} strokeWidth={1.5} />
                <p>Aucun groupe ne vous est assigné pour le moment.</p>
              </div>
            )}
          </div>
        ) : !selectedModule ? (
          /* Modules Grid */
          <div className={styles.grid}>
            {loadingSub ? (
              [1, 2, 3].map(i => <div key={i} className="skeleton h-32 rounded-xl" />)
            ) : modules.map(mod => (
              <div key={mod.id} className={styles.moduleCard} onClick={() => handleSelectModule(mod)}>
                <div className={styles.moduleIcon}>
                  <BookOpen size={24} strokeWidth={2} />
                </div>
                <div className={styles.moduleBody}>
                  <h3>{mod.nom}</h3>
                  <div className={styles.moduleMeta}>
                    <span>COEFF: {mod.coefficient}</span>
                    <span>•</span>
                    <span>Mass hor: {mod.masse_horaire}h</span>
                  </div>
                </div>
                <ArrowRight size={18} className={styles.arrow} />
              </div>
            ))}
          </div>
        ) : (
          /* Students Table */
          <div className={styles.tableCard}>
            {loadingSub ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton h-12 w-full" />)}
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Étudiant</th>
                      <th>CIN / Matricule</th>
                      <th className={styles.textRight}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td><span className={styles.rank}>{student.numero_liste || '-'}</span></td>
                        <td>
                          <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                              {student.prenom[0]}{student.nom[0]}
                            </div>
                            <div className={styles.userDetails}>
                              <span className={styles.userName}>{student.prenom} {student.nom}</span>
                              <span className={styles.userMail}>{student.email || 'Pas d\'email'}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={styles.badgeSecondary}>{student.cin || student.matricule || 'N/A'}</span>
                        </td>
                        <td className={styles.textRight}>
                          <Link 
                            to={`/formateur/notes/add?student_id=${student.id}&groupe_id=${selectedGroup.id}&module_id=${selectedModule.id}`}
                            className={styles.actionBtn}
                          >
                            <ClipboardList size={16} strokeWidth={2} />
                            <span>Attribuer une note</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
