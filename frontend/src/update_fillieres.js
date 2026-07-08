const fs = require('fs');

const path = 'c:/APP-PFE/PFE-stage/frontend/src/public_face/data/fillieres.js';
let content = fs.readFileSync(path, 'utf8');

const newFillieres = `
  '5': {
    id: '5',
    slug: 'cloud-computing',
    titre: 'Infrastructure Digitale option Cloud Computing',
    description: "Implémenter et administrer un environnement Cloud.",
    objectifs: "Comprendre l'architecture Cloud, explorer, implémenter, et administrer un environnement Cloud.",
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000',
    modules: [
      { name: 'Architecture Cloud', desc: "Comprendre l'architecture et les concepts", icon: 'cloud' },
      { name: 'Cloud Public', desc: 'Explorer et administrer un cloud propriétaire public', icon: 'systems' },
      { name: 'Solutions Libres', desc: 'Implémenter avec une solution libre', icon: 'devops' },
      { name: 'Sécurité/Gouvernance', desc: 'Sécuriser un environnement, gouverner les données', icon: 'security' }
    ],
    debouches: [
      'Technicien support infrastructure Cloud',
      'Administrateur infrastructure Cloud',
      'Chef de projet',
      'Responsable d’équipe',
      'Directeur technique'
    ],
    conditions: {
      admission: {
        titre: 'Admission en 2ème année',
        details: "L'admission du stagiaire en 2ème année à cette spécialité est tributaire de sa réussite et de son classement en Tronc Commun (Infrastructure Digitale)",
        lien_tronc_commun: '/filiere/4'
      },
      selection: {
        modalites: [
          "L'inscription et la confirmation sont possibles pour les candidats ayant une moyenne au baccalauréat >= 12/20 ainsi que les candidats disposant d'un Baccalauréat Technique ou Professionnel.",
          "Classement: 1. Toutes branches >= 12/20",
          "2. Option Sciences Mathématiques < 12/20",
          "3. Bac technique (dont Bac Pro) < 12/20",
          "4. Autres options < 12/20"
        ]
      },
      profil_sortie: [
        "Comprendre l'architecture Cloud",
        "Explorer un environnement Cloud propriétaire en ligne public",
        "Implémenter un environnement Cloud avec une solution libre",
        "Administrer un environnement Cloud propriétaire en ligne public",
        "Sécuriser un environnement Cloud propriétaire en ligne public",
        "Gouverner les données dans le Cloud",
        "Établir une stratégie de maintien d'un SI dans un Cloud propriétaire en ligne"
      ]
    },
    organisation: [
      "La durée de formation de l'option est étalée sur 2 semestre(s)",
      "Le programme peut être dispensé en mode de formation résidentiel ou alterné"
    ],
    evaluation: [
      "La formation dispensée est modulaire",
      "Contrôles continus",
      "Examens de fin de module",
      "Examen de fin de formation"
    ]
  },
  '6': {
    id: '6',
    slug: 'cyber-securite',
    titre: 'Infrastructure Digitale option Cyber sécurité',
    description: "Appliquer les méthodologies des tests d’intrusions et analyser les attaques.",
    objectifs: "S’initier aux fondamentaux de la cybersécurité, assurer le durcissement de la sécurité des systèmes et réseaux informatiques.",
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
    modules: [
      { name: 'Fondamentaux', desc: 'S’initier aux fondamentaux de la cybersécurité', icon: 'security' },
      { name: 'Tests d’intrusions', desc: 'Appliquer les méthodologies des tests d’intrusions', icon: 'architecture' },
      { name: 'Analyse et Durcissement', desc: 'Analyser les attaques et assurer le durcissement de la sécurité', icon: 'network' },
      { name: 'Investigation et Risques', desc: "Investigation numérique et stratégies de gestion des risques", icon: 'systems' }
    ],
    debouches: [
      'Technicien en cybersécurité',
      'Pentesteur (Détecteur de vulnérabilité)',
      'Évaluateur de la sécurité des technologies de l\\'information',
      'Développeur / Intégrateur de solutions de sécurité',
      'Consultant en support sécurité',
      'Responsable sécurité / InfoSec directeur',
      'Ingénieur / Architecte Cybersécurité'
    ],
    conditions: {
      admission: {
        titre: 'Admission en 2ème année',
        details: "L'admission du stagiaire en 2ème année à cette spécialité est tributaire de sa réussite et de son classement en Tronc Commun (Infrastructure Digitale)",
        lien_tronc_commun: '/filiere/4'
      },
      selection: {
        modalites: [
          "L'inscription et la confirmation sont possibles pour les candidats ayant une moyenne au baccalauréat >= 12/20 ainsi que les candidats disposant d'un Baccalauréat Technique ou Professionnel.",
          "Classement: 1. Toutes branches >= 12/20",
          "2. Option Sciences Mathématiques < 12/20",
          "3. Bac technique (dont Bac Pro) < 12/20",
          "4. Autres options < 12/20"
        ]
      },
      profil_sortie: [
        "S’initier aux fondamentaux de la cybersécurité",
        "Appliquer les méthodologies des tests d’intrusions",
        "Analyser les attaques et les incidents de cybersécurité",
        "Assurer le durcissement de la sécurité des systèmes et réseaux informatiques",
        "Appréhender les méthodes d'investigation numérique",
        "Appliquer des stratégies de gestion des risques"
      ]
    },
    organisation: [
      "La durée de formation de l'option est étalée sur 2 semestre(s)",
      "Le programme peut être dispensé en mode de formation résidentiel ou alterné"
    ],
    evaluation: [
      "La formation dispensée est modulaire",
      "Contrôles continus",
      "Examens de fin de module",
      "Examen de fin de formation"
    ]
  },
  '7': {
    id: '7',
    slug: 'systemes-et-reseaux',
    titre: 'Infrastructure Digitale option Systèmes et Réseaux',
    description: "Mettre en place et administrer des infrastructures réseaux et systèmes.",
    objectifs: "Mettre en place d’une infrastructure réseaux, administrer des environnements Windows, Linux et cloud, sécuriser et gérer l'infrastructure.",
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1000',
    modules: [
      { name: 'Réseaux', desc: 'Mettre en place d’une infrastructure réseaux', icon: 'network' },
      { name: 'Systèmes', desc: 'Administrer un environnement Windows et Linux', icon: 'systems' },
      { name: 'SDN et Cloud', desc: 'Technologie SDN et administration cloud', icon: 'cloud' },
      { name: 'Sécurité et Gestion', desc: 'Sécuriser une infrastructure et gérer un projet', icon: 'security' }
    ],
    debouches: [
      'Administrateur Réseaux et Systèmes',
      'Technicien informatique / support IT',
      'Responsable de parc informatique',
      'Technicien réseau informatique',
      'Chef d\\'équipe technique / de projet',
      'Expert technique / Architecte IT',
      'Directeur technique'
    ],
    conditions: {
      admission: {
        titre: 'Admission en 2ème année',
        details: "L'admission du stagiaire en 2ème année à cette spécialité est tributaire de sa réussite et de son classement en Tronc Commun (Infrastructure Digitale)",
        lien_tronc_commun: '/filiere/4'
      },
      selection: {
        modalites: [
          "L'inscription et la confirmation sont possibles pour les candidats ayant une moyenne au baccalauréat >= 12/20 ainsi que les candidats disposant d'un Baccalauréat Technique ou Professionnel.",
          "Classement: 1. Toutes branches >= 12/20",
          "2. Option Sciences Mathématiques < 12/20",
          "3. Bac technique (dont Bac Pro) < 12/20",
          "4. Autres options < 12/20"
        ]
      },
      profil_sortie: [
        "Mettre en place d’une infrastructure réseaux",
        "Administrer un environnement Windows",
        "Administrer un environnement Linux",
        "Découvrir les enjeux de la technologie SDN",
        "Administrer un environnement cloud",
        "Sécuriser une infrastructure digitale",
        "Gérer un projet d'infrastructure digitale"
      ]
    },
    organisation: [
      "La durée de formation de l'option est étalée sur 2 semestre(s)",
      "Le programme peut être dispensé en mode de formation résidentiel ou alterné"
    ],
    evaluation: [
      "La formation dispensée est modulaire",
      "Contrôles continus",
      "Examens de fin de module",
      "Examen de fin de formation"
    ]
  },
  '8': {
    id: '8',
    slug: 'app-python',
    titre: 'Développement d’Applications - Python',
    description: "Apprendre la programmation orientée objet en Python, développement web, mobile, analytique et IoT.",
    objectifs: "Former des développeurs spécialisés en Python capables de créer des applications complètes, analyser des données et paramétrer des ERP.",
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?auto=format&fit=crop&q=80&w=1000',
    modules: [
      { name: 'Programmation', desc: 'Structurée et Orientée Objet en Python', icon: 'backend' },
      { name: 'Web & BD', desc: "Systèmes d'information, BD, et web en Python", icon: 'database' },
      { name: 'IA, Data & IoT', desc: "Analyse de données, IA, et internet des objets", icon: 'projects' },
      { name: 'Graphique, Mobile & ERP', desc: "Développement graphique/mobile et ERP", icon: 'mobile' }
    ],
    debouches: [
      'Développeur d’applications Python',
      'Evolutions vers intelligence artificielle, data science, robotique'
    ],
    conditions: {
      admission: {
        niveau: [
          'Bac+2 scientifique ou technique'
        ],
        aptitudes: [
          'Esprit d’analyse',
          'Rigueur',
          'Pragmatisme',
          'Disponibilité et autonomie',
          'Patience et passion',
          'Curiosité'
        ]
      },
      selection: {
        modalites: [
          'Remplissage du dossier d’orientation',
          'Présélection sur dossier',
          'Entretien après présélection'
        ]
      },
      profil_sortie: [
        "Programmation structurée en Python",
        "Programmation Orientée Objet en Python",
        "Systèmes d'information et bases de données",
        "Développement web en Python",
        "Initiation à l’analyse de données, l’intelligence artificielle et internet des objets",
        "Développement graphique et mobile en python",
        "Paramétrage et développement spécifique d’un ERP en python"
      ]
    },
    organisation: [
      "La formation est étalée sur 865 heure(s)",
      "Mode résidentiel ou dual"
    ],
    evaluation: [
      "Au cours de la formation, évaluation formative",
      "Examen de fin de module",
      "Certificat de formation qualifiante sur base de réussite à l’examen de fin de formation"
    ]
  },
  '9': {
    id: '9',
    slug: 'fibre-optique',
    titre: 'Installateur Fibre Optique',
    description: "Maîtriser la pose, le tirage, et le raccordement de la fibre optique.",
    objectifs: "Poser et tirer le câble, souder une fibre optique, vérifier les liaisons et tester les performances.",
    image: 'https://images.unsplash.com/photo-1558227691-41ea78d1f631?auto=format&fit=crop&q=80&w=1000',
    modules: [
      { name: 'Pose et Tirage', desc: 'Poser et tirer le câble', icon: 'network' },
      { name: 'Raccordement', desc: "Confectionner les connecteurs et souder une fibre optique", icon: 'systems' },
      { name: 'Vérification', desc: "Vérifier les liaisons et tester les performances", icon: 'architecture' },
      { name: 'Mesures et Sécurité', desc: "Contrôles par photométrie, réflectomètre et règles de sécurité", icon: 'security' }
    ],
    debouches: [
      'Installateur fibre optique',
      'Chef de projet',
      'Chef d’équipe',
      'Responsable backoffice',
      'Responsable d’activité'
    ],
    conditions: {
      admission: {
        niveau: [
          'Etre titulaire du baccalauréat au moins ou équivalent (Scientifiques, Techniques ou Pro)'
        ],
        aptitudes: [
          'Esprit de synthèse',
          'Grosse capacité d’abstraction',
          'Aptitude au travail en équipe',
          'Très bonne communication',
          'Respect des normes de sécurité'
        ]
      },
      selection: {
        modalites: [
          'Remplissage du dossier d’orientation',
          'Entretien après présélection'
        ]
      },
      profil_sortie: [
        "Poser et tirer le câble",
        "Confectionner les connecteurs, les prises terminales optiques",
        "Souder une fibre optique",
        "Raccorder le point d’aboutement, les fibres dans un tiroir optique client",
        "Vérifier les liaisons optiques réalisées",
        "Tester les performances d’une fibre optique",
        "Effectuer les contrôles par photométrie et réflectomètre",
        "Connaître et appliquer l’ensemble des règles de sécurité"
      ]
    },
    organisation: [
      "La formation est étalée sur 720 heure(s)",
      "Mode résidentiel ou dual"
    ],
    evaluation: [
      "Formation modulaire: Contrôles continus / Examens de fin de module",
      "Attestation de réussite en fin de formation"
    ]
  },
  '10': {
    id: '10',
    slug: 'web-marketer',
    titre: 'Web Marketer',
    description: "Mettre en place une stratégie marketing sur le web et le mobile, SEO, SEM, affiliation.",
    objectifs: "Concevoir le site en accord avec la stratégie, déployer la promotion via SEO, SEM, réseaux sociaux et suivre les KPI.",
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    modules: [
      { name: 'Stratégie', desc: 'Mise en place d\\'une stratégie marketing web et mobile', icon: 'projects' },
      { name: 'Acquisition', desc: "SEO, SEM, SMO, affiliation", icon: 'frontend' },
      { name: 'Partenariats', desc: "Publicité, bannières, marketing viral", icon: 'architecture' },
      { name: 'Suivi et Adaptation', desc: "Suivi des ventes, KPI et adaptation stratégique", icon: 'database' }
    ],
    debouches: [
      'Web marketer',
      'Chargé de webmarketing',
      'Traffic manager',
      'Responsable e-marketing'
    ],
    conditions: {
      admission: {
        niveau: [
          "2ème Année du Baccalauréat avec 3 ans d'expériences",
          "OU BAC +2 en économie, commerce, marketing, sciences ou techniques"
        ],
        aptitudes: [
          'Avoir l’esprit d’analyse',
          'Patience, rigueur',
          'Gérer le stress',
          'Bon relationnel, communication',
          'Motivation et curiosité'
        ]
      },
      selection: {
        modalites: [
          'Remplissage du dossier d’orientation',
          'Entretien après présélection'
        ]
      },
      profil_sortie: [
        "La mise en place d'une stratégie marketing sur le web et le mobile",
        "La conception du site en accord avec la stratégie marketing",
        "La mise en place d'une promotion (SEO, SEM, SMO, affiliation)",
        "La mise en place de partenariats, publicité, bannières, marketing viral",
        "L'achat de prestations (mots clés, e-mailing)",
        "Le suivi des chiffres de vente et l'adaptation de la stratégie"
      ]
    },
    organisation: [
      "La formation est étalée sur 860 heure(s)",
      "Mode résidentiel ou dual"
    ],
    evaluation: [
      "Au cours de la formation, évaluation formative",
      "Examen de fin de module",
      "Certificat de formation qualifiante"
    ]
  },
  '11': {
    id: '11',
    slug: 'excel-specialiste',
    titre: 'Certification Microsoft office Spécialiste en Excel',
    description: "Maîtriser l'environnement Excel : données, formules, fonctions et macros.",
    objectifs: "Gérer l'environnement, créer/formater des cellules, appliquer formules/fonctions, graphiques et analyser les données.",
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
    modules: [
      { name: 'Environnement', desc: 'Gérer la feuille de calcul et le classeur', icon: 'frontend' },
      { name: 'Données', desc: "Mise en forme, formules, fonctions, macros", icon: 'database' },
      { name: 'Présentation', desc: "Présenter visuellement les données", icon: 'projects' },
      { name: 'Partage', desc: "Partager et maintenir les classeurs", icon: 'architecture' }
    ],
    debouches: [
      'Certificats Microsoft Office Specialist Excel intermédiaire et Expert',
      'Responsable d’un parc informatique ou entité informatique'
    ],
    conditions: {
      admission: {
        niveau: [
          "Avoir achevé la 2ème année du baccalauréat"
        ],
        aptitudes: [
          'Avoir un esprit d’analyse et de bonnes facultés de raisonnement logiques',
          'Bonne aptitude à la communication',
          'Avoir des capacités d’écoute',
          'Ouverture d’esprit'
        ]
      },
      selection: {
        modalites: [
          'Remplissage du dossier d’orientation',
          'Présélection sur dossier'
        ]
      },
      profil_sortie: [
        "Gérer l'environnement de la feuille de calcul",
        "Créer les données de la cellule",
        "Appliquer la Mise en forme des cellules",
        "Appliquer les formules et fonctions",
        "Présenter visuellement les données",
        "Analyser et organiser les données",
        "Travailler avec les Macros et les formulaires"
      ]
    },
    organisation: [
      "La formation est étalée sur 60 heure(s)",
      "Mode résidentiel ou dual"
    ],
    evaluation: [
      "Le participant obtient seulement le certificat délivré par la plateforme CERTIPORT après la réussite du test. Le certificat de l'OFPPT n'est pas délivré."
    ]
  },
  '12': {
    id: '12',
    slug: 'powerpoint-specialiste',
    titre: 'Certification Microsoft office Spécialiste en PowerPoint',
    description: "Créer des diaporamas percutants avec éléments multimédias, transitions et animations.",
    objectifs: "Gérer PowerPoint, travailler avec des éléments graphiques, appliquer animations et collaborer sur des présentations.",
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000',
    modules: [
      { name: 'Conception', desc: 'Gérer l\\'environnement et créer un diaporama', icon: 'frontend' },
      { name: 'Multimédia', desc: "Travailler avec des éléments graphiques, tableaux et graphiques", icon: 'design' },
      { name: 'Animations', desc: "Appliquer les Transitions et les Animations", icon: 'projects' },
      { name: 'Livraison', desc: "Collaborer et livrer les présentations", icon: 'architecture' }
    ],
    debouches: [
      'Certificat Microsoft Office Specialist Powerpoint',
      'Responsable d’un parc informatique ou entité informatique'
    ],
    conditions: {
      admission: {
        niveau: [
          "Avoir achevé la 2ème année du baccalauréat"
        ],
        aptitudes: [
          'Avoir un esprit d’analyse et de bonnes facultés de raisonnement logiques',
          'Bonne aptitude à la communication',
          'Avoir des capacités d’écoute',
          'Ouverture d’esprit',
          'Avoir une bonne perception visuelle et auditive'
        ]
      },
      selection: {
        modalites: [
          'Remplissage du dossier d’orientation',
          'Présélection sur dossier'
        ]
      },
      profil_sortie: [
        "Gérer l'environnement de PowerPoint",
        "Créer un diaporama",
        "Travailler avec des éléments graphiques et multimédias",
        "Créer des graphiques et des tableaux",
        "Appliquer les Transitions et les Animations",
        "Collaborer sur des présentations",
        "Préparer les présentations pour la livraison",
        "Livrer les présentations"
      ]
    },
    organisation: [
      "La formation est étalée sur 30 heure(s)",
      "Mode résidentiel ou dual"
    ],
    evaluation: [
      "Le participant obtient seulement le certificat délivré par la plateforme CERTIPORT après la réussite du test. Le certificat de l'OFPPT n'est pas délivré."
    ]
  },
  '13': {
    id: '13',
    slug: 'word-specialiste',
    titre: 'Certification Microsoft office Specialist en Word',
    description: "Créer, mettre en forme et maintenir des documents professionnels, fusion et publipostage.",
    objectifs: "Mettre en forme le contenu, appliquer la mise en page, insérer des illustrations, exécuter fusion et publipostage.",
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=1000',
    modules: [
      { name: 'Contenu', desc: 'Mettre en forme, mise en page et illustrations', icon: 'frontend' },
      { name: 'Relecture', desc: "Relecture, références et liens", icon: 'design' },
      { name: 'Suivi', desc: "Suivi des documents, macros et formulaires", icon: 'projects' },
      { name: 'Fusion', desc: "Opérations de fusion et publipostage", icon: 'architecture' }
    ],
    debouches: [
      'Certificats Microsoft Office Specialist Word intermédiaire et Expert',
      'Responsable d’un parc informatique ou entité informatique'
    ],
    conditions: {
      admission: {
        niveau: [
          "Avoir achevé la 2ème année du baccalauréat"
        ],
        aptitudes: [
          'Avoir un esprit d’analyse et de bonnes facultés de raisonnement logiques',
          'Bonne aptitude à la communication',
          'Avoir des capacités d’écoute',
          'Ouverture d’esprit',
          'Avoir une bonne perception visuelle et auditive'
        ]
      },
      selection: {
        modalites: [
          'Remplissage du dossier d’orientation',
          'Présélection sur dossier'
        ]
      },
      profil_sortie: [
        "Partager et conserver les documents",
        "Mettre en forme le contenu",
        "Maintenir les documents",
        "Appliquer la mise en page et contenu réutilisable",
        "Insérer les illustrations et les graphiques",
        "Appliquer la relecture de documents",
        "Appliquer les références et les liens hypertexte",
        "Effectuer le suivi et le référencement des documents",
        "Exécuter les opérations de fusion et publipostage",
        "Gérer les macros et formulaires"
      ]
    },
    organisation: [
      "La formation est étalée sur 60 heure(s)",
      "Mode résidentiel ou dual"
    ],
    evaluation: [
      "Le participant obtient seulement le certificat délivré par la plateforme CERTIPORT après la réussite du test. Le certificat de l'OFPPT n'est pas délivré."
    ]
  }
};
`;

content = content.replace('};', ',' + newFillieres);
fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
