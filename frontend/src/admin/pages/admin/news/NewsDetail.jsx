import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getNews } from '../../../api/news';
import { extractApiError } from '../../../api/http';
import { FileText, Pencil } from 'lucide-react';

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await getNews(id);
                if (!mounted) return;
                setNews(resp?.data);
            } catch (e) {
                toast.error(extractApiError(e));
                navigate('/admin/news');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="alert alert-warning">
                <i className="fa fa-exclamation-triangle me-2"></i>
                Actualité non trouvée
            </div>
        );
    }

    return (
        <div className="admin-scope pb-8">
            <div className="mb-6">
                <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h5 className="m-0 font-bold text-slate-800 text-lg flex items-center gap-2">
                        <FileText size={22} className="text-blue-600" /> Détail Actualité
                    </h5>
                    <button 
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-xl transition-all text-sm"
                        onClick={() => navigate('/admin/news')}
                    >
                        ← Retour
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-slate-800">{news.titre.replace(/<[^>]*>/g, '')}</h3>
                                <span className={`px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap ml-4 ${
                                    news.statut === 'brouillon' ? 'bg-amber-100 text-amber-700' :
                                    news.statut === 'publiee' ? 'bg-emerald-100 text-emerald-700' :
                                    'bg-slate-100 text-slate-700'
                                }`}>
                                    {news.statut_label || (news.statut === 'brouillon' ? 'Brouillon' : news.statut === 'publiee' ? 'Publiée' : 'Archivée')}
                                </span>
                            </div>

                            {news.image_url && (
                                <img 
                                    src={news.image_url} 
                                    alt={news.titre}
                                    className="w-full rounded-xl mb-6 object-cover"
                                    style={{maxHeight: '450px'}}
                                />
                            )}

                            {news.resume && (
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                                    <strong className="text-blue-900 block mb-1">Résumé:</strong>
                                    <p className="text-blue-800 text-sm leading-relaxed m-0">{news.resume}</p>
                                </div>
                            )}

                            <div className="text-slate-600 leading-relaxed space-y-4">
                                {news.contenu ? news.contenu.split('\n').map((para, idx) => (
                                    para.trim() && <p key={idx} className="m-0">{para}</p>
                                )) : <p className="italic text-slate-400">Aucun contenu.</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                            <h6 className="font-semibold text-slate-700 m-0">Informations</h6>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <small className="text-slate-400 font-medium block mb-1 uppercase tracking-wider text-xs">Auteur</small>
                                <strong className="text-slate-800 block text-sm">
                                    {news.auteur?.prenom && news.auteur?.nom 
                                        ? `${news.auteur.prenom} ${news.auteur.nom}` 
                                        : <em className="text-amber-500 not-italic">Non défini</em>}
                                </strong>
                            </div>
                            <div>
                                <small className="text-slate-400 font-medium block mb-1 uppercase tracking-wider text-xs">Créée le</small>
                                <strong className="text-slate-800 block text-sm">{new Date(news.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                            </div>
                            {news.date_publication && (
                                <div>
                                    <small className="text-slate-400 font-medium block mb-1 uppercase tracking-wider text-xs">Publiée le</small>
                                    <strong className="text-slate-800 block text-sm">{new Date(news.date_publication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                                </div>
                            )}
                            <div>
                                <small className="text-slate-400 font-medium block mb-1 uppercase tracking-wider text-xs">Vues</small>
                                <strong className="text-slate-800 flex items-center text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-slate-400"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    {news.vues || 0}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold py-3 px-4 rounded-xl transition-all"
                            onClick={() => navigate(`/admin/news/${news.id}/edit`)}
                        >
                            <Pencil size={18} /> Modifier l'actualité
                        </button>
                        <button 
                            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 px-4 rounded-xl transition-all"
                            onClick={() => navigate('/admin/news')}
                        >
                            ← Retour à la liste
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
