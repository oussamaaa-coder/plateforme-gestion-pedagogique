import cloudImg from '../assets/images/filieres/couloud_computing.jpg';
import cyberImg from '../assets/images/filieres/cyberSecurityjpg.jpg';
import pythonImg from '../assets/images/filieres/devPython.jpg';
import fibreImg from '../assets/images/filieres/fibreOptique.jpg';
import infraImg from '../assets/images/filieres/infrastructure.jpg';
import sysReseauxImg from '../assets/images/filieres/systemeResaux.jpg';
import webmarketImg from '../assets/images/filieres/webmarketer.jpg';
import excelImg from '../assets/images/filieres/exel.jpg';
import pptImg from '../assets/images/filieres/powerpoint.jpg';
import wordImg from '../assets/images/filieres/word.jpg';

export const FILLIERES_DETAILS = {
  '1': {
    id: '1',
    slug: 'dev-digital',
    titre: 'Développement Digital',
    description: 'Le tronc commun en Développement Digital prépare les étudiants aux fondamentaux du développement logiciel et web.',
    objectifs: 'Le  Développement Digital forme des développeurs polyvalents capables de concevoir et réaliser des applications web et mobiles, du front-end au back-end. Vous maîtezerez le cycle de vie complet du logiciel.',
    modules: [
      { name: 'Développer des sites web statique', desc: 'HTML5, CSS3, Bootstrap', icon: 'frontend' },
      { name: 'Développer des sites web dynamique', desc: 'PHP, Python', icon: 'backend' },
      { name: 'Manipuler des bases de données', desc: 'MySQL', icon: 'database' },
      { name: '	Programmer en JavaScript', desc: 'js', icon: 'projects' }
    ],
    debouches: [
      'Développeur Full Stack',
      'Développeur Front-end / Back-end',
      'Intégrateur Web',
      'Administrateur de Bases de Données',
      'Freelance / Entrepreneur'
    ],
    conditions: {
      admission: {
        age: [
          'Avoir au plus 30 ans au 1er Septembre de l\'année en cours',
          'Avoir au plus 33 ans au 1er Septembre de l\'année en cours pour les bénéficiaires du Système des Passerelles.'
        ],
        niveau: [
          'Etre titulaire du baccalauréat au moins ou équivalent',
          'Ou avoir un diplôme de niveau Technicien, selon le tableau de correspondance de l\'année en cours'
        ],
        branches: ['Science', 'Techniques scientifiques'],
        aptitudes: [
          'Sens des responsabilités',
          'De l’organisation et de la discipline',
          'Capacités d’analyse et de synthèse',
          'Sens du service',
          'Esprit d’initiative',
          'Curiosité pour les nouvelles technologies de l’information'
        ]
      },
      selection: {
        modalites: [
          'L\'inscription et la confirmation sont possibles pour les candidats ayant une moyenne au baccalauréat >= 12/20 ainsi que les candidats disposant d\'un Baccalauréat Technique ou Professionnel.',
          'Le classement se fait selon la moyenne du baccalauréat par classes : ',
          '1. Toutes branches avec moyenne >= 12/20',
          '2. Option Sciences Mathématiques avec moyenne < 12/20',
          '3. Baccalauréat technique (dont Bac Pro) avec moyenne < 12/20',
          '4. Autres options avec moyenne < 12/20'
        ],
        profils: [
          { label: 'Baccalauréat Physiques', value: 40, color: '#00b894' },
          { label: 'Baccalauréat Techniques', value: 28, color: '#0984e3' },
          { label: 'Baccalauréat Économiques', value: 16, color: '#e84393' },
          { label: 'Baccalauréat SVT', value: 11, color: '#6c5ce7' },
          { label: 'Baccalauréat SM', value: 5, color: '#f1c40f' }
        ]
      }
    },
    organisation: [
      'La durée de formation du tronc commun est étalée sur 2 semestre(s)',
      'Le programme peut être dispensé en mode de formation résidentiel ou alterné'
    ],
    evaluation: [
      'La formation dispensée est modulaire',
      'Contrôles continus',
      'Examens de fin de module'
    ],
    options_2eme_annee: [
      { name: 'Applications Mobiles', desc: 'Le développeur Mobile effectue la réalisation et le développement d’une application Mobile ou site Web, en créant des algorithmes qui répondent à...', link: '/filiere/2' },
      { name: 'Applications RV/RA', desc: 'Le Technicien Spécialisé en développement RV/RA développe des solutions innovantes, de nouvelles fonctionnalités dans l’environnement 3D...', link: '#' },
      { name: 'Web Full Stack', desc: 'Un technicien spécialisé en Développement digital option Full Stack est un professionnel capable de réaliser des tâches à n\'importe quel niveau technique...', link: '/filiere/3' }
    ]
  },
  '3': {
    id: '3',
    slug: 'web-full-stack',
    titre: 'Développement Web Full Stack',
    description: 'Devenez un expert du développement web et logiciel, du design à la mise en production.',
    objectifs: 'Le Développement Web Full Stack forme des développeurs polyvalents capables de concevoir et réaliser des applications web, du front-end au back-end.',
    modules: [
      { name: 'Approche agile', desc: 'Agile/Scrum, Git/GitHub, CI/CD', icon: 'architecture' },
      { name: '	Développement front-end', desc: 'React.js', icon: 'frameworks' },
      { name: 'Développement back-end', desc: 'Node.js, laravel', icon: 'devops' },
      { name: '	Création d’une application Cloud native', desc: 'Docker, Kubernetes, AWS/Azure', icon: 'mobile' }
    ],
    debouches: [
      'Expert technique : Concepteur-Réalisateur, Architecte logiciel, …',
      'Expert métier : Analyste, Responsable d’application,…',
      'Encadrement : Chef de projet',
      'Travail en free-lance ou comme consultant (dev front et back)'
    ],
    conditions: {
      admission: {
        titre: 'Admission en 2ème année',
        details: 'L\'admission du stagiaire en 2ème année à cette spécialité est tributaire de sa réussite et de son classement en Tronc Commun (Développement Digital).',
        lien_tronc_commun: '/filiere/1'
      },
      selection: {
        modalites: [
          'L\'inscription et la confirmation sont possibles pour les candidats ayant une moyenne au baccalauréat >= 12/20 ainsi que les candidats disposant d\'un Baccalauréat Technique ou Professionnel.',
          'Le classement se fait selon la moyenne du baccalauréat par classes : ',
          '1. Toutes branches avec moyenne >= 12/20',
          '2. Option Sciences Mathématiques avec moyenne < 12/20',
          '3. Baccalauréat technique (dont Bac Pro) avec moyenne < 12/20',
          '4. Autres options avec moyenne < 12/20'
        ]
      },
      profil_sortie: [
        'Préparer un projet web',
        'Adopter l’approche agile',
        'Gérer les données',
        'Développer en front-end',
        'Développer en back-end',
        'Créer une application Cloud native'
      ]
    },
    organisation: [
      'La durée de formation de l\'option est étalée sur 2 semestre(s)',
      'Le programme peut être dispensé en mode de formation résidentiel ou alterné'
    ],
    evaluation: [
      'La formation dispensée est modulaire',
      'Contrôles continus',
      'Examens de fin de module',
      'Examen de fin de formation'
    ]
  },
  '2': {
    id: '2',
    slug: 'applications-mobiles',
    titre: 'Développement Digital option Applications Mobiles',
    description: 'Spécialisez-vous dans la création d\'applications pour smartphones et tablettes.',
    objectifs: 'Le développeur Mobile effectue la réalisation et le développement d’une application Mobile ou site Web, en créant des algorithmes qui répondent aux besoins...',
    modules: [
      { name: 'Android', desc: 'Kotlin, Jetpack Compose, Android SDK', icon: 'android' },
      { name: 'iOS', desc: 'Swift, SwiftUI', icon: 'ios' },
      { name: 'Multiplateforme', desc: 'React Native, Flutter', icon: 'crossplatform' },
      { name: 'UI/UX Mobile', desc: 'Figma, Mobile Design Patterns', icon: 'design' }
    ],
    debouches: [
      'Analyste d\'applications',
      'Analyste d\'études',
      'Analyste programmeur',
      'Chargé(e) d\'études informatiques',
      'Développeur d\'applications informatiques',
      'Développeur d’applications mobiles',
      'Technicien développement – exploitation',
      'Développeur Web Responsive',
      'Informaticien d\'études',
      'Programmeur d\'applications',
      'Responsable des services applicatifs',
      'Technicien d\'études informatiques'
    ],
    conditions: {
      admission: {
        titre: 'Admission en 2ème année',
        details: 'L\'admission du stagiaire en 2ème année à cette spécialité est tributaire de sa réussite et de son classement en Tronc Commun (Développement Digital).',
        lien_tronc_commun: '/filiere/1'
      },
      selection: {
        modalites: [
          'L\'inscription et la confirmation sont possibles pour les candidats ayant une moyenne au baccalauréat >= 12/20 ainsi que les candidats disposant d\'un Baccalauréat Technique ou Professionnel.',
          'Le classement se fait selon la moyenne du baccalauréat par classes : ',
          '1. Toutes branches avec moyenne >= 12/20',
          '2. Option Sciences Mathématiques avec moyenne < 12/20',
          '3. Baccalauréat technique (dont Bac Pro) avec moyenne < 12/20',
          '4. Autres options avec moyenne < 12/20'
        ]
      },
      profil_sortie: [
        'Acquérir les bases de développement Android',
        'Programmer en KOTLIN',
        'Découvrir la gestion de projet',
        'S’initier aux composants et modèle d’une application Android',
        'Développer des interfaces utilisateurs sous Android',
        'Elaborer une application Android sécurisée',
        'Découvrir les bases de développement des applications IOS',
        'Découvrir les bases de développement multiplateforme'
      ]
    },
    organisation: [
      'La durée de formation de l\'option est étalée sur 2 semestre(s)',
      'Le programme peut être dispensé en mode de formation résidentiel ou alterné'
    ],
    evaluation: [
      'La formation dispensée est modulaire',
      'Contrôles continus',
      'Examens de fin de module',
      'Examen de fin de formation'
    ]
  },
  '4': {
    id: '4',
    slug: 'infrastructure-digitale',
    titre: 'Infrastructure Digitale',
    description: 'Maîtrisez les réseaux, les systèmes et la sécurité des infrastructures modernes.',
    objectifs: 'Le tronc commun Infrastructure Digitale forme des techniciens capables de gérer des infrastructures informatiques complexes.',
    modules: [
      { name: 'Réseaux', desc: 'Cisco, Protocoles IP, Switching/Routing', icon: 'network' },
      { name: 'Systèmes', desc: 'Windows Server, Linux (Debian/CentOS)', icon: 'systems' },
      { name: 'Sécurité', desc: 'Firewalls, VPN, Audit de sécurité', icon: 'security' },
      { name: 'Cloud Basics', desc: 'Virtualisation, Introduction au Cloud', icon: 'cloud' }
    ],
    debouches: [
      'Technicien Systèmes et Réseaux',
      'Administrateur Infrastructure',
      'Support Technique Niveau 2',
      'Technicien de Maintenance Informatique'
    ],
    conditions: {
      admission: {
        age: [
          'Avoir au plus 30 ans au 1er Septembre de l\'année en cours',
          'Avoir au plus 33 ans au 1er Septembre pour les bénéficiaires du Système des Passerelles'
        ],
        niveau: [
          'Etre titulaire du baccalauréat au moins ou équivalent',
          'Ou avoir un diplôme de niveau Technicien, selon le tableau de correspondance de l\'année en cours'
        ],
        branches: ['Science', 'Techniques scientifique', 'Bac pro Maintenance Informatique et Réseaux'],
        aptitudes: [
          'Sens des responsabilités',
          'De l’organisation et de la discipline',
          'Capacités d’analyse et de synthèse',
          'Sens du service',
          'Esprit d’initiative',
          'Curiosité pour les nouvelles technologies de l’information'
        ],
        autres: ['Etude de dossier']
      },
      selection: {
        modalites: [
          'L\'inscription et la confirmation sont possibles pour les candidats ayant une moyenne au baccalauréat >= 12/20 ainsi que les candidats disposant d\'un Baccalauréat Technique ou Professionnel.',
          'Le classement se fait selon la moyenne du baccalauréat par classes : ',
          '1. Toutes branches avec moyenne >= 12/20',
          '2. Option Sciences Mathématiques avec moyenne < 12/20',
          '3. Baccalauréat technique (dont Bac Pro) avec moyenne < 12/20',
          '4. Autres options avec moyenne < 12/20'
        ]
      }
    },
    organisation: [
      'La durée de formation du tronc commun est étalée sur 2 semestre(s)',
      'Le programme peut être dispensé en mode de formation résidentiel ou alterné'
    ],
    evaluation: [
      'La formation dispensée est modulaire',
      'Contrôles continus',
      'Examens de fin de module'
    ],
    options_2eme_annee: [
      { name: 'Cloud Computing', desc: 'Après avoir participé à l’analyse des projets clients avec les chefs de projets, le technicien spécialisé en Cloud Computing assiste et répond aux besoins clients...', link: '/filiere/5' },
      { name: 'Cyber sécurité', desc: 'Le Technicien en cybersécurité analyse la vulnérabilité du système et les risques liés à la sécurité des données pour mettre en place un processus de protection...', link: '/filiere/6' },
      { name: 'IOT (Internet of Things)', desc: 'Le Technicien Spécialisé en Infrastructure digitale Option : IoT intervient sur les différentes étapes de conception, de réalisation, de supervision et...', link: '#' },
      { name: 'Systèmes et Réseaux', desc: 'Après avoir participé à l’analyse des projets clients avec les chefs de projets, le technicien spécialisé en Systèmes et Réseaux assiste et répond aux besoins...', link: '/filiere/7' }
    ]
  }
,
  '5': {
    id: '5',
    slug: 'cloud-computing',
    titre: 'Infrastructure Digitale option Cloud Computing',
    description: "Implémenter et administrer un environnement Cloud.",
    objectifs: "Comprendre l'architecture Cloud, explorer, implémenter, et administrer un environnement Cloud.",
    image: cloudImg,
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
    image: cyberImg,
    modules: [
      { name: 'Fondamentaux', desc: 'S’initier aux fondamentaux de la cybersécurité', icon: 'security' },
      { name: 'Tests d’intrusions', desc: 'Appliquer les méthodologies des tests d’intrusions', icon: 'architecture' },
      { name: 'Analyse et Durcissement', desc: 'Analyser les attaques et assurer le durcissement de la sécurité', icon: 'network' },
      { name: 'Investigation et Risques', desc: "Investigation numérique et stratégies de gestion des risques", icon: 'systems' }
    ],
    debouches: [
      'Technicien en cybersécurité',
      'Pentesteur (Détecteur de vulnérabilité)',
      'Évaluateur de la sécurité des technologies de l\'information',
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
    image: sysReseauxImg,
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
      'Chef d\'équipe technique / de projet',
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
    image: pythonImg,
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
    image: fibreImg,
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
    image: webmarketImg,
    modules: [
      { name: 'Stratégie', desc: 'Mise en place d\'une stratégie marketing web et mobile', icon: 'projects' },
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
    image: excelImg,
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
    image: pptImg,
    modules: [
      { name: 'Conception', desc: 'Gérer l\'environnement et créer un diaporama', icon: 'frontend' },
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
    image: wordImg,
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

