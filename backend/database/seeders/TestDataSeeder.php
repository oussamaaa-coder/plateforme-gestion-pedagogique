<?php

namespace Database\Seeders;

use App\Models\Filiere;
use App\Models\Module;
use App\Models\User;
use App\Models\Groupe;
use App\Models\Note;
use App\Models\Absence;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Pré-calculer le hash du mot de passe pour optimiser les performances (évite 418 hachages bcrypt lents)
        $passwordHash = Hash::make('password');

        // Nettoyage préalable des tables dépendantes pour repartir sur une base propre et éviter les doublons
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Absence::truncate();
        Note::truncate();
        DB::table('formateur_groupe_module')->truncate();
        Groupe::truncate();
        Module::truncate();
        // Supprimer tous les utilisateurs sauf l'administrateur de test
        User::where('role', '!=', UserRole::Admin->value)->delete();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Filières (Standards OFPPT Maroc)
        $filieres = [
            [
                'nom' => 'Développement Digital',
                'description' => 'Le tronc commun en Développement Digital prépare les étudiants aux fondamentaux du développement logiciel et web.',
                'duree' => '2 semestres'
            ],
            [
                'nom' => 'Développement Digital option Applications Mobiles',
                'description' => 'Spécialisez-vous dans la création d\'applications pour smartphones et tablettes.',
                'duree' => '2 semestres'
            ],
            [
                'nom' => 'Développement Web Full Stack',
                'description' => 'Devenez un expert du développement web et logiciel, du design à la mise en production.',
                'duree' => '2 semestres'
            ],
            [
                'nom' => 'Infrastructure Digitale',
                'description' => 'Maîtrisez les réseaux, les systèmes et la sécurité des infrastructures modernes.',
                'duree' => '2 semestres'
            ],
            [
                'nom' => 'Infrastructure Digitale option Cloud Computing',
                'description' => 'Implémenter et administrer un environnement Cloud.',
                'duree' => '2 semestres'
            ],
            [
                'nom' => 'Infrastructure Digitale option Cyber sécurité',
                'description' => 'Appliquer les méthodologies des tests d’intrusions et analyser les attaques.',
                'duree' => '2 semestres'
            ],
            [
                'nom' => 'Infrastructure Digitale option Systèmes et Réseaux',
                'description' => 'Mettre en place et administrer des infrastructures réseaux et systèmes.',
                'duree' => '2 semestres'
            ],
            [
                'nom' => 'Développement d’Applications - Python',
                'description' => 'Apprendre la programmation orientée objet en Python, développement web, mobile, analytique et IoT.',
                'duree' => '865 heures'
            ],
            [
                'nom' => 'Installateur Fibre Optique',
                'description' => 'Maîtriser la pose, le tirage, et le raccordement de la fibre optique.',
                'duree' => '720 heures'
            ],
            [
                'nom' => 'Web Marketer',
                'description' => 'Mettre en place une stratégie marketing sur le web et le mobile, SEO, SEM, affiliation.',
                'duree' => '860 heures'
            ],
            [
                'nom' => 'Certification Microsoft Office Spécialiste en Excel',
                'description' => 'Maîtriser l\'environnement Excel : données, formules, fonctions et macros.',
                'duree' => '60 heures'
            ],
            [
                'nom' => 'Certification Microsoft Office Spécialiste en PowerPoint',
                'description' => 'Créer des diaporamas percutants avec éléments multimédias, transitions et animations.',
                'duree' => '30 heures'
            ],
            [
                'nom' => 'Certification Microsoft Office Specialist en Word',
                'description' => 'Créer, mettre en forme et maintenir des documents professionnels, fusion et publipostage.',
                'duree' => '60 heures'
            ],
        ];

        foreach ($filieres as $f) {
            Filiere::updateOrCreate(['nom' => $f['nom']], $f);
        }

        // Récupération des filières de base pour les tronc communs
        $fDev = Filiere::where('nom', 'Développement Digital')->first();
        $fInfra = Filiere::where('nom', 'Infrastructure Digitale')->first();

        // 2. Modules par Filière
        $modulesParFiliere = [
            'Développement Digital' => [
                ['nom' => 'Développer des sites web statiques', 'coefficient' => 2, 'annee' => 1],
                ['nom' => 'Développer des sites web dynamiques', 'coefficient' => 3, 'annee' => 1],
                ['nom' => 'Manipuler des bases de données', 'coefficient' => 3, 'annee' => 1],
                ['nom' => 'Programmer en JavaScript', 'coefficient' => 4, 'annee' => 1],
            ],
            'Développement Digital option Applications Mobiles' => [
                ['nom' => 'Android', 'coefficient' => 4, 'annee' => 2],
                ['nom' => 'iOS', 'coefficient' => 4, 'annee' => 2],
                ['nom' => 'Multiplateforme', 'coefficient' => 5, 'annee' => 2],
                ['nom' => 'UI/UX Mobile', 'coefficient' => 3, 'annee' => 2],
            ],
            'Développement Web Full Stack' => [
                ['nom' => 'Approche agile', 'coefficient' => 2, 'annee' => 2],
                ['nom' => 'Développement front-end', 'coefficient' => 4, 'annee' => 2],
                ['nom' => 'Développement back-end', 'coefficient' => 5, 'annee' => 2],
                ['nom' => 'Création d’une application Cloud native', 'coefficient' => 4, 'annee' => 2],
            ],
            'Infrastructure Digitale' => [
                ['nom' => 'Réseaux', 'coefficient' => 3, 'annee' => 1],
                ['nom' => 'Systèmes', 'coefficient' => 3, 'annee' => 1],
                ['nom' => 'Sécurité', 'coefficient' => 3, 'annee' => 1],
                ['nom' => 'Cloud Basics', 'coefficient' => 3, 'annee' => 1],
            ],
            'Infrastructure Digitale option Cloud Computing' => [
                ['nom' => 'Architecture Cloud', 'coefficient' => 4, 'annee' => 2],
                ['nom' => 'Cloud Public', 'coefficient' => 5, 'annee' => 2],
                ['nom' => 'Solutions Libres', 'coefficient' => 4, 'annee' => 2],
                ['nom' => 'Sécurité/Gouvernance', 'coefficient' => 3, 'annee' => 2],
            ],
            'Infrastructure Digitale option Cyber sécurité' => [
                ['nom' => 'Fondamentaux', 'coefficient' => 3, 'annee' => 2],
                ['nom' => 'Tests d’intrusions', 'coefficient' => 5, 'annee' => 2],
                ['nom' => 'Analyse et Durcissement', 'coefficient' => 4, 'annee' => 2],
                ['nom' => 'Investigation et Risques', 'coefficient' => 4, 'annee' => 2],
            ],
            'Infrastructure Digitale option Systèmes et Réseaux' => [
                ['nom' => 'Réseaux', 'coefficient' => 4, 'annee' => 2],
                ['nom' => 'Systèmes', 'coefficient' => 4, 'annee' => 2],
                ['nom' => 'SDN et Cloud', 'coefficient' => 4, 'annee' => 2],
                ['nom' => 'Sécurité et Gestion', 'coefficient' => 3, 'annee' => 2],
            ],
            'Développement d’Applications - Python' => [
                ['nom' => 'Programmation', 'coefficient' => 4, 'annee' => 1],
                ['nom' => 'Web & BD', 'coefficient' => 4, 'annee' => 1],
                ['nom' => 'IA, Data & IoT', 'coefficient' => 5, 'annee' => 1],
                ['nom' => 'Graphique, Mobile & ERP', 'coefficient' => 4, 'annee' => 1],
            ],
            'Installateur Fibre Optique' => [
                ['nom' => 'Pose et Tirage', 'coefficient' => 3, 'annee' => 1],
                ['nom' => 'Raccordement', 'coefficient' => 4, 'annee' => 1],
                ['nom' => 'Vérification', 'coefficient' => 3, 'annee' => 1],
                ['nom' => 'Mesures et Securité', 'coefficient' => 4, 'annee' => 1],
            ],
            'Web Marketer' => [
                ['nom' => 'Stratégie', 'coefficient' => 3, 'annee' => 1],
                ['nom' => 'Acquisition', 'coefficient' => 4, 'annee' => 1],
                ['nom' => 'Partenariats', 'coefficient' => 3, 'annee' => 1],
                ['nom' => 'Suivi et Adaptation', 'coefficient' => 4, 'annee' => 1],
            ],
            'Certification Microsoft Office Spécialiste en Excel' => [
                ['nom' => 'Environnement', 'coefficient' => 2, 'annee' => 1],
                ['nom' => 'Données', 'coefficient' => 3, 'annee' => 1],
                ['nom' => 'Présentation', 'coefficient' => 2, 'annee' => 1],
                ['nom' => 'Partage', 'coefficient' => 3, 'annee' => 1],
            ],
            'Certification Microsoft Office Spécialiste en PowerPoint' => [
                ['nom' => 'Conception', 'coefficient' => 2, 'annee' => 1],
                ['nom' => 'Multimédia', 'coefficient' => 3, 'annee' => 1],
                ['nom' => 'Animations', 'coefficient' => 2, 'annee' => 1],
                ['nom' => 'Livraison', 'coefficient' => 3, 'annee' => 1],
            ],
            'Certification Microsoft Office Specialist en Word' => [
                ['nom' => 'Contenu', 'coefficient' => 2, 'annee' => 1],
                ['nom' => 'Relecture', 'coefficient' => 3, 'annee' => 1],
                ['nom' => 'Suivi', 'coefficient' => 3, 'annee' => 1],
            ]
        ];

        $createdModules = [];
        foreach ($modulesParFiliere as $filiereNom => $modules) {
            $filiere = Filiere::where('nom', $filiereNom)->first();
            if ($filiere) {
                foreach ($modules as $m) {
                    $createdModules[] = Module::firstOrCreate(
                        ['nom' => $m['nom'], 'filiere_id' => $filiere->id],
                        array_merge($m, ['filiere_id' => $filiere->id])
                    );
                }
            }
        }

        // 3. Groupes par Filière
        $groupesData = [
            // Développement Digital (Année 1)
            ['nom' => 'DEV101', 'filiere_id' => $fDev->id, 'annee' => 1],
            ['nom' => 'DEV102', 'filiere_id' => $fDev->id, 'annee' => 1],
            
            // Applications Mobiles (Année 2)
            ['nom' => 'MOB201', 'filiere_id' => Filiere::where('nom', 'Développement Digital option Applications Mobiles')->first()->id, 'annee' => 2],
            ['nom' => 'MOB202', 'filiere_id' => Filiere::where('nom', 'Développement Digital option Applications Mobiles')->first()->id, 'annee' => 2],

            // Développement Web Full Stack (Année 2)
            ['nom' => 'WFS201', 'filiere_id' => Filiere::where('nom', 'Développement Web Full Stack')->first()->id, 'annee' => 2],
            ['nom' => 'WFS202', 'filiere_id' => Filiere::where('nom', 'Développement Web Full Stack')->first()->id, 'annee' => 2],

            // Infrastructure Digitale (Année 1)
            ['nom' => 'INF101', 'filiere_id' => $fInfra->id, 'annee' => 1],
            ['nom' => 'INF102', 'filiere_id' => $fInfra->id, 'annee' => 1],

            // Cloud Computing (Année 2)
            ['nom' => 'CLD201', 'filiere_id' => Filiere::where('nom', 'Infrastructure Digitale option Cloud Computing')->first()->id, 'annee' => 2],

            // Cyber sécurité (Année 2)
            ['nom' => 'CYB201', 'filiere_id' => Filiere::where('nom', 'Infrastructure Digitale option Cyber sécurité')->first()->id, 'annee' => 2],

            // Systèmes et Réseaux (Année 2)
            ['nom' => 'SYS201', 'filiere_id' => Filiere::where('nom', 'Infrastructure Digitale option Systèmes et Réseaux')->first()->id, 'annee' => 2],

            // Développement d’Applications - Python (Année 1)
            ['nom' => 'PY101', 'filiere_id' => Filiere::where('nom', 'Développement d’Applications - Python')->first()->id, 'annee' => 1],

            // Installateur Fibre Optique (Année 1)
            ['nom' => 'FO101', 'filiere_id' => Filiere::where('nom', 'Installateur Fibre Optique')->first()->id, 'annee' => 1],

            // Web Marketer (Année 1)
            ['nom' => 'WM101', 'filiere_id' => Filiere::where('nom', 'Web Marketer')->first()->id, 'annee' => 1],

            // Microsoft Office Spécialiste en Excel (Année 1)
            ['nom' => 'EXC101', 'filiere_id' => Filiere::where('nom', 'Certification Microsoft Office Spécialiste en Excel')->first()->id, 'annee' => 1],

            // Microsoft Office Spécialiste en PowerPoint (Année 1)
            ['nom' => 'PPT101', 'filiere_id' => Filiere::where('nom', 'Certification Microsoft Office Spécialiste en PowerPoint')->first()->id, 'annee' => 1],

            // Microsoft Office Specialist en Word (Année 1)
            ['nom' => 'WRD101', 'filiere_id' => Filiere::where('nom', 'Certification Microsoft Office Specialist en Word')->first()->id, 'annee' => 1],
        ];

        $createdGroups = [];
        foreach ($groupesData as $g) {
            $createdGroups[$g['nom']] = Groupe::firstOrCreate(['nom' => $g['nom']], $g);
        }

        // 4. Formateurs (Noms et spécialités typiquement marocains)
        $formateurs = [
            [
                'prenom' => 'Mohammed', 'nom' => 'Alami', 'email' => 'm.alami@nticsyba.ma',
                'specialite' => 'Full Stack Web', 'role' => UserRole::TRAINER->value
            ],
            [
                'prenom' => 'Fatima-Zahra', 'nom' => 'Mansouri', 'email' => 'f.mansouri@nticsyba.ma',
                'specialite' => 'Mobile & UI/UX', 'role' => UserRole::TRAINER->value
            ],
            [
                'prenom' => 'Youssef', 'nom' => 'Benjelloun', 'email' => 'y.benjelloun@nticsyba.ma',
                'specialite' => 'Cloud & DevOps', 'role' => UserRole::TRAINER->value
            ],
            [
                'prenom' => 'Amine', 'nom' => 'Chraibi', 'email' => 'formateur@ista.ma', // Compte de test principal
                'specialite' => 'Réseaux & Sécurité', 'role' => UserRole::TRAINER->value
            ],
            [
                'prenom' => 'Karima', 'nom' => 'El Idrissi', 'email' => 'k.elidrissi@nticsyba.ma',
                'specialite' => 'Python & IA', 'role' => UserRole::TRAINER->value
            ],
            [
                'prenom' => 'Rachid', 'nom' => 'Bensaid', 'email' => 'r.bensaid@nticsyba.ma',
                'specialite' => 'Fibre Optique & Telecom', 'role' => UserRole::TRAINER->value
            ],
            [
                'prenom' => 'Sanaa', 'nom' => 'El Amrani', 'email' => 's.elamrani@nticsyba.ma',
                'specialite' => 'Web Marketing & SEO', 'role' => UserRole::TRAINER->value
            ],
            [
                'prenom' => 'Khalid', 'nom' => 'Tazi', 'email' => 'k.tazi@nticsyba.ma',
                'specialite' => 'Bureautique & Excel', 'role' => UserRole::TRAINER->value
            ],
            [
                'prenom' => 'Nabila', 'nom' => 'Chawki', 'email' => 'n.chawki@nticsyba.ma',
                'specialite' => 'Bureautique & Word', 'role' => UserRole::TRAINER->value
            ],
            [
                'prenom' => 'Tariq', 'nom' => 'Bouazzaoui', 'email' => 't.bouazzaoui@nticsyba.ma',
                'specialite' => 'Cybersécurité & PenTesting', 'role' => UserRole::TRAINER->value
            ],
        ];

        $createdFormateurs = [];
        foreach ($formateurs as $f) {
            $f['name'] = $f['prenom'] . ' ' . $f['nom'];
            $f['password'] = $passwordHash;
            $createdFormateurs[] = User::updateOrCreate(['email' => $f['email']], $f);
        }

        // 5. Assignations (Formateur <-> Groupe <-> Module)
        $assignations = [
            [
                'email' => 'm.alami@nticsyba.ma',
                'groupes' => ['WFS201', 'WFS202'],
                'modules' => ['Développement front-end', 'Développement back-end']
            ],
            [
                'email' => 'f.mansouri@nticsyba.ma',
                'groupes' => ['MOB201', 'MOB202'],
                'modules' => ['Android', 'iOS', 'UI/UX Mobile']
            ],
            [
                'email' => 'y.benjelloun@nticsyba.ma',
                'groupes' => ['CLD201'],
                'modules' => ['Cloud Public', 'Solutions Libres']
            ],
            [
                'email' => 'formateur@ista.ma',
                'groupes' => ['INF101', 'INF102'],
                'modules' => ['Réseaux', 'Systèmes']
            ],
            [
                'email' => 'k.elidrissi@nticsyba.ma',
                'groupes' => ['PY101'],
                'modules' => ['Programmation', 'Web & BD']
            ],
            [
                'email' => 'r.bensaid@nticsyba.ma',
                'groupes' => ['FO101'],
                'modules' => ['Pose et Tirage', 'Raccordement']
            ],
            [
                'email' => 's.elamrani@nticsyba.ma',
                'groupes' => ['WM101'],
                'modules' => ['Stratégie', 'Acquisition']
            ],
            [
                'email' => 'k.tazi@nticsyba.ma',
                'groupes' => ['EXC101'],
                'modules' => ['Environnement', 'Données']
            ],
            [
                'email' => 'n.chawki@nticsyba.ma',
                'groupes' => ['WRD101'],
                'modules' => ['Contenu', 'Relecture']
            ],
            [
                'email' => 't.bouazzaoui@nticsyba.ma',
                'groupes' => ['CYB201'],
                'modules' => ['Tests d’intrusions', 'Analyse et Durcissement']
            ]
        ];

        foreach ($assignations as $assign) {
            $formateur = User::where('email', $assign['email'])->first();
            if ($formateur) {
                foreach ($assign['groupes'] as $gnom) {
                    $groupe = $createdGroups[$gnom] ?? null;
                    if ($groupe) {
                        foreach ($assign['modules'] as $mnom) {
                            $module = Module::where('nom', $mnom)->where('filiere_id', $groupe->filiere_id)->first();
                            if ($module) {
                                DB::table('formateur_groupe_module')->updateOrInsert(
                                    [
                                        'formateur_id' => $formateur->id,
                                        'groupe_id' => $groupe->id,
                                        'module_id' => $module->id
                                    ],
                                    ['created_at' => now(), 'updated_at' => now()]
                                );
                            }
                        }
                    }
                }
            }
        }

        // 6. Étudiants (Génération de 24 étudiants par groupe pour un jeu d'essai complet et réaliste)
        $prenomsGarcons = ['Ahmed', 'Yassine', 'Omar', 'Hamza', 'Anass', 'Saad', 'Walid', 'Reda', 'Nabil', 'Amine', 'Mehdi', 'Youssef', 'Badr', 'Adnane', 'Farouk', 'Taha', 'Karim', 'Sami', 'Adil', 'Rachid', 'Ayoub', 'Zakaria', 'Tariq', 'Oussama'];
        $prenomsFilles = ['Salma', 'Meriem', 'Soukaina', 'Khadija', 'Layla', 'Oumaima', 'Hajar', 'Zineb', 'Yasmine', 'Nada', 'Sara', 'Ghita', 'Nisrine', 'Ikram', 'Chaimae', 'Mariam', 'Fatima', 'Kenza', 'Houda', 'Asmae', 'Safae', 'Kaoutar', 'Manal', 'Rania'];
        $nomsFamille = ['Tazi', 'El Idrissi', 'Chraibi', 'Bennani', 'Mansouri', 'Zahidi', 'Belkhayat', 'Berrada', 'El Amrani', 'Mernissi', 'Filali', 'Semlali', 'Touimi', 'Benjelloun', 'Ouazzani', 'Guerrouj', 'Slaoui', 'Naji', 'Fassi', 'Alaoui', 'Kabbaj', 'Daoudi', 'Tahiri', 'El Khayat', 'Seddiki', 'Jamil', 'Radi', 'Zaki', 'Jabri', 'Habti', 'Rami', 'Sabiri', 'Amraoui', 'Tahri', 'Marzouki', 'El Yousfi', 'Bennis'];

        $createdStudents = [];
        $studentCounter = 1;

        foreach ($createdGroups as $gnom => $groupe) {
            for ($i = 1; $i <= 24; $i++) {
                // Alternance garçon / fille
                $isFille = ($i % 2 === 0);
                $prenom = $isFille ? $prenomsFilles[rand(0, count($prenomsFilles) - 1)] : $prenomsGarcons[rand(0, count($prenomsGarcons) - 1)];
                $nom = $nomsFamille[rand(0, count($nomsFamille) - 1)];

                $email = strtolower($prenom . '.' . $nom) . '.' . $studentCounter . '@student.ma';
                $cin = 'AB' . str_pad($studentCounter, 6, '0', STR_PAD_LEFT);

                $createdStudents[] = User::create([
                    'name' => $prenom . ' ' . $nom,
                    'nom' => $nom,
                    'prenom' => $prenom,
                    'email' => $email,
                    'password' => $passwordHash,
                    'role' => UserRole::STUDENT->value,
                    'filiere_id' => $groupe->filiere_id,
                    'groupe_id' => $groupe->id,
                    'numero_liste' => $i,
                    'date_naissance' => '200' . rand(0,4) . '-0' . rand(1,9) . '-' . rand(10,28),
                    'cin' => $cin,
                    'annee_scolaire' => '2023-2024'
                ]);
                $studentCounter++;
            }
        }

        // 7. Notes & Absences (Simulation de données scolaires riches et complètes)
        $remarquesCC = ['Excellent travail', 'Très bon niveau', 'Bon travail dans l’ensemble', 'Doit poursuivre ses efforts', 'Assez bien'];
        $remarquesEF = ['Examen réussi avec brio', 'Bonne maîtrise des concepts', 'Résultat satisfaisant', 'Doit approfondir ses connaissances', 'Insuffisant, à travailler'];

        foreach ($createdStudents as $student) {
            // Modules associés à la filière de l'étudiant
            $studentModules = Module::where('filiere_id', $student->filiere_id)->get();
            
            foreach ($studentModules as $mod) {
                // Trouver le formateur assigné à ce groupe et ce module, sinon en choisir un par défaut
                $assignation = DB::table('formateur_groupe_module')
                    ->where('groupe_id', $student->groupe_id)
                    ->where('module_id', $mod->id)
                    ->first();
                
                $formateurId = $assignation ? $assignation->formateur_id : User::where('role', UserRole::TRAINER->value)->inRandomOrder()->first()->id;

                // Création d'une note de Contrôle Continu (CC)
                Note::create([
                    'user_id' => $student->id,
                    'module_id' => $mod->id,
                    'type_controle' => 'CC',
                    'note' => rand(11, 19),
                    'coefficient' => 1,
                    'formateur_id' => $formateurId,
                    'remarque' => $remarquesCC[rand(0, 4)]
                ]);

                // Création d'une note d'Examen de Fin de Module (EFM)
                Note::create([
                    'user_id' => $student->id,
                    'module_id' => $mod->id,
                    'type_controle' => 'EFM',
                    'note' => rand(9, 18),
                    'coefficient' => 2,
                    'formateur_id' => $formateurId,
                    'remarque' => $remarquesEF[rand(0, 4)]
                ]);

                // Quelques absences aléatoires pour ce module
                if (rand(0, 10) > 8) {
                    Absence::create([
                        'user_id' => $student->id,
                        'module_id' => $mod->id,
                        'date' => now()->subDays(rand(1, 20)),
                        'nombre_heures' => rand(2, 4),
                        'justifie' => (rand(0, 1) === 1)
                    ]);
                }
            }
        }
    }
}
