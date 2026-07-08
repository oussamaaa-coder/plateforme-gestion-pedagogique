import React from 'react';

export default function ContactSidebar() {
    return (
        <aside className="fd-sidebar-right">
            <div className="fd-contact-card">
                <div className="fd-contact-header">
                    <h3>CONTACTEZ-NOUS</h3>
                    <p>Une question ? Nous sommes là pour vous.</p>
                </div>
                <form className="fd-contact-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="fd-form-row">
                        <div className="fd-input-group">
                            <label>Nom</label>
                            <input type="text" placeholder="Nom" />
                        </div>
                        <div className="fd-input-group">
                            <label>Prénom</label>
                            <input type="text" placeholder="Prénom" />
                        </div>
                    </div>
                    <div className="fd-input-group">
                        <label>Email</label>
                        <input type="email" placeholder="exemple@email.com" />
                    </div>
                    <div className="fd-input-group">
                        <label>Téléphone</label>
                        <input type="tel" placeholder="+212 6 00 00 00 00" />
                    </div>
                    <div className="fd-input-group">
                        <label>Sujet</label>
                        <select defaultValue="Information Générale">
                            <option>Information Générale</option>
                            <option>Admission</option>
                            <option>Vie au Campus</option>
                            <option>Autre</option>
                        </select>
                    </div>
                    <div className="fd-input-group">
                        <label>Ville</label>
                        <input type="text" placeholder="Votre ville" />
                    </div>
                    <button type="submit" className="fd-submit-btn">ENVOYER LE MESSAGE</button>
                </form>
            </div>
        </aside>
    );
}
