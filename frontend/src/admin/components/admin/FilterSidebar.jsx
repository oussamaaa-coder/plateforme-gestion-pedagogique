import React from 'react';
import { XCircle, ChevronDown } from 'lucide-react';

const FilterSidebar = ({ 
    show, 
    onClose, 
    onReset, 
    children, 
    title = "Filtre" 
}) => {
    return (
        <div className={`toggle-sidebar ${show ? 'open-filter' : ''}`}>
            <div className="sidebar-layout-filter">
                <div className="sidebar-header">
                    <h5>{title}</h5>
                    <button type="button" className="sidebar-closes" onClick={onClose}>
                        <XCircle size={20} />
                    </button>
                </div>
                <div className="sidebar-body">
                    <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                        <div className="accordion" id="accordionMain1">
                            {children}
                        </div>
                        <div className="filter-buttons">
                            <button 
                                type="button" 
                                className="d-inline-flex align-items-center justify-content-center btn w-100 btn-primary"
                                onClick={onClose}
                            >
                                Appliquer
                            </button>
                            <button 
                                type="button" 
                                className="d-inline-flex align-items-center justify-content-center btn w-100 btn-secondary mt-2"
                                onClick={onReset}
                            >
                                Réinitialiser
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export const FilterItem = ({ title, children, id, defaultOpen = true }) => {
    return (
        <div className="card-post-column">
            <div className="card-posts-list">
                <div className="card-content">
                    <div className="filter-title">
                        <a 
                            href={`#${id}`} 
                            data-bs-toggle="collapse" 
                            aria-expanded={defaultOpen}
                        >
                            {title}
                            <span className="float-end"><ChevronDown size={14} /></span>
                        </a>
                    </div>
                    <div 
                        id={id} 
                        className={`collapse ${defaultOpen ? 'show' : ''}`}
                    >
                        <div className="filter-body">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
