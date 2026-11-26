/**
 * ============================================================================
 * PORTFOLIO DATA & TYPE DEFINITIONS (SOURCE UNIQUE DE VÉRITÉ)
 * ============================================================================
 * Modifiez ce fichier pour mettre à jour :
 *   - Votre profil, pseudo (`altep`) et coordonnées de contact
 *   - Vos liens externes (GitHub, itch.io, contact)
 *   - Vos compétences (Développement & Outillage)
 *   - Vos projets principaux (les 4 cartes + ajout futur)
 *   - Votre parcours & formations
 *   - Tous les libellés de l'interface (FR / EN)
 *
 * Astuce : recherchez `// EDIT HERE:` dans ce fichier pour trouver
 * instantanément chaque bloc modifiable. Le CV A4 classique se synchronise
 * automatiquement depuis ces données (voir `src/data/cvData.ts` pour les
 * champs complémentaires propres au CV : téléphone, langues, centres d'intérêt).
 */

export type Locale = 'fr' | 'en';

export type LocalizedText = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export type SocialIconKey =
  | 'github'
  | 'itchio'
  | 'linkedin'
  | 'globe'
  | 'mail';

export interface SocialLink {
  id: string;
  label: LocalizedText;
  handle: string;
  url: string;
  icon: SocialIconKey;
  showInContact?: boolean;
}

export type SkillLevel = 'core' | 'advanced' | 'proficient';

export interface SkillItem {
  name: string;
  level: SkillLevel;
  note?: LocalizedText;
}

export interface SkillCategory {
  id: 'dev-languages' | 'engines-tooling';
  title: LocalizedText;
  subtitle: LocalizedText;
  accent: 'cyan' | 'violet' | 'emerald' | 'rose' | 'amber';
  icon: 'code' | 'gamepad' | 'wrench';
  items: SkillItem[];
}

export interface ProjectLinks {
  /** URL du dépôt GitHub (laisser "" pour afficher le statut réservé) */
  github?: string;
  /** URL itch.io / démo jouable / site live (laisser "" pour afficher le statut réservé) */
  demo?: string;
  /** Lien optionnel vers une documentation ou vidéo de présentation */
  docs?: string;
}

export interface ProjectItem {
  id: string;
  title: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  year: string;
  status: LocalizedText;
  featured?: boolean;
  /** Tags utilisés pour le filtrage interactif dans la fenêtre Projets */
  tags: string[];
  highlights: LocalizedList;
  links: ProjectLinks;
  /** Palette d'accentuation de la carte */
  accent: 'cyan' | 'violet' | 'emerald' | 'rose' | 'amber';
}

export interface TimelineEntry {
  id: string;
  kind: 'experience' | 'education';
  role: LocalizedText;
  organization: string;
  location: LocalizedText;
  period: LocalizedText;
  summary: LocalizedText;
  bullets: LocalizedList;
  tags: string[];
}

export interface ProfileInfo {
  firstName: string;
  lastName: string;
  /** Pseudo / handle développeur affiché dans le profil et le terminal */
  handle: string;
  monogram: string;
  role: LocalizedText;
  availability: LocalizedText;
  location: LocalizedText;
  email: string;
  heroGreeting: LocalizedText;
  heroHeadline: LocalizedText;
  heroBio: LocalizedText;
  highlights: Array<{
    value: string;
    label: LocalizedText;
  }>;
}

export interface UiTranslations {
  nav: {
    skills: string;
    projects: string;
    journey: string;
    contact: string;
  };
  actions: {
    generateCv: string;
    printCv: string;
    closePreview: string;
    contactMe: string;
    viewProjects: string;
    copyEmail: string;
    emailCopied: string;
    toggleTheme: string;
    switchLang: string;
  };
  sections: {
    skillsEyebrow: string;
    skillsTitle: string;
    skillsLead: string;
    projectsEyebrow: string;
    projectsTitle: string;
    projectsLead: string;
    journeyEyebrow: string;
    journeyTitle: string;
    journeyLead: string;
    experienceLabel: string;
    educationLabel: string;
    contactEyebrow: string;
    contactTitle: string;
    contactLead: string;
  };
  projects: {
    allFilter: string;
    featuredBadge: string;
    githubLabel: string;
    githubReserved: string;
    demoLabel: string;
    demoReserved: string;
    docsLabel: string;
    emptyState: string;
  };
  cvModal: {
    badge: string;
    title: string;
    hint: string;
  };
  os: {
    desktopIconsAria: string;
    windowsLayerAria: string;
    taskbarAria: string;
    clockAria: string;
    terminalTooltip: string;
    inspectorProfilePath: string;
    inspectorProjectsPath: string;
    inspectorProjectsCountUnit: string;
    inspectorSkillsPath: string;
    inspectorSkillsCountUnit: string;
    inspectorJourneyPath: string;
    inspectorJourneyCountUnit: string;
    openWindows: string;
    noWindowsOpen: string;
    windowClose: string;
    windowMinimize: string;
    windowMaximize: string;
    windowRestore: string;
    terminalHint: string;
    terminalPlaceholder: string;
    telemetryTotal: string;
    telemetryCore: string;
    telemetryReady: string;
    telemetryOnlineValue: string;
  };
  footer: {
    builtWith: string;
    rights: string;
  };
}

export interface PortfolioData {
  profile: ProfileInfo;
  socialLinks: SocialLink[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  timeline: TimelineEntry[];
  ui: Record<Locale, UiTranslations>;
}

export const portfolioData: PortfolioData = {
  // ==========================================================================
  // EDIT HERE: PROFIL & COORDONNÉES DE CONTACT
  // ==========================================================================
  profile: {
    firstName: 'Léo',
    lastName: 'Girardet',
    handle: 'altep',
    monogram: 'LG',
    role: {
      fr: '1ère année BTS SIO (SLAM) · Développeur',
      en: '1st-Year BTS SIO (SLAM) · Developer',
    },
    availability: {
      fr: 'BTS SIO SLAM · Ouvert aux stages & projets',
      en: 'BTS SIO SLAM · Open to internships & projects',
    },
    location: {
      fr: 'France',
      en: 'France',
    },
    // EDIT HERE: Remplacez par votre véritable adresse e-mail de contact
    email: 'leo.girardet.pro@gmail.com',
    heroGreeting: {
      fr: 'Développement temps réel, moteurs 3D & outillage logiciel',
      en: 'Real-time development, 3D engines & software tooling',
    },
    heroHeadline: {
      fr: 'Je conçois des sites web, des mondes procéduraux, des simulations temps réel et des systèmes complexes.',
      en: 'I build websites, procedural worlds, real-time simulations, and complex systems.',
    },
    heroBio: {
      fr: "Étudiant en 1ère année de BTS SIO, option SLAM, après l’obtention d’un Bac Pro CIEL avec Mention Très Bien. Je développe principalement avec Godot 4 (GDScript & GLSL), TypeScript/Bun et Python, avec un intérêt particulier pour la génération procédurale, les mondes 3D à grande échelle et les outils locaux respectueux des données.",
      en: 'First-year BTS SIO student specializing in the SLAM software development track, after earning a Bac Pro CIEL with Highest Honors. I primarily work with Godot 4 (GDScript & GLSL), TypeScript/Bun, and Python, with a focus on procedural generation, large-scale 3D worlds, and privacy-conscious local tools.',
    },
    highlights: [
      {
        value: 'BTS SIO · SLAM',
        label: { fr: '1ère année — Développement', en: 'First year — Software development' },
      },
      {
        value: 'Bac Pro CIEL',
        label: { fr: 'Mention Très Bien', en: 'Highest Honors' },
      },
      {
        value: 'Game Dev · Web Dev',
        label: { fr: 'Systèmes & conception web', en: 'Systems & web development' },
      },
    ],
  },

  // ==========================================================================
  // EDIT HERE: LIENS EXTERNES (GitHub, itch.io, Contact...)
  // Ces liens apparaissent dans la fenêtre Profil & Contact, le CV A4
  // et les raccourcis associés du bureau.
  // ==========================================================================
  socialLinks: [
    {
      id: 'github',
      label: { fr: 'GitHub', en: 'GitHub' },
      // EDIT HERE: Pseudo et URL GitHub
      handle: 'github.com/altep-code',
      url: 'https://github.com/altep-code',
      icon: 'github',
      showInContact: true,
    },
    {
      id: 'itchio',
      label: { fr: 'itch.io', en: 'itch.io' },
      // EDIT HERE: Page itch.io pour vos démos Godot / jeux
      handle: 'altep.itch.io',
      url: 'https://altep.itch.io',
      icon: 'itchio',
      showInContact: true,
    },
    {
      id: 'contact',
      label: { fr: 'Contact Direct', en: 'Direct Contact' },
      // EDIT HERE: E-mail ou page de contact
      handle: ' leo.girardet.pro@gmail.com',
      url: 'mailto: leo.girardet.pro@gmail.com',
      icon: 'mail',
      showInContact: true,
    },
  ],

  // ==========================================================================
  // EDIT HERE: COMPÉTENCES (DÉVELOPPEMENT & OUTILLAGE UNIQUEMENT)
  // ==========================================================================
  skillCategories: [
    {
      id: 'dev-languages',
      title: {
        fr: 'Langages & Runtime',
        en: 'Languages & Runtime',
      },
      subtitle: {
        fr: 'Programmation gameplay, bas niveau, web moderne et scripting',
        en: 'Gameplay programming, native performance, modern web & scripting',
      },
      accent: 'cyan',
      icon: 'code',
      items: [
        {
          name: 'GDScript',
          level: 'advanced',
          note: {
            fr: 'Architecture de scènes, signaux et logique gameplay Godot 4',
            en: 'Scene architecture, signals & gameplay logic in Godot 4',
          },
        },
        {
          name: 'Rust',
          level: 'proficient',
          note: {
            fr: 'Extensions natives gdext, génération procédurale & performance',
            en: 'Native gdext extensions, procedural generation & performance',
          },
        },
        {
          name: 'JS/TS',
          level: 'advanced',
          note: {
            fr: 'Applications Node.js/Bun, interfaces web modernes',
            en: 'Node.js/Bun applications and modern web interfaces',
          },
        },
        {
          name: 'Python',
          level: 'proficient',
          note: {
            fr: 'Traitement de données, scripts & prototypage IA locale',
            en: 'Data processing, automation scripts & local AI prototyping',
          },
        },
      ],
    },
    {
      id: 'engines-tooling',
      title: {
        fr: 'Moteurs, 3D & Outillage',
        en: 'Engines, 3D & Tooling',
      },
      subtitle: {
        fr: 'Rendu temps réel, création d’assets 3D et environnement de développement',
        en: 'Real-time rendering, 3D asset creation & daily developer workflow',
      },
      accent: 'emerald',
      icon: 'wrench',
      items: [
        {
          name: 'Godot 4',
          level: 'advanced',
          note: {
            fr: 'Octrees, Marching Cubes, physique personnalisée',
            en: 'Octrees, Marching Cubes, and custom physics',
          },
        },
        {
          name: 'Linux (Fedora)',
          level: 'advanced',
          note: {
            fr: 'Poste de travail quotidien, compilation et environnement dev',
            en: 'Daily workstation OS, native builds & dev environment',
          },
        },
        {
          name: 'Blender',
          level: 'proficient',
          note: {
            fr: 'Modélisation 3D simple, UV et export d’assets temps réel pour Godot',
            en: 'Simple 3D modeling, UVs & real-time asset export for Godot',
          },
        },
        {
          name: 'Git',
          level: 'proficient',
          note: {
            fr: 'Gestion de versions, branches propres et collaboration',
            en: 'Version control, clean branching & collaboration',
          },
        },
      ],
    },
  ],

  // ==========================================================================
  // EDIT HERE: PROJETS PRINCIPAUX (UNIQUEMENT LES 4 PROJETS)
  // Pour ajouter un futur projet : dupliquez un bloc `ProjectItem` ci-dessous
  // et renseignez `links.github` / `links.demo` (itch.io ou site live).
  // ==========================================================================
  projects: [
    {
      id: 'univoid',
      title: {
        fr: 'Univoid',
        en: 'Univoid',
      },
      tagline: {
        fr: 'Moteur voxel / planétaire Godot 4 (GDScript)',
        en: 'Voxel & planetary engine built with Godot 4 (GDScript)',
      },
      description: {
        fr: 'Projet 3D combinant Godot 4 pour générer des terrains et des corps célestes en temps réel grâce aux Marching Cubes, à un système octree adaptatif et à une gravité procédurale.',
        en: 'A 3D project built with Godot 4 that generates terrain and celestial bodies in real time using Marching Cubes, an adaptive octree system, and procedural gravity.',
      },
      year: '2026',
      status: { fr: 'En développement', en: 'In Development' },
      featured: true,
      tags: ['Godot 4', '3D Procedural'],
      highlights: {
        fr: [
          'Extraction de maillages en temps réel via Marching Cubes',
          'Gestion multi-échelle par octree LOD et champs de gravité procédurale',
        ],
        en: [
          'Real-time mesh extraction via Marching Cubes',
          'Multi-scale octree LOD streaming paired with procedural gravity fields',
        ],
      },
      links: {
        // EDIT HERE: Lien GitHub & itch.io/démo de Univoid ("" = zone réservée)
        github: '',
        demo: '',
      },
      accent: 'cyan',
    },
    {
      id: 'open-terra',
      title: {
        fr: 'Open Terra',
        en: 'Open Terra',
      },
      tagline: {
        fr: 'Moteur de grand monde ouvert avec Godot 4 & OpenStreetMap',
        en: 'Large open-world engine powered by Godot 4 & OpenStreetMap',
      },
      description: {
        fr: 'Projet de simulation combinant conduite, agriculture, industrie et informatique dans un monde ouvert alimenté par les données OpenStreetMap.',
        en: 'A simulation project combining driving, farming, industry, and IT systems in an open world powered by OpenStreetMap data.',
      },
      year: '2026',
      status: { fr: 'Prototype 3D', en: '3D Prototype' },
      featured: true,
      tags: ['Godot 4', 'GDScript', 'OpenStreetMap', 'Simulation'],
      highlights: {
        fr: [
          'Génération du réseau routier et du bâti européen depuis OpenStreetMap (1:1)',
          'Boucles de gameplay interconnectées : driving, farming, factory et IT',
        ],
        en: [
          'Real-scale European roads and buildings streamed from OpenStreetMap (1:1)',
          'Interconnected career loops spanning driving, farming, factory & IT',
        ],
      },
      links: {
        // EDIT HERE: Lien GitHub & itch.io/démo de Simulation Multi-Métiers 1:1 Europe
        github: '',
        demo: '',
      },
      accent: 'violet',
    },
    /*{
      id: 'ethic-ai',
      title: {
        fr: 'EthicAI',
        en: 'EthicAI',
      },
      tagline: {
        fr: 'SLM local-first axé sur la traçabilité des données et licences',
        en: 'Local-first SLM focused on data & license traceability',
      },
      description: {
        fr: 'Écosystème d’IA légère (SLM) exécutée en local-first mettant l’accent sur la provenance transparente des jeux de données, le respect des licences et la création de contenus techniques avec TypeScript et Remotion.',
        en: 'Local-first Small Language Model (SLM) initiative centered on transparent dataset provenance, license traceability, and programmatic media tooling built with TypeScript and Remotion.',
      },
      year: '2025',
      status: { fr: 'Local-First', en: 'Local-First' },
      featured: true,
      tags: ['TypeScript', 'Remotion', 'Python', 'SLM / IA'],
      highlights: {
        fr: [
          'Exécution 100 % locale avec audit explicite des sources et licences',
          'Pipeline vidéo et interface automatisés en TypeScript / Remotion',
        ],
        en: [
          '100% local execution with explicit source & license lineage tracking',
          'Automated presentation and video pipeline powered by TypeScript / Remotion',
        ],
      },
      links: {
        // EDIT HERE: Lien GitHub & démo de EthicAI
        github: 'https://github.com/altep/ethicai',
        demo: '',
      },
      accent: 'emerald',
    },*/
    
  ],

  // ==========================================================================
  // EDIT HERE: PARCOURS (FORMATIONS & EXPÉRIENCES / PROJETS)
  // ==========================================================================
  timeline: [
    {
      id: 'edu-bts-sio',
      kind: 'education',
      role: {
        fr: 'BTS SIO — Option SLAM (1ère année)',
        en: 'BTS SIO — SLAM Software Track (1st Year)',
      },
      // EDIT HERE: Nom de votre établissement / lycée
      organization: 'Lycée Ella Fitzgerald',
      location: { fr: 'France', en: 'France' },
      period: { fr: '2026 – En cours', en: '2026 – Present' },
      summary: {
        fr: 'La formation BTS SIO, option SLAM, couvre la conception logicielle, la programmation orientée objet, le développement web avec TypeScript, les bases de données et la gestion de projet avec Git.',
        en: 'The BTS SIO SLAM track covers software engineering, object-oriented programming, TypeScript web development, databases, and Git-based project management.',
      },
      bullets: {
        fr: [
          'Approfondissement en architecture applicative, développement full-stack et modélisation.',
          'Mise en pratique continue via des projets temps réel et outils open data (HIiF, EthicAI).',
        ],
        en: [
          'Core focus on application architecture, software design, and data modeling.',
          'Hands-on practice through real-time 3D prototypes and open-data apps (HIiF, EthicAI).',
        ],
      },
      tags: ['SLAM', 'TypeScript', 'Python', 'Git'],
    },
    {
      id: 'edu-bac-ciel',
      kind: 'education',
      role: {
        fr: 'Bac Pro CIEL — Mention Très Bien',
        en: 'Vocational Baccalaureate CIEL — Highest Honors (Mention Très Bien)',
      },
      // EDIT HERE: Nom de votre lycée
      organization: 'Lycée Professionnel Pierre Desgranges',
      location: { fr: 'France', en: 'France' },
      period: { fr: '2024 – 2026', en: '2024 – 2026' },
      summary: {
        fr: 'Baccalauréat Professionnel Cybersécurité, Informatique et Réseaux, Électronique obtenu avec la Mention Très Bien. Socle solide en informatique, développement embarqué/logiciel et Linux.',
        en: 'Graduated with Highest Honors (Mention Très Bien). Built strong foundations in computer science, C++/Python programming, and Linux environments.',
      },
      bullets: {
        fr: [
          'Diplôme obtenu avec Mention Très Bien.',
          'Premiers développements sous Linux (Fedora), C++, Python et prototypage sous Godot 4.',
        ],
        en: [
          'Awarded Highest Honors (Mention Très Bien).',
          'Started daily Linux (Fedora) development with C++, Python, and Godot 4.',
        ],
      },
      tags: ['Mention Très Bien', 'C++', 'Python', 'Linux (Fedora)'],
    },
    {
      id: 'exp-indie-dev',
      kind: 'experience',
      role: {
        fr: 'Développeur Indépendant — Jeux 3D',
        en: 'Independent Developer — 3D Games',
      },
      organization: '',
      location: { fr: 'France', en: 'France' },
      period: { fr: '2022 – Présent', en: '2022 – Present' },
      summary: {
        fr: 'Création indépendante de jeux vidéo depuis 2022, puis migration de Unity vers Godot 4 pour bénéficier d’un moteur plus ouvert et entièrement modifiable.',
        en: 'Independent video game development since 2022, followed by a migration from Unity to Godot 4 for greater flexibility and engine customization.',
      },
      bullets: {
        fr: [
          'Utilisation de Godot 4 pour la génération de maillages Marching Cubes et octrees LOD.',
          'Création d’assets 3D sous Blender et importation dans Godot.',
        ],
        en: [
          'Built projects with Godot 4, including Marching Cubes mesh generation and octree-based LOD.',
          'Created 3D assets in Blender and imported them into Godot.',
        ],
      },
      tags: ['Godot 4', 'GDScript'],
    },
    {
      id: 'exp-web-dev',
      kind: 'experience',
      role: {
        fr: 'Développeur Web',
        en: 'Web Developer',
      },
      // EDIT HERE: Renseignez le nom de l'entreprise ou structure de vos stages
      organization: '',
      location: { fr: 'France', en: 'France' },
      period: { fr: '2021 – Présent', en: '2021 – Présent' },
      summary: {
        fr: 'Conception et développement de sites web depuis 2021, avec des technologies front-end telles que Vite et des technologies back-end telles que Node.js et Bun.',
        en: 'Website design and development since 2021, using front-end technologies such as Vite and back-end technologies such as Node.js and Bun.',
      },
      bullets: {
        fr: [
          'Création de maquettes dans Figma puis intégration fidèle en HTML et CSS.',
          'Utilisation de technologies front-end et back-end adaptées à chaque projet.',
        ],
        en: [
          'Created layouts in Figma and reproduced them faithfully with HTML and CSS.',
          'Used appropriate front-end and back-end technologies for each project.',
        ],
      },
      tags: ['TS/JS', 'HTML', 'Web'],
    },
  ],

  // ==========================================================================
  // EDIT HERE: TEXTES DE L'INTERFACE (FR / EN)
  // ==========================================================================
  ui: {
    fr: {
      nav: {
        skills: 'Compétences',
        projects: 'Projets',
        journey: 'Parcours',
        contact: 'Contact',
      },
      actions: {
        generateCv: 'Voir / Imprimer le CV A4',
        printCv: 'Imprimer / Exporter PDF (A4)',
        closePreview: 'Fermer le CV',
        contactMe: 'Envoyer un e-mail',
        viewProjects: 'Explorer les projets',
        copyEmail: 'Copier l’e-mail',
        emailCopied: 'E-mail copié !',
        toggleTheme: 'Basculer thème sombre/clair',
        switchLang: 'Switch to English',
      },
      sections: {
        skillsEyebrow: 'Développement & Outillage',
        skillsTitle: 'Compétences Techniques',
        skillsLead:
          'Stack focalisée sur le développement temps réel, la 3D, les applications TypeScript/Bun et l’outillage sous Fedora.',
        projectsEyebrow: 'Projets principaux',
        projectsTitle: '4 Projets Clés',
        projectsLead:
          'Filtrez par technologie. Chaque carte inclut des emplacements directs vers GitHub et la démonstration.',
        journeyEyebrow: 'Formation & Pratique',
        journeyTitle: 'Parcours',
        journeyLead:
          'BTS SIO (parcours SLAM) dans la continuité d’un Bac Pro CIEL Mention Très Bien.',
        experienceLabel: 'Expériences & Projets',
        educationLabel: 'Formations',
        contactEyebrow: 'Liens & Contact',
        contactTitle: 'Contact & Réseaux Dev',
        contactLead:
          'Retrouvez mes dépôts GitHub, mes prototypes itch.io ou contactez-moi directement par e-mail.',
      },
      projects: {
        allFilter: 'Tous',
        featuredBadge: 'Principal',
        githubLabel: 'Dépôt GitHub',
        githubReserved: 'GitHub · Lien à renseigner',
        demoLabel: 'Démo / itch.io',
        demoReserved: 'Démo · Bientôt disponible',
        docsLabel: 'Docs',
        emptyState: 'Aucun projet ne correspond à ce filtre.',
      },
      cvModal: {
        badge: 'Document A4 Imprimable · Noir & Blanc',
        title: 'CV Classique (FR) — Léo-Tristan Girardet',
        hint: 'Astuce impression : sélectionnez « Enregistrer au format PDF », format A4 portrait, et décochez les en-têtes/pieds de page du navigateur.',
      },
      os: {
        desktopIconsAria: 'Icônes du bureau',
        windowsLayerAria: 'Fenêtres applicatives',
        taskbarAria: 'Barre des tâches',
        clockAria: 'Horloge système',
        terminalTooltip: 'Ouvrir le terminal',
        inspectorProfilePath: '// PROFIL_UTILISATEUR',
        inspectorProjectsPath: '// INDEX_PROJETS',
        inspectorProjectsCountUnit: 'projets',
        inspectorSkillsPath: '// MATRICE_DEV_OUTILLAGE',
        inspectorSkillsCountUnit: 'catégories',
        inspectorJourneyPath: '// HISTORIQUE_PARCOURS',
        inspectorJourneyCountUnit: 'entrées',
        openWindows: 'Fenêtres ouvertes',
        noWindowsOpen: 'Aucune fenêtre ouverte — cliquez sur une icône du bureau',
        windowClose: 'Fermer',
        windowMinimize: 'Réduire',
        windowMaximize: 'Agrandir',
        windowRestore: 'Restaurer',
        terminalHint:
          'Tapez `help` pour la liste des commandes (`projects`, `skills`, `lang en`, `cv`, `print`, `clear`).',
        terminalPlaceholder: 'Entrez une commande... (ex: help)',
        telemetryTotal: 'Compétences',
        telemetryCore: 'Maîtrise Core',
        telemetryReady: 'Environnement',
        telemetryOnlineValue: 'FEDORA',
      },
      footer: {
        builtWith: 'Vite · TypeScript · SCSS · Three.js',
        rights: 'Portfolio WorkstationOS & CV A4',
      },
    },
    en: {
      nav: {
        skills: 'Skills',
        projects: 'Projects',
        journey: 'Journey',
        contact: 'Contact',
      },
      actions: {
        generateCv: 'View / Print Classic CV (A4)',
        printCv: 'Print / Export PDF (A4)',
        closePreview: 'Close CV',
        contactMe: 'Send an email',
        viewProjects: 'Explore projects',
        copyEmail: 'Copy email',
        emailCopied: 'Email copied!',
        toggleTheme: 'Toggle dark/light theme',
        switchLang: 'Passer en Français',
      },
      sections: {
        skillsEyebrow: 'Development & Tooling',
        skillsTitle: 'Technical Skills',
        skillsLead:
          'Focused stack covering real-time 3D engines, systems extensions, TypeScript/Bun apps, and Linux Fedora tooling.',
        projectsEyebrow: 'Core Projects',
        projectsTitle: '4 Flagship Projects',
        projectsLead:
          'Filter by technology tag. Every card includes direct slots for GitHub repositories and demos.',
        journeyEyebrow: 'Education & Practice',
        journeyTitle: 'Background',
        journeyLead:
          'First-year BTS SIO (SLAM software track) following a Bac Pro CIEL with Highest Honors.',
        experienceLabel: 'Experience & Practice',
        educationLabel: 'Education',
        contactEyebrow: 'Links & Contact',
        contactTitle: 'Contact & Dev Links',
        contactLead:
          'Browse my GitHub repositories, itch.io prototypes, or reach out directly by email.',
      },
      projects: {
        allFilter: 'All',
        featuredBadge: 'Core',
        githubLabel: 'GitHub Repo',
        githubReserved: 'GitHub · Slot reserved',
        demoLabel: 'Demo / itch.io',
        demoReserved: 'Demo · Coming soon',
        docsLabel: 'Docs',
        emptyState: 'No projects match the selected tag.',
      },
      cvModal: {
        badge: 'Printable A4 Document · Black & White',
        title: 'Classic CV (EN) — Léo-Tristan Girardet',
        hint: 'Print tip: choose "Save as PDF", A4 portrait paper size, and disable browser headers/footers.',
      },
      os: {
        desktopIconsAria: 'Desktop icons',
        windowsLayerAria: 'Application windows',
        taskbarAria: 'Taskbar',
        clockAria: 'System clock',
        terminalTooltip: 'Open terminal',
        inspectorProfilePath: '// USER_PROFILE',
        inspectorProjectsPath: '// PROJECT_INDEX',
        inspectorProjectsCountUnit: 'projects',
        inspectorSkillsPath: '// DEV_TOOLING_MATRIX',
        inspectorSkillsCountUnit: 'categories',
        inspectorJourneyPath: '// JOURNEY_LOG',
        inspectorJourneyCountUnit: 'entries',
        openWindows: 'Open windows',
        noWindowsOpen: 'No open windows — click a desktop icon to launch',
        windowClose: 'Close',
        windowMinimize: 'Minimize',
        windowMaximize: 'Maximize',
        windowRestore: 'Restore',
        terminalHint:
          'Type `help` for commands (`projects`, `skills`, `lang fr`, `cv`, `print`, `clear`).',
        terminalPlaceholder: 'Enter a command... (e.g. help)',
        telemetryTotal: 'Skills Count',
        telemetryCore: 'Core Mastery',
        telemetryReady: 'Environment',
        telemetryOnlineValue: 'FEDORA',
      },
      footer: {
        builtWith: 'Vite · TypeScript · SCSS · Three.js',
        rights: 'WorkstationOS Portfolio & A4 CV',
      },
    },
  },
};
