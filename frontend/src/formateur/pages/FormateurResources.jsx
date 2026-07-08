import React, { useEffect, useState, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import { 
  FileText, 
  Plus, 
  X, 
  Trash2, 
  Book, 
  Layout, 
  Loader2,
  Search,
  Filter,
  FileDown,
  Upload,
  FolderOpen
} from 'lucide-react';
import { listResources, createResource, deleteResource } from '../../admin/api/resources';
import { listMyGroupes, listGroupModules } from '../../admin/api/trainers';
import { extractApiError } from '../../admin/api/http';
import { useAuth } from '../../admin/context/AuthContext';
import styles from './FormateurResources.module.css';
import PageHeader from '../../core/components/ui/PageHeader';
import CustomSelect from '../../core/components/ui/CustomSelect';

const ResourceCard = ({ item, onDelete }) => {
  const getIcon = (type) => {
    if (type === 'Cours') return <Book size={20} strokeWidth={2} />;
    return <FileText size={20} strokeWidth={2} />;
  };

  const getBadgeColor = (type) => {
    if (type === 'Cours') return styles.badgePrimary;
    if (type === 'TP') return styles.badgeSuccess;
    return styles.badgeWarning;
  };

  return (
    <div className={styles.resourceCard}>
      <div className={styles.cardMain}>
        <div className={`${styles.iconBox} ${item.type === 'Cours' ? styles.iconPrimary : styles.iconSecondary}`}>
          {getIcon(item.type)}
        </div>
        <div className={styles.info}>
          <h4>{item.titre}</h4>
          <div className={styles.meta}>
            <span className={`${styles.badge} ${getBadgeColor(item.type)}`}>{item.type}</span>
            <span className={styles.separator}>•</span>
            <span className={styles.moduleName}>{item.module?.nom}</span>
          </div>
          <div className={styles.groupeTag}>
            <Layout size={12} strokeWidth={2} />
            <span>{item.groupe?.nom}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.cardActions}>
        <a 
          href={item.fichier_url || `http://127.0.0.1:8000/storage/${item.fichier}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.actionBtn}
          title="Télécharger"
        >
          <FileDown size={18} strokeWidth={2} />
        </a>
        <button 
          onClick={() => onDelete(item.id)}
          className={`${styles.actionBtn} ${styles.btnDanger}`}
          title="Supprimer"
        >
          <Trash2 size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default function FormateurResources() {
  const { user: currentUser } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupes, setGroupes] = useState([]);
  const [modules, setModules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ titre: '', type: 'Cours', groupe_id: '', module_id: '' });
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    if (!currentUser) return;
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentUser, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Groupes for the modal
      if (groupes.length === 0) {
        const gResp = await listMyGroupes();
        setGroupes(gResp?.data || []);
      }
      
      const rResp = await listResources({ 
        formateur_id: currentUser.id, 
        per_page: 100,
        search: searchTerm 
      });
      setResources(rResp?.data?.data || rResp?.data || []);
    } catch (e) {
      toast.error("Échec du chargement : " + extractApiError(e));
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };


  useEffect(() => {
    if (!formData.groupe_id) {
      setModules([]);
      setFormData(prev => ({ ...prev, module_id: '' }));
      return;
    }
    (async () => {
      try {
        const mResp = await listGroupModules(formData.groupe_id);
        setModules(mResp.data || []);
      } catch (e) {
        toast.error("Échec du chargement des modules.");
      }
    })();
  }, [formData.groupe_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files[0];
    if (!file) return toast.error("Veuillez sélectionner un fichier.");
    if (!formData.groupe_id || !formData.module_id) return toast.error("Groupe et module sont requis.");

    const data = new FormData();
    data.append('titre', formData.titre);
    data.append('type', formData.type);
    data.append('groupe_id', formData.groupe_id);
    data.append('module_id', formData.module_id);
    data.append('formateur_id', currentUser.id);
    data.append('fichier', file);

    try {
      setSaving(true);
      const resp = await createResource(data);
      setResources(prev => [resp.data, ...prev]);
      toast.success("Ressource partagée avec succès !");
      setShowModal(false);
      setFormData({ titre: '', type: 'Cours', groupe_id: '', module_id: '' });
      setSelectedFileName('');
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette ressource ? Cette action est définitive.")) return;
    try {
      await deleteResource(id);
      setResources(prev => prev.filter(r => r.id !== id));
      toast.success("Ressource supprimée.");
    } catch (e) {
      toast.error(extractApiError(e));
    }
  };

  const resourcesCours = useMemo(() => resources.filter(r => r.type === 'Cours'), [resources]);
  const resourcesOthers = useMemo(() => resources.filter(r => r.type !== 'Cours'), [resources]);


  return (
    <div className={styles.pageWrapper}>
      <PageHeader 
        breadcrumb={[{ label: 'Portail' }, { label: 'Ressources' }]}
        title="Ressources pédagogiques"
        subtitle="Gérez et partagez vos supports de cours, TP et exercices avec vos étudiants."
        icon={<FolderOpen size={24} />}
        actions={
          <button onClick={() => setShowModal(true)} className={styles.addBtn}>
            <Plus size={20} strokeWidth={2.5} />
            Nouveau document
          </button>
        }
      />

      <div className={styles.pageBody}>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} strokeWidth={2} />
            <input 
              type="text" 
              placeholder="Rechercher une ressource, un module..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.filters}>
            <button className={styles.filterBtn}>
              <Filter size={18} strokeWidth={2} />
              Filtrer
            </button>
          </div>
        </div>

        <div className={styles.resourceGrid}>
          {/* Section Cours */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <Book size={20} className={styles.iconBlue} strokeWidth={2.5} />
                <h3>Supports de cours</h3>
              </div>
              <span className={styles.countBadge}>{loading ? '--' : resourcesCours.length}</span>
            </div>
            
            <div className={styles.cardList}>
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)
              ) : resourcesCours.length === 0 ? (
                <div className={styles.emptyColumn}>
                  <Book size={40} strokeWidth={1.5} />
                  <p>Aucun support de cours publié.</p>
                </div>
              ) : (
                resourcesCours.map(item => <ResourceCard key={item.id} item={item} onDelete={handleDelete} />)
              )}
            </div>
          </div>

          {/* Section TP/TD/Exercices */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <FileText size={20} className={styles.iconPurple} strokeWidth={2.5} />
                <h3>TP, exercices & TD</h3>
              </div>
              <span className={styles.countBadge}>{loading ? '--' : resourcesOthers.length}</span>
            </div>
            
            <div className={styles.cardList}>
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)
              ) : resourcesOthers.length === 0 ? (
                <div className={styles.emptyColumn}>
                  <FileText size={40} strokeWidth={1.5} />
                  <p>Aucun TP ou exercice publié.</p>
                </div>
              ) : (
                resourcesOthers.map(item => <ResourceCard key={item.id} item={item} onDelete={handleDelete} />)
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleIcon}>
                <FolderOpen size={24} strokeWidth={2.5} />
                <h3>Partager un document</h3>
              </div>
              <button onClick={() => setShowModal(false)} className={styles.closeBtn}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Titre du document</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={formData.titre} 
                  onChange={e => setFormData({ ...formData, titre: e.target.value })} 
                  required 
                  placeholder="Ex: Chapitre 1 - Introduction au développement web" 
                />
              </div>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Type de ressource</label>
                  <CustomSelect 
                    options={[
                      { value: 'Cours', label: 'Support de cours' },
                      { value: 'TP', label: 'Travaux pratiques (TP)' },
                      { value: 'TD', label: 'Travaux dirigés (TD)' },
                      { value: 'Exercice', label: 'Exercice d\'application' },
                    ]}
                    value={formData.type}
                    onChange={(val) => setFormData({ ...formData, type: val })}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Fichier</label>
                  <div className={styles.fileUpload}>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      required 
                      id="file-upload" 
                      className={styles.fileInput}
                      onChange={(e) => setSelectedFileName(e.target.files?.[0]?.name || '')}
                    />
                    <label htmlFor="file-upload" className={styles.fileLabel}>
                      <Upload size={18} strokeWidth={2} />
                      <span className="text-truncate" style={{ maxWidth: '150px' }}>
                        {selectedFileName || 'Choisir un fichier'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Groupe cible</label>
                  <CustomSelect 
                    options={groupes.map(g => ({ value: String(g.id), label: g.nom }))}
                    value={formData.groupe_id}
                    onChange={(val) => setFormData({ ...formData, groupe_id: val })}
                    placeholder="Sélectionner un groupe"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Module concerné</label>
                  <CustomSelect 
                    options={modules.map(m => ({ value: String(m.id), label: m.nom }))}
                    value={formData.module_id}
                    onChange={(val) => setFormData({ ...formData, module_id: val })}
                    placeholder={!formData.groupe_id ? "Choisir un groupe d'abord" : "Sélectionner un module"}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Annuler</button>
                <button type="submit" disabled={saving} className={styles.submitBtn}>
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                  {saving ? 'Publication...' : 'Publier la ressource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
