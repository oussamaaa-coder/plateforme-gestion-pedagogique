import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  BookOpen, 
  Download, 
  Search, 
  FolderOpen, 
  User,
  Filter,
  File
} from 'lucide-react';
import { toast } from 'react-toastify';
import { listResources } from '../../admin/api/resources';
import { useAuth } from '../../admin/context/AuthContext';
import Skeleton from '../../core/components/ui/Skeleton';
import useDebounce from '../../core/hooks/useDebounce';

const ResourceCard = ({ item }) => {
  const isCours = item.type === 'Cours';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group bg-white border border-slate-200/60 p-4 rounded-2xl flex items-center gap-4 hover:border-indigo-200 hover:shadow-md transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isCours ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
        {isCours ? <BookOpen size={22} /> : <FileText size={22} />}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-[14px] font-bold text-slate-900 truncate mb-1 group-hover:text-indigo-600 transition-colors">{item.titre}</h4>
        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span className="text-indigo-500 truncate max-w-[150px]">{item.module?.nom || 'GÉNÉRAL'}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <User size={10} />
            <span className="truncate max-w-[100px]">{item.formateur ? `${item.formateur.prenom} ${item.formateur.nom}` : 'DIRECTION'}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => window.open(item.fichier_url || `http://127.0.0.1:8000/storage/${item.fichier}`, '_blank')}
        className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
        title="Télécharger"
      >
        <Download size={18} />
      </button>
    </motion.div>
  );
};

const ResourceSkeleton = () => (
  <div className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4">
    <Skeleton className="w-12 h-12 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-1/2 h-3" />
    </div>
    <Skeleton className="w-10 h-10 rounded-xl" />
  </div>
);

export default function StudentResources() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!user?.groupe_id) return;
    (async () => {
      try {
        const resp = await listResources({ groupe_id: user.groupe_id, per_page: 200 });
        setResources(resp?.data?.data || resp?.data || []);
      } catch (e) {
        toast.error("Échec du chargement des ressources.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const uniqueModules = useMemo(() => {
    const modulesMap = new Map();
    resources.forEach(r => {
      if (r.module) modulesMap.set(r.module_id, r.module);
    });
    return Array.from(modulesMap.values());
  }, [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
        const matchesModule = !selectedModule || String(r.module_id) === selectedModule;
        const matchesSearch = !debouncedSearchTerm || r.titre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || r.module?.nom.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        return matchesModule && matchesSearch;
    });
  }, [resources, selectedModule, debouncedSearchTerm]);

  const resourcesCours = useMemo(() => filteredResources.filter(r => r.type === 'Cours'), [filteredResources]);
  const resourcesOthers = useMemo(() => filteredResources.filter(r => r.type !== 'Cours'), [filteredResources]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm shadow-indigo-100">
              <FolderOpen size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Médiathèque</h2>
          </div>
          <p className="text-sm font-semibold text-slate-500 max-w-md">
            Accédez à tous vos supports de cours, TP et exercices partagés par vos formateurs.
          </p>
        </div>

        <div className="bg-indigo-600 p-6 rounded-[2rem] text-white flex items-center gap-6 shadow-xl shadow-indigo-100">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">Total Fichiers</p>
            {loading ? <Skeleton className="w-12 h-8 bg-white/20 mx-auto" /> : <p className="text-3xl font-black leading-none">{resources.length}</p>}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <File size={24} />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/60 p-4 rounded-[1.5rem] shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none placeholder:text-slate-400"
            placeholder="Rechercher un document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            <option value="">Tous les modules</option>
            {uniqueModules.map(m => (
              <option key={m.id} value={String(m.id)}>{m.nom}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1.5 bg-indigo-600 rounded-full"></div>
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Supports de Cours</h3>
            </div>
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black">{loading ? '...' : resourcesCours.length}</span>
          </div>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array(3).fill(0).map((_, i) => <ResourceSkeleton key={i} />)
              ) : resourcesCours.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[2rem]">
                  <File size={32} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-sm font-bold text-slate-400">Aucun cours trouvé</p>
                </motion.div>
              ) : (
                resourcesCours.map(item => <ResourceCard key={item.id} item={item} />)
              )}
            </AnimatePresence>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1.5 bg-amber-500 rounded-full"></div>
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">TP & Exercices</h3>
            </div>
            <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black">{loading ? '...' : resourcesOthers.length}</span>
          </div>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array(3).fill(0).map((_, i) => <ResourceSkeleton key={i} />)
              ) : resourcesOthers.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[2rem]">
                  <File size={32} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-sm font-bold text-slate-400">Aucun exercice trouvé</p>
                </motion.div>
              ) : (
                resourcesOthers.map(item => <ResourceCard key={item.id} item={item} />)
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
