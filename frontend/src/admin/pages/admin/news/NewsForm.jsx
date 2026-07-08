import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { createNews, getNews, updateNews, aiGenerateNews } from '../../../api/news';
import { extractApiError } from '../../../api/http';
import { FileText, Image, Layout, Settings, ChevronLeft, Sparkles } from 'lucide-react';

const NewsForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const { user, loading: authLoading } = useAuth();

    // Protection: only admins can access this form
    useEffect(() => {
        if (!authLoading && user && user.role !== 'admin') {
            toast.error("Accès refusé. Seuls les administrateurs peuvent gérer les actualités.");
            navigate('/admin/news');
        }
    }, [user, authLoading, navigate]);

    const [formData, setFormData] = useState({
        titre: '',
        contenu: '',
        resume: '',
        image: null,
        auteur_id: user?.id || '',
        statut: 'brouillon',
        date_publication: '',
    });

    const [currentImage, setCurrentImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [aiLoadingResume, setAiLoadingResume] = useState(false);
    const [aiLoadingContent, setAiLoadingContent] = useState(false);

    // Load news if edit mode
    useEffect(() => {
        if (!isEditMode) return;
        
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await getNews(id);
                if (!mounted) return;
                
                const news = resp?.data;
                setFormData({
                    titre: news.titre,
                    contenu: news.contenu,
                    resume: news.resume || '',
                    image: null,
                    auteur_id: news.auteur_id || user?.id || '',
                    statut: news.statut,
                    date_publication: news.date_publication ? news.date_publication.split('T')[0] : '',
                });
                setCurrentImage(news.image_url);
            } catch (e) {
                toast.error(extractApiError(e));
                navigate('/admin/news');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [id, isEditMode, navigate, user?.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setCurrentImage(URL.createObjectURL(file));
        }
    };

    const handleEnhanceResume = async () => {
        if (!formData.resume.trim()) {
            toast.warning("Veuillez d'abord saisir un résumé à améliorer.");
            return;
        }

        try {
            setAiLoadingResume(true);
            const resp = await aiGenerateNews({
                type: 'enhance_resume',
                resume: formData.resume
            });
            
            if (resp && resp.data && resp.data.text) {
                setFormData(prev => ({
                    ...prev,
                    resume: resp.data.text.slice(0, 500)
                }));
                toast.success("Résumé amélioré par l'IA !");
            } else {
                toast.error(resp?.message || "Une erreur est survenue lors de l'amélioration.");
            }
        } catch (e) {
            toast.error(extractApiError(e));
        } finally {
            setAiLoadingResume(false);
        }
    };

    const handleGenerateContent = async () => {
        if (!formData.titre.trim()) {
            toast.warning("Veuillez d'abord saisir un titre pour générer le contenu.");
            return;
        }

        try {
            setAiLoadingContent(true);
            const resp = await aiGenerateNews({
                type: 'generate_content',
                titre: formData.titre,
                resume: formData.resume
            });

            if (resp && resp.data && resp.data.text) {
                setFormData(prev => ({
                    ...prev,
                    contenu: resp.data.text
                }));
                toast.success("Corps de l'article généré par l'IA !");
            } else {
                toast.error(resp?.message || "Une erreur est survenue lors de la génération.");
            }
        } catch (e) {
            toast.error(extractApiError(e));
        } finally {
            setAiLoadingContent(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== '') {
                submitData.append(key, formData[key]);
            }
        });

        if (!formData.auteur_id && user?.id) {
            submitData.set('auteur_id', user.id);
        }
        
        try {
            setSubmitting(true);
            
            if (isEditMode) {
                await updateNews(id, submitData);
                toast.success('Actualité mise à jour');
            } else {
                await createNews(submitData);
                toast.success('Actualité créée');
            }
            
            navigate('/admin/news');
        } catch (e) {
            toast.error(extractApiError(e));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-scope">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Chargement du formulaire...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-scope">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>{isEditMode ? 'Modifier l\'Actualité' : 'Nouvelle Actualité'}</h1>
                    <div className="breadcrumb">
                        <span>Administration</span>
                        <span className="breadcrumb-separator">/</span>
                        <span>Contenu</span>
                        <span className="breadcrumb-separator">/</span>
                        <Link to="/admin/news" className="text-muted">Actualités</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="text-primary">{isEditMode ? 'Édition' : 'Création'}</span>
                    </div>
                </div>
                <div className="page-header-right">
                    <Link to="/admin/news" className="btn btn-secondary">
                        <ChevronLeft size={18} /> Retour
                    </Link>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-9">
                    <form onSubmit={handleSubmit}>
                        {/* Section Contenu Principal */}
                        <div className="form-section">
                            <div className="form-section-title">
                                <FileText size={18} className="text-primary" />
                                Contenu de l'Actualité
                            </div>
                            
                            <div className="row g-4">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label className="fw-bold">Titre de l'actualité <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            name="titre"
                                            value={formData.titre}
                                            onChange={handleChange}
                                            placeholder="Entrez un titre percutant..."
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-group">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <label className="fw-bold mb-0">Résumé court</label>
                                            <button
                                                type="button"
                                                onClick={handleEnhanceResume}
                                                disabled={aiLoadingResume || !formData.resume.trim()}
                                                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 py-1 px-2 border-0 bg-transparent"
                                                style={{ fontSize: '0.85rem' }}
                                                title="Améliorer le résumé avec l'IA"
                                            >
                                                {aiLoadingResume ? (
                                                    <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true" style={{ width: '12px', height: '12px' }}></span>
                                                ) : (
                                                    <Sparkles size={14} className="text-primary" />
                                                )}
                                                <span className="text-primary fw-semibold">Améliorer avec l'IA</span>
                                            </button>
                                        </div>
                                        <textarea 
                                            name="resume"
                                            rows="2"
                                            maxLength="500"
                                            value={formData.resume}
                                            onChange={handleChange}
                                            placeholder="Un bref aperçu pour la liste (max 500 caractères)..."
                                        ></textarea>
                                        <div className="text-end mt-1">
                                            <small className="text-muted">{formData.resume.length}/500</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-group">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <label className="fw-bold mb-0">Corps de l'article <span className="text-danger">*</span></label>
                                            <button
                                                type="button"
                                                onClick={handleGenerateContent}
                                                disabled={aiLoadingContent || !formData.titre.trim()}
                                                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 py-1 px-2 border-0 bg-transparent"
                                                style={{ fontSize: '0.85rem' }}
                                                title="Générer le corps de l'article avec l'IA à partir du titre et du résumé"
                                            >
                                                {aiLoadingContent ? (
                                                    <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true" style={{ width: '12px', height: '12px' }}></span>
                                                ) : (
                                                    <Sparkles size={14} className="text-primary" />
                                                )}
                                                <span className="text-primary fw-semibold">Générer avec l'IA</span>
                                            </button>
                                        </div>
                                        <textarea 
                                            name="contenu"
                                            rows="10"
                                            value={formData.contenu}
                                            onChange={handleChange}
                                            required
                                            placeholder="Rédigez le contenu complet ici..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section Paramètres & Image */}
                        <div className="row g-4">
                            <div className="col-md-7">
                                <div className="form-section h-100">
                                    <div className="form-section-title">
                                        <Settings size={18} className="text-primary" />
                                        Paramètres de Publication
                                    </div>
                                    
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="fw-bold">Statut <span className="text-danger">*</span></label>
                                                <select 
                                                    name="statut"
                                                    value={formData.statut}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="brouillon">Brouillon</option>
                                                    <option value="publiee">Publiée</option>
                                                    <option value="archivee">Archivée</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="fw-bold">Date de publication</label>
                                                <input 
                                                    type="date" 
                                                    name="date_publication"
                                                    value={formData.date_publication}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label className="fw-bold">Image de couverture</label>
                                                <div className={`file-upload-zone ${formData.image || currentImage ? 'has-file' : ''}`}>
                                                    <input 
                                                        type="file" 
                                                        id="news-image-upload"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="file-input-hidden"
                                                    />
                                                    <label htmlFor="news-image-upload" className="file-upload-label">
                                                        <div className="upload-icon-wrapper">
                                                            <Image size={24} />
                                                        </div>
                                                        <div className="upload-text-content">
                                                            <span className="main-text">
                                                                {formData.image ? formData.image.name : (isEditMode ? 'Changer l\'image' : 'Cliquer pour choisir une image')}
                                                            </span>
                                                            <span className="sub-text">Formats: JPG, PNG | Max: 5MB</span>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div className="form-section h-100">
                                    <div className="form-section-title">
                                        <Layout size={18} className="text-primary" />
                                        Aperçu de l'Image
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center bg-light rounded-3" style={{ height: '200px', overflow: 'hidden' }}>
                                        {currentImage ? (
                                            <img 
                                                src={currentImage} 
                                                alt="Aperçu" 
                                                className="img-fluid"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="text-center text-muted">
                                                <Image size={40} className="opacity-25 mb-2" />
                                                <p className="small mb-0">Aucune image sélectionnée</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-footer mt-4">
                            <button 
                                type="button" 
                                className="btn btn-secondary px-4"
                                onClick={() => navigate('/admin/news')}
                            >
                                Annuler
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary px-5"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>{isEditMode ? 'Mettre à jour l\'actualité' : 'Publier l\'actualité'}</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewsForm;
