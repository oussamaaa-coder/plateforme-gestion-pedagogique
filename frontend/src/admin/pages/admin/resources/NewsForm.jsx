import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createNews, getNews, updateNews } from '../../../api/news';
import { extractApiError } from '../../../api/http';

const NewsForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        titre: '',
        contenu: '',
        image: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isEditMode) return;
        let mounted = true;

        (async () => {
            try {
                const resp = await getNews(id);
                if (!mounted) return;
                const n = resp?.data;
                setFormData({
                    titre: n?.titre || '',
                    contenu: n?.contenu || '',
                    image: n?.image || ''
                });
            } catch (e) {
                toast.error(extractApiError(e));
            }
        })();

        return () => { mounted = false; };
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            if (isEditMode) {
                await updateNews(id, formData);
                toast.success('Actualité mise à jour avec succès.');
            } else {
                await createNews(formData);
                toast.success('Actualité créée avec succès.');
            }
            navigate('/admin/news');
        } catch (e2) {
            toast.error(extractApiError(e2));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div className="content-page-header">
                    <h5>{isEditMode ? 'Modifier Actualité' : 'Ajouter Actualité'}</h5>
                </div>
            </div>
            
            <div className="row">
                <div className="col-md-12">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group-item">
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Titre de l'Actualité</label>
                                            <input type="text" className="form-control" name="titre" value={formData.titre} onChange={handleChange} placeholder="Titre" required />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Contenu</label>
                                            <textarea className="form-control" name="contenu" value={formData.contenu} onChange={handleChange} placeholder="Contenu" rows="6" required></textarea>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>URL de l'Image (optionnel)</label>
                                            <input type="text" className="form-control" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-end">
                                <Link to="/admin/news" className="btn btn-primary cancel me-2">Annuler</Link>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsForm;
