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
    firstName: 'Léo-Tristan',
    lastName: 'Girardet',
    handle: 'altep',
    monogram: 'LTG',
    role: {
      fr: '1ère année BTS SIO (SLAM) · Développeur Jeux, 3D & Outils',
      en: '1st-Year BTS SIO (SLAM) · Game, 3D & Tooling Developer',
    },
    availability: {
      fr: 'BTS SIO SLAM · Ouvert aux stages & projets',
      en: 'BTS SIO SLAM · Open to internships & projects',
    },
    location: {
      fr: 'France · Environnement Linux (Fedora)',
      en: 'France · Linux (Fedora) Environment',
    },
    // EDIT HERE: Remplacez par votre véritable adresse e-mail de contact
    email: 'contact@altep.dev',
    heroGreeting: {
      fr: 'Développement temps réel, moteurs 3D & outillage logiciel',
      en: 'Real-time development, 3D engines & software tooling',
    },
    heroHeadline: {
      fr: 'Je conçois des mondes procéduraux, des simulations temps réel et des outils logiciels locaux.',
      en: 'I build procedural worlds, real-time simulations, and local-first developer tools.',
    },
    heroBio: {
      fr: "Étudiant en 1ère année de BTS SIO (parcours SLAM) après un Bac Pro CIEL obtenu avec Mention Très Bien. Je développe principalement sous Godot 4 (GDScript & Rust/gdext), C++, TypeScript/Bun et Python, avec un intérêt marqué pour la génération procédurale, la 3D temps réel et les outils respectueux des données.",
      en: 'First-year BTS SIO (SLAM software track) student after earning a Bac Pro CIEL with Highest Honors (Mention Très Bien). I focus on Godot 4 (GDScript & Rust/gdext), C++, TypeScript/Bun, and Python — building procedural 3D worlds, large-scale simulations, and transparent local-first tools.',
    },
    highlights: [
      {
        value: 'BTS SIO · SLAM',
        label: { fr: '1ère année (Développement)', en: '1st Year (Software Track)' },
      },
      {
        value: 'Bac Pro CIEL',
        label: { fr: 'Mention Très Bien', en: 'Highest Honors' },
      },
      {
        value: 'Godot 4 · Rust · TS',
        label: { fr: '3D Temps Réel & Outillage', en: 'Real-Time 3D & Tooling' },
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
      handle: 'github.com/altep',
      url: 'https://github.com/altep',
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
      handle: 'contact@altep.dev',
      url: 'mailto:contact@altep.dev',
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
          level: 'core',
          note: {
            fr: 'Architecture de scènes, signaux et logique gameplay Godot 4',
            en: 'Scene architecture, signals & gameplay logic in Godot 4',
          },
        },
        {
          name: 'Rust',
          level: 'core',
          note: {
            fr: 'Extensions natives gdext, génération procédurale & performance',
            en: 'Native gdext extensions, procedural generation & performance',
          },
        },
        {
          name: 'C++',
          level: 'advanced',
          note: {
            fr: 'Programmation native, structures de données & optimisation',
            en: 'Native programming, data structures & optimization',
          },
        },
        {
          name: 'TypeScript/Bun',
          level: 'core',
          note: {
            fr: 'Applications rapides, tooling data, Vite & Remotion',
            en: 'Fast apps, data tooling, Vite & Remotion',
          },
        },
        {
          name: 'Python',
          level: 'advanced',
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
          level: 'core',
          note: {
            fr: 'Rendu 3D, octrees, plugins éditeur et intégration Rust/gdext',
            en: '3D rendering, octrees, editor tooling & Rust/gdext integration',
          },
        },
        {
          name: 'Three.js',
          level: 'advanced',
          note: {
            fr: 'Scènes WebGL interactives et visualisation 3D navigateur',
            en: 'Interactive WebGL scenes & browser 3D visualization',
          },
        },
        {
          name: 'Linux (Fedora)',
          level: 'core',
          note: {
            fr: 'Poste de travail quotidien, compilation et environnement dev',
            en: 'Daily workstation OS, native builds & dev environment',
          },
        },
        {
          name: 'Blender',
          level: 'advanced',
          note: {
            fr: 'Modélisation 3D, UV et export d’assets temps réel pour Godot',
            en: '3D modeling, UVs & real-time asset export for Godot',
          },
        },
        {
          name: 'Git',
          level: 'core',
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
        fr: 'Moteur voxel / planétaire Godot 4 + Rust (gdext)',
        en: 'Voxel & planetary engine built with Godot 4 + Rust (gdext)',
      },
      description: {
        fr: 'Projet 3D combinant Godot 4 et une extension native Rust via gdext pour générer des terrains et corps célestes en temps réel grâce aux Marching Cubes, un octree LOD adaptatif et une gravité procédurale.',
        en: '3D project pairing Godot 4 with a native Rust gdext extension to generate real-time terrain and celestial bodies using Marching Cubes, an adaptive octree LOD system, and procedural gravity.',
      },
      year: '2026',
      status: { fr: 'En développement', en: 'In Development' },
      featured: true,
      tags: ['Godot 4', 'Rust', 'gdext', '3D Procédural'],
      highlights: {
        fr: [
          'Extraction de maillages en temps réel via Marching Cubes en Rust (gdext)',
          'Gestion multi-échelle par octree LOD et champs de gravité procédurale',
        ],
        en: [
          'Real-time mesh extraction via Marching Cubes written in Rust (gdext)',
          'Multi-scale octree LOD streaming paired with procedural gravity fields',
        ],
      },
      links: {
        // EDIT HERE: Lien GitHub & itch.io/démo de Univoid ("" = zone réservée)
        github: 'https://github.com/altep/univoid',
        demo: '',
      },
      accent: 'cyan',
    },
    {
      id: 'europe-sim-1-1',
      title: {
        fr: 'Simulation Multi-Métiers 1:1 Europe',
        en: '1:1 Europe Multi-Trade Simulation',
      },
      tagline: {
        fr: 'Monde ouvert à l’échelle 1:1 sous Godot 4 & OpenStreetMap',
        en: '1:1 scale European open world powered by Godot 4 & OpenStreetMap',
      },
      description: {
        fr: 'Simulation multi-métiers exploitant les données cartographiques OpenStreetMap à l’échelle réelle 1:1 dans Godot 4, articulant plusieurs boucles de gameplay : conduite, agriculture, industrie et informatique.',
        en: 'Multi-trade simulation streaming real-world 1:1 OpenStreetMap cartography into Godot 4, combining driving, farming, factory automation, and IT gameplay loops.',
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
        github: 'https://github.com/altep/europe-sim',
        demo: '',
      },
      accent: 'violet',
    },
    {
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
    },
    {
      id: 'hiif',
      title: {
        fr: 'HIiF',
        en: 'HIiF',
      },
      tagline: {
        fr: 'Analyse des scrutins de l’Assemblée nationale en Bun/TypeScript',
        en: 'French National Assembly vote analytics built with Bun & TypeScript',
      },
      description: {
        fr: 'Application Bun et TypeScript dédiée à l’ingestion, au croisement et à la visualisation lisible des votes publics de l’Assemblée nationale afin d’explorer les positions des députés et groupes parlementaires.',
        en: 'Bun and TypeScript application that ingests, structures, and visualizes public roll-call votes from the French National Assembly to make parliamentary voting records easy to inspect.',
      },
      year: '2025',
      status: { fr: 'App Web / CLI', en: 'Web / CLI App' },
      featured: false,
      tags: ['TypeScript/Bun', 'Open Data', 'Web'],
      highlights: {
        fr: [
          'Parsing rapide des données open data parlementaires avec le runtime Bun',
          'Interface claire pour filtrer scrutins, groupes et votes individuels',
        ],
        en: [
          'High-speed parliamentary open-data ingestion powered by Bun',
          'Clean filtering across ballots, political groups, and individual votes',
        ],
      },
      links: {
        // EDIT HERE: Lien GitHub & démo live de HIiF
        github: 'https://github.com/altep/hiif',
        demo: '',
      },
      accent: 'amber',
    },
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
      organization: 'Établissement BTS SIO (SLAM)',
      location: { fr: 'France', en: 'France' },
      period: { fr: '2025 – En cours', en: '2025 – Present' },
      summary: {
        fr: 'Solutions Logicielles et Applications Métiers : conception logicielle, programmation orientée objet, développement web TypeScript, bases de données et gestion de projet avec Git.',
        en: 'Software Solutions & Business Applications: software engineering, object-oriented design, TypeScript web development, databases, and Git-based team workflows.',
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
      organization: 'Lycée Professionnel',
      location: { fr: 'France', en: 'France' },
      period: { fr: '2022 – 2025', en: '2022 – 2025' },
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
        fr: 'Développeur Indépendant — Jeux 3D & Outils Logiciels',
        en: 'Independent Developer — 3D Games & Software Tooling',
      },
      organization: 'altep · Projets Personnels',
      location: { fr: 'Linux (Fedora)', en: 'Linux (Fedora)' },
      period: { fr: '2024 – Présent', en: '2024 – Present' },
      summary: {
        fr: 'Conception et prototypage de moteurs 3D procéduraux (Univoid), de simulations à échelle réelle (Simulation Multi-Métiers 1:1 Europe) et d’outils TypeScript/Bun local-first.',
        en: 'Designing and prototyping procedural 3D engines (Univoid), 1:1 scale open-world simulations (Europe Multi-Trade Sim), and local-first TypeScript/Bun tools.',
      },
      bullets: {
        fr: [
          'Intégration Godot 4 + Rust (gdext) pour la génération de maillages Marching Cubes et octrees LOD.',
          'Création d’assets 3D sous Blender et visualisation WebGL via Three.js.',
        ],
        en: [
          'Bridged Godot 4 and Rust (gdext) for Marching Cubes mesh generation and octree LOD.',
          'Authored 3D assets in Blender and interactive WebGL scenes with Three.js.',
        ],
      },
      tags: ['Godot 4', 'Rust', 'GDScript', 'Blender', 'Three.js'],
    },
    {
      id: 'exp-stages-ciel',
      kind: 'experience',
      role: {
        fr: 'Stagiaire Développement & Outillage (PFMP Bac Pro)',
        en: 'Software & Tooling Intern (Vocational Internships)',
      },
      // EDIT HERE: Renseignez le nom de l'entreprise ou structure de vos stages
      organization: 'Stages en entreprise (Bac Pro CIEL)',
      location: { fr: 'France', en: 'France' },
      period: { fr: '2023 – 2025', en: '2023 – 2025' },
      summary: {
        fr: 'Périodes de formation en milieu professionnel axées sur le développement applicatif, le scripting d’automatisation Python et le maintien d’outils internes sous Linux.',
        en: 'Industry internship periods focused on application development, Python automation scripting, and maintaining internal developer tools on Linux.',
      },
      bullets: {
        fr: [
          'Développement de scripts utilitaires en Python et TypeScript pour automatiser des tâches métier.',
          'Travail collaboratif avec Git, documentation technique et tests fonctionnels.',
        ],
        en: [
          'Built utility scripts in Python and TypeScript to automate internal workflows.',
          'Collaborated using Git, technical documentation, and functional testing.',
        ],
      },
      tags: ['Python', 'TypeScript', 'Git', 'Linux'],
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
