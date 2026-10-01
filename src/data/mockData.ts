import { MasterProfile, User, CVDocument, JobOffer } from '../types';

export const INITIAL_USER: User = {
  id: 'usr_dev_01',
  email: 'lucas.martin@polytechnique.fr',
  name: 'Lucas Martin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  role: 'Étudiant Ingénieur Conception & R&D',
  createdAt: new Date().toISOString(),
};

export const INITIAL_MASTER_PROFILE: MasterProfile = {
  id: 'mp_lucas_01',
  userId: 'usr_dev_01',
  firstName: 'Lucas',
  lastName: 'Martin',
  targetTitle: 'Élève Ingénieur en Conception Mécanique & Systèmes Innovants',
  email: 'lucas.martin@polytechnique.fr',
  phone: '+33 6 42 18 90 23',
  location: 'Paris & Île-de-France (Mobile France)',
  linkedinUrl: 'linkedin.com/in/lucas-martin-ingenieur',
  githubUrl: 'github.com/lucas-martin-cad',
  portfolioUrl: 'lucasmartin-portfolio.fr',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  defaultSummary: 'Étudiant ingénieur passionné par la modélisation 3D, le prototypage rapide et l’innovation mécanique. 3 ans de pratique assidue de la CAO sous Autodesk Fusion 360 et SolidWorks. Rigoureux, autonome et orienté solutions concrètes pour l’industrie.',
  skills: [
    {
      id: 'sk_fusion360',
      name: 'Fusion 360',
      category: 'Modélisation & CAO',
      level: 'Expert',
      aliases: ['Autodesk Fusion 360', 'Fusion360', 'CAO', 'Modélisation 3D', 'Autodesk'],
      yearsOfExperience: 3,
    },
    {
      id: 'sk_solidworks',
      name: 'SolidWorks',
      category: 'Modélisation & CAO',
      level: 'Avancé',
      aliases: ['Dassault SolidWorks', 'Mise en plan', 'Assemblages complexes'],
      yearsOfExperience: 2,
    },
    {
      id: 'sk_3dprinting',
      name: 'Impression 3D & Prototypage',
      category: 'Technique / Outils',
      level: 'Expert',
      aliases: ['FDM', 'SLA', 'Usinage CNC', 'Fabrication additive'],
      yearsOfExperience: 3,
    },
    {
      id: 'sk_fem',
      name: 'Simulation Éléments Finis (FEA / MEF)',
      category: 'Modélisation & CAO',
      level: 'Intermédiaire',
      aliases: ['Analyse de contraintes', 'Ansys', 'Simulation thermique'],
      yearsOfExperience: 2,
    },
    {
      id: 'sk_python',
      name: 'Python & Scripting Scientifique',
      category: 'Langages & Tech',
      level: 'Avancé',
      aliases: ['NumPy', 'SciPy', 'Automatisation calculs'],
      yearsOfExperience: 2,
    },
    {
      id: 'sk_matlab',
      name: 'MATLAB / Simulink',
      category: 'Langages & Tech',
      level: 'Intermédiaire',
      aliases: ['Modélisation dynamique', 'Simulink'],
      yearsOfExperience: 2,
    },
    {
      id: 'sk_agile',
      name: 'Gestion de projet Agile & Scrum',
      category: 'Méthodologie',
      level: 'Intermédiaire',
      aliases: ['Kanban', 'Jira', 'Trello', 'Cycle en V'],
      yearsOfExperience: 1,
    },
    {
      id: 'sk_teamwork',
      name: 'Esprit d\'équipe & Communication technique',
      category: 'Soft Skills',
      level: 'Avancé',
      aliases: ['Collaboration', 'Restitution client', 'Présentation'],
      yearsOfExperience: 3,
    },
    {
      id: 'sk_autonomy',
      name: 'Rigueur & Autonomie de conception',
      category: 'Soft Skills',
      level: 'Expert',
      aliases: ['Organisation', 'Précision', 'Dépannage'],
      yearsOfExperience: 3,
    },
    {
      id: 'sk_english',
      name: 'Anglais Professionnel (C1 - 945 TOEIC)',
      category: 'Langues',
      level: 'Avancé',
      aliases: ['English', 'Technical English', 'TOEIC'],
      yearsOfExperience: 5,
    }
  ],
  experiences: [
    {
      id: 'exp_01',
      title: 'Stagiaire Assistant Ingénieur CAO & Prototypage',
      company: 'Novatech Robotics',
      location: 'Lyon (69)',
      startDate: '2025-06',
      endDate: '2025-09',
      current: false,
      description: 'Conception et optimisation de sous-ensembles mécaniques pour un robot mobile autonome.',
      bullets: [
        'Modélisation surfacique et volumique sous Fusion 360 de 12 pièces articulées avec tolérancement ISO.',
        'Réalisation des prototypes fonctionnels par impression 3D FDM et tests de résistance mécanique.',
        'Réduction de 22% du poids global du châssis grâce à une optimisation topologique générative.'
      ],
      skillsUsed: ['Fusion 360', 'Impression 3D & Prototypage', 'SolidWorks']
    },
    {
      id: 'exp_02',
      title: 'Chef de Projet Mécanique - Challenge Éco-Marathon',
      company: 'Association PolyTech Racing',
      location: 'Palaiseau (91)',
      startDate: '2024-09',
      endDate: '2025-05',
      current: false,
      description: 'Pilotage d\'une équipe de 6 étudiants pour concevoir un véhicule ultra-léger éco-performant.',
      bullets: [
        'Supervision de l\'ensemble des fichiers CAO Fusion 360 partagés sur Autodesk Cloud Hub.',
        'Simulation des contraintes aérodynamiques et choix des matériaux composites.',
        'Gestion du planning, des commandes d\'usinage CNC et validation des jalons techniques.'
      ],
      skillsUsed: ['Fusion 360', 'Gestion de projet Agile & Scrum', 'Simulation Éléments Finis']
    }
  ],
  education: [
    {
      id: 'edu_01',
      degree: 'Diplôme d\'Ingénieur Généraliste (Spécialité Génie Mécanique)',
      field: 'Ingénierie & Conception Assistée par Ordinateur',
      school: 'École Nationale Supérieure d\'Ingénieurs (ENSI)',
      location: 'Paris, France',
      startDate: '2023-09',
      endDate: '2026-06',
      current: true,
      details: 'Majeure : Conception Mécatronique, Modélisation 3D avancée, Matériaux et Fabrication Additive.'
    },
    {
      id: 'edu_02',
      degree: 'Classe Préparatoire aux Grandes Écoles (CPGE PTSI / PT*)',
      field: 'Physique, Technologie et Sciences de l\'Ingénieur',
      school: 'Lycée Jean-Baptiste Say',
      location: 'Paris',
      startDate: '2021-09',
      endDate: '2023-06',
      current: false,
      details: 'Formation approfondie en cinématique, résistance des matériaux (RDM) et dessin technique.'
    }
  ],
  projects: [
    {
      id: 'proj_01',
      title: 'Bras Robotique 4 Axes en Open-Source',
      subtitle: 'Conception paramétrique intégrale sous Fusion 360',
      description: 'Développement complet d’un bras manipulateur motorisé par servomoteurs, intégrant calcul de couple et export direct pour fabrication additive.',
      technologies: ['Fusion 360', 'Python', 'Impression 3D', 'Arduino']
    },
    {
      id: 'proj_02',
      title: 'Banc d\'Essai Dynamique de Résistance',
      subtitle: 'Projet industriel d\'école',
      description: 'Conception du bâti mécano-soudé, choix de la chaîne de mesure et automatisation de l\'acquisition de données sous Python.',
      technologies: ['SolidWorks', 'Python', 'Simulation FEA']
    }
  ],
  languages: [
    { id: 'lang_01', language: 'Français', proficiency: 'Langue maternelle' },
    { id: 'lang_02', language: 'Anglais', proficiency: 'Courant / C1' },
    { id: 'lang_03', language: 'Allemand', proficiency: 'Notions / A2' }
  ],
  certifications: [
    { id: 'cert_01', name: 'Autodesk Certified Professional: Revit & Fusion 360 for Design', issuer: 'Autodesk', date: '2024' },
    { id: 'cert_02', name: 'TOEIC Listening & Reading - 945/990', issuer: 'ETS Global', date: '2024' }
  ],
  updatedAt: new Date().toISOString()
};

export const SAMPLE_JOB_OFFERS: JobOffer[] = [
  {
    id: 'job_01',
    userId: 'usr_dev_01',
    title: 'Stage Ingénieur R&D - Conception & Modélisation CAO Fusion 360',
    company: 'AeroSphere Dynamics',
    createdAt: new Date().toISOString(),
    parsedDetails: {
      rawText: `Offre de Stage : Ingénieur R&D Conception Mécanique & Prototypage (H/F)
Entreprise : AeroSphere Dynamics
Lieu : Toulouse / Hybride
Durée : 6 mois (PFE ou césure)
Contact Recruteur : Sophie Valin - Responsable Pôle Prototypage

À propos du poste :
Au sein de notre laboratoire de drones légers, vous participerez activement à la conception et à la validation des futurs mécanismes embarqués.

Missions principales :
- Modélisation 3D avancée sous Autodesk Fusion 360 de boîtiers aérodynamiques et pièces en mouvement.
- Réalisation quotidienne de prototypes par impression 3D FDM et résine pour validation rapide.
- Analyse des contraintes mécaniques sous Fusion 360 / FEA pour minimiser la masse.
- Participation aux réunions de design review avec l'équipe pluridisciplinaire en méthode agile.

Profil recherché :
- Étudiant en école d'ingénieur ou master mécanique / mécatronique.
- Maîtrise impérative d'Autodesk Fusion 360 (surfacique, assemblages et mise en plan).
- Expérience concrète en impression 3D et prototypage rapide.
- Bonne autonomie, curiosité technique et goût pour le travail en équipe.
- Anglais technique requis.`,
      jobTitle: 'Stage Ingénieur R&D Conception Mécanique & Prototypage',
      companyName: 'AeroSphere Dynamics',
      contractType: 'Stage',
      duration: '6 mois (PFE ou césure)',
      location: 'Toulouse / Hybride',
      recruiterName: 'Sophie Valin',
      department: 'Laboratoire Prototypage & Drones',
      missions: [
        'Modélisation 3D avancée sous Autodesk Fusion 360 de boîtiers et mécanismes.',
        'Réalisation quotidienne de prototypes fonctionnels par impression 3D.',
        'Analyse des contraintes mécaniques (FEA) pour optimisation de masse.',
        'Participation active aux design reviews en méthode agile.'
      ],
      requiredSkills: [
        { keyword: 'Fusion 360', frequency: 5, importance: 'critical', category: 'Modélisation & CAO', matchedMasterSkillId: 'sk_fusion360' },
        { keyword: 'Impression 3D', frequency: 3, importance: 'critical', category: 'Technique / Outils', matchedMasterSkillId: 'sk_3dprinting' },
        { keyword: 'FEA / Simulation', frequency: 2, importance: 'high', category: 'Modélisation & CAO', matchedMasterSkillId: 'sk_fem' },
        { keyword: 'Méthode Agile', frequency: 1, importance: 'normal', category: 'Méthodologie', matchedMasterSkillId: 'sk_agile' },
        { keyword: 'Anglais technique', frequency: 1, importance: 'normal', category: 'Langues', matchedMasterSkillId: 'sk_english' }
      ],
      detectedKeywords: ['Fusion 360', 'Impression 3D', 'CAO', 'Prototypage', 'Drones', 'FEA', 'Autodesk', 'Agile'],
      toneOrKeywordsSummary: 'Forte dominante CAO Fusion 360 et fabrication additive pour l\'aéronautique légère.'
    }
  }
];

export const INITIAL_CV_DOCUMENTS: CVDocument[] = [
  {
    id: 'cv_doc_aerosphere_01',
    userId: 'usr_dev_01',
    jobOfferId: 'job_01',
    jobTitleTarget: 'Stage Ingénieur R&D Conception & Modélisation CAO Fusion 360',
    companyTarget: 'AeroSphere Dynamics',
    activeVariantId: 'var_a',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['Aéronautique', 'Stage 6M', 'Fusion 360 Priority'],
    variants: [
      {
        id: 'var_a',
        label: 'Variante A : Focus Modélisation CAO & Prototypage',
        description: 'Met en avant Fusion 360 en tête absolue, mise en page 2 colonnes dynamique, bleu aéro.',
        matchScore: 96,
        updatedAt: new Date().toISOString(),
        layout: {
          templateId: 'modern-accent',
          columns: 2,
          sidebarPosition: 'left',
          sidebarWidthPercentage: 35,
          showPhoto: true,
          photoStyle: 'circle',
          density: 'normal',
          fontFamily: 'Inter',
          fontSizeBase: 10,
          primaryColor: '#2563eb', // Bleu Aero
          secondaryColor: '#1e293b',
          accentColor: '#10b981',
          backgroundColor: '#ffffff',
          sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'languages']
        },
        visibility: {
          summary: true,
          skills: true,
          experience: true,
          education: true,
          projects: true,
          languages: true,
          certifications: true
        },
        content: {
          customTitle: 'Élève Ingénieur R&D • Spécialiste CAO Fusion 360 & Prototypage',
          customSummary: 'Futur ingénieur en conception mécanique avec 3 ans de pratique experte d\'Autodesk Fusion 360. Spécialisé dans la modélisation de mécanismes complexes et le prototypage rapide (impression 3D FDM/SLA). Passionné par les drones et l\'aéronautique, immédiatement opérationnel pour rejoindre AeroSphere Dynamics sur un stage de 6 mois.',
          skills: [
            {
              ...INITIAL_MASTER_PROFILE.skills[0], // Fusion 360
              isTopMatch: true,
              isOfferKeyword: true,
              relevanceScore: 0.99,
              customNote: 'Cité 5 fois dans l\'offre • Maîtrise surfacique & paramétrique'
            },
            {
              ...INITIAL_MASTER_PROFILE.skills[2], // Impression 3D
              isTopMatch: true,
              isOfferKeyword: true,
              relevanceScore: 0.95,
              customNote: 'Fabrication additive FDM & SLA validée en stage'
            },
            {
              ...INITIAL_MASTER_PROFILE.skills[3], // FEA
              isTopMatch: false,
              isOfferKeyword: true,
              relevanceScore: 0.88,
              customNote: 'Optimisation de masse et résistance mécanique'
            },
            {
              ...INITIAL_MASTER_PROFILE.skills[1], // SolidWorks
              isTopMatch: false,
              isOfferKeyword: false,
              relevanceScore: 0.75
            },
            {
              ...INITIAL_MASTER_PROFILE.skills[4], // Python
              isTopMatch: false,
              isOfferKeyword: false,
              relevanceScore: 0.70
            },
            {
              ...INITIAL_MASTER_PROFILE.skills[6], // Agile
              isTopMatch: false,
              isOfferKeyword: true,
              relevanceScore: 0.80
            }
          ],
          experiences: INITIAL_MASTER_PROFILE.experiences,
          education: INITIAL_MASTER_PROFILE.education,
          projects: INITIAL_MASTER_PROFILE.projects,
          languages: INITIAL_MASTER_PROFILE.languages,
          certifications: INITIAL_MASTER_PROFILE.certifications
        }
      },
      {
        id: 'var_b',
        label: 'Variante B : Focus Vision Globale & Ingénierie Systèmes',
        description: 'Style 1 colonne épuré Executive, teintes ardoise/vert émeraude, focus projets et responsabilités.',
        matchScore: 89,
        updatedAt: new Date().toISOString(),
        layout: {
          templateId: 'executive-pro',
          columns: 1,
          sidebarPosition: 'left',
          sidebarWidthPercentage: 30,
          showPhoto: false,
          photoStyle: 'rounded',
          density: 'compact',
          fontFamily: 'Outfit',
          fontSizeBase: 9.5,
          primaryColor: '#059669', // Emeraude Pro
          secondaryColor: '#0f172a',
          accentColor: '#4f46e5',
          backgroundColor: '#ffffff',
          sectionOrder: ['summary', 'experience', 'projects', 'skills', 'education']
        },
        visibility: {
          summary: true,
          skills: true,
          experience: true,
          education: true,
          projects: true,
          languages: true,
          certifications: false
        },
        content: {
          customTitle: 'Élève Ingénieur R&D en Conception Mécatronique & Systèmes Embarqués',
          customSummary: 'Ingénieur en devenir alliant compétences avancées en CAO 3D (Fusion 360, SolidWorks) et rigueur de gestion de projet. Expérience démontrée dans le développement de drones et robots mobiles, de l\'esquisse conceptuelle jusqu\'aux essais en vol.',
          skills: [
            {
              ...INITIAL_MASTER_PROFILE.skills[0],
              isTopMatch: true,
              isOfferKeyword: true,
              relevanceScore: 0.99
            },
            {
              ...INITIAL_MASTER_PROFILE.skills[2],
              isTopMatch: true,
              isOfferKeyword: true,
              relevanceScore: 0.95
            },
            {
              ...INITIAL_MASTER_PROFILE.skills[6],
              isTopMatch: false,
              isOfferKeyword: true,
              relevanceScore: 0.85
            },
            {
              ...INITIAL_MASTER_PROFILE.skills[1],
              isTopMatch: false,
              isOfferKeyword: false,
              relevanceScore: 0.75
            }
          ],
          experiences: INITIAL_MASTER_PROFILE.experiences,
          education: INITIAL_MASTER_PROFILE.education,
          projects: INITIAL_MASTER_PROFILE.projects,
          languages: INITIAL_MASTER_PROFILE.languages,
          certifications: INITIAL_MASTER_PROFILE.certifications
        }
      }
    ]
  }
];
