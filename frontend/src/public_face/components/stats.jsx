import '../assets/css/Stats.css';

function Stats() {
    const stats = [
        { number: "98%", label: "Taux d'insertion" },
        { number: "1500+", label: "Étudiants" },
        { number: "50+", label: "Formateurs" },
        { number: "25+", label: "Partenaires" }
    ];

    return (
        <section className="stats-section">
            <div className="stats-container">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                        <span className="stat-number">{stat.number}</span>
                        <span className="stat-label">{stat.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Stats;