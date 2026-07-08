import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteNews, listNews } from '../../../api/news';
import { extractApiError } from '../../../api/http';
import { EllipsisVertical, Pencil, Trash2, PlusCircle, Filter } from 'lucide-react';

const NewsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);

    const queryParams = useMemo(() => ({
        search: searchTerm || undefined,
        per_page: 50,
    }), [searchTerm]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await listNews(queryParams);
                if (!mounted) return;
                setNews(resp?.data?.data || []);
            } catch (e) {
                toast.error(extractApiError(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [queryParams]);

    const handleDelete = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
            (async () => {
                try {
                    await deleteNews(id);
                    setNews(prev => prev.filter(item => item.id !== id));
                    toast.success("Actualité supprimée avec succès !");
                } catch (e) {
                    toast.error(extractApiError(e));
                }
            })();
        }
    };

    return (
        <div>
            <div className="page-header">
                <div className="content-page-header">
                    <h5>Actualités & Annonces</h5>
                    <div className="list-btn">
                        <ul className="filter-list">
                            <li>
                                <div className="top-nav-search me-3">
                                    <form onSubmit={e => e.preventDefault()}>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Rechercher actualité..." 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </form>
                                </div>
                            </li>
                            <li>
                                <Link className="btn btn-filters w-auto popup-toggle"><span className="me-2"><i className="fe fe-filter"></i></span>Filtre </Link>
                            </li>
                             <li>
                                 <Link className="btn btn-primary" to="/admin/news/add"><PlusCircle size={18} className="me-2" />Ajouter Annonce</Link>
                             </li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="row">
                <div className="col-sm-12">
                    <div className="card-table">
                        <div className="card-body">
                            <div className="table-responsive" style={{ overflow: 'visible', minHeight: '300px' }}>
                                <table className="table table-center table-hover datatable">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Titre</th>
                                            <th>Contenu</th>
                                            <th>Date de création</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="text-center">Chargement...</td>
                                            </tr>
                                        ) : news.length > 0 ? news.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td><strong>{item.titre}</strong></td>
                                                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.contenu}
                                                </td>
                                                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                                                 <td className="d-flex align-items-center">
                                                     <div className="dropdown dropdown-action">
                                                         <Link to="#" className="btn btn-sm btn-light p-0 d-inline-flex align-items-center justify-content-center rounded-circle border text-dark" style={{ width: 32, height: 32, minWidth: 32 }} data-bs-toggle="dropdown" aria-expanded="false">
                                                             <EllipsisVertical size={22} strokeWidth={3} style={{ minWidth: 22, minHeight: 22 }} />
                                                         </Link>
                                                         <div className="dropdown-menu dropdown-menu-right shadow-sm border-0">
                                                             <ul>
                                                                 <li>
                                                                     <Link className="dropdown-item d-flex align-items-center py-2" to={`/admin/news/edit/${item.id}`}><Pencil size={14} className="me-2 text-primary" />Modifier</Link>
                                                                 </li>
                                                                 <li>
                                                                     <button className="dropdown-item d-flex align-items-center py-2 text-danger" onClick={() => handleDelete(item.id)} style={{border: 'none', background: 'none', width: '100%', textAlign: 'left'}}><Trash2 size={14} className="me-2" />Supprimer</button>
                                                                 </li>
                                                             </ul>
                                                         </div>
                                                     </div>
                                                 </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">Aucune actualité trouvée</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsList;
