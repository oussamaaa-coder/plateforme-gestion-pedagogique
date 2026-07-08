import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const VIE_AU_CAMPUS_LINKS = [
    { name: 'BDE & Clubs', path: '/bdeclubs' },
    { name: 'Internat & Restauration', path: '/internat-restauration' },
    { name: 'Galerie Photos', path: '/galerie' }
];

export default function SidebarLeft() {
    const location = useLocation();

    return (
        <aside className="h-sidebar-sticky">
            <div className="h-sidebar-card">
                <h3 className="h-sidebar-title">VIE AU CAMPUS</h3>
                <ul className="h-sidebar-list">
                    {VIE_AU_CAMPUS_LINKS.map((link) => (
                        <li key={link.path} className={`h-sidebar-item ${location.pathname === link.path ? 'active' : ''}`}>
                            <Link to={link.path}>
                                {link.name}
                                {location.pathname === link.path && <span className="h-sidebar-active-arrow">›</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
