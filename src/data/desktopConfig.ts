/**
 * ============================================================================
 * WEB DESKTOP OS CONFIGURATION
 * ============================================================================
 * Modifiez ce fichier pour personnaliser :
 *   - Le nom/version affichés dans la barre supérieure et le dock
 *   - Le mode d'ouverture des icônes ('single' ou 'double' clic)
 *   - Les icônes du bureau (titre, icône, couleur, position grille, action)
 *   - Les fenêtres applicatives (titre, taille/position par défaut, ouverture au démarrage)
 *
 * Astuce : recherchez `// EDIT HERE:` pour modifier ou ajouter une icône.
 */

import type { LocalizedText } from './portfolioData';

export type WindowId = 'about' | 'projects' | 'skills' | 'journey' | 'terminal';

export type DesktopAccent = 'cyan' | 'violet' | 'emerald' | 'rose' | 'amber';

export type DesktopIconKey =
  | 'user'
  | 'folder-code'
  | 'cpu'
  | 'compass'
  | 'terminal'
  | 'globe'
  | 'printer'
  | 'github'
  | 'itchio'
  | 'mail';

export type DesktopAction =
  | { type: 'open-window'; windowId: WindowId }
  | { type: 'toggle-lang' }
  | { type: 'open-cv' }
  /** Ouvre un lien défini dans `portfolioData.socialLinks` par son `id` */
  | { type: 'open-social'; socialId: string }
  /** Ouvre une URL externe personnalisée directement depuis `desktopConfig` */
  | { type: 'open-url'; url: string };

export interface DesktopIconConfig {
  id: string;
  title: LocalizedText;
  icon: DesktopIconKey;
  accent: DesktopAccent;
  /** Position sur la grille du bureau (1-based : col 1..N, row 1..5) */
  position: { col: number; row: number };
  action: DesktopAction;
}

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowDefinition {
  id: WindowId;
  title: LocalizedText;
  dockLabel: LocalizedText;
  icon: DesktopIconKey;
  accent: DesktopAccent;
  openByDefault: boolean;
  defaultBounds: WindowBounds;
  minWidth: number;
  minHeight: number;
}

export interface DesktopConfig {
  osName: string;
  osVersion: string;
  /** 'single' = ouverture au clic simple, 'double' = double-clic style OS natif */
  iconTrigger: 'single' | 'double';
  terminalQuickCommands: Array<{ cmd: string; label?: string }>;
  icons: DesktopIconConfig[];
  windows: Record<WindowId, WindowDefinition>;
}

export const desktopConfig: DesktopConfig = {
  // EDIT HERE: Nom de l'environnement affiché dans la barre supérieure et le dock
  osName: 'WorkstationOS',
  osVersion: 'Fedora · SLAM',
  iconTrigger: 'single',

  // EDIT HERE: Raccourcis cliquables en haut du Terminal
  terminalQuickCommands: [
    { cmd: 'help' },
    { cmd: 'projects' },
    { cmd: 'skills' },
    { cmd: 'cv' },
    { cmd: 'print' },
    { cmd: 'clear' },
  ],

  // ==========================================================================
  // EDIT HERE: ICÔNES DU BUREAU
  // Pour ajouter une icône (ex: un raccourci vers un projet ou un lien),
  // dupliquez un objet ci-dessous et choisissez une case libre `{ col, row }`.
  // ==========================================================================
  icons: [
    {
      id: 'icon-about',
      title: { fr: 'Profil & Contact', en: 'Profile & Contact' },
      icon: 'user',
      accent: 'cyan',
      position: { col: 1, row: 1 },
      action: { type: 'open-window', windowId: 'about' },
    },
    {
      id: 'icon-projects',
      title: { fr: 'Projets (4)', en: 'Projects (4)' },
      icon: 'folder-code',
      accent: 'violet',
      position: { col: 1, row: 2 },
      action: { type: 'open-window', windowId: 'projects' },
    },
    {
      id: 'icon-skills',
      title: { fr: 'Compétences', en: 'Skills Matrix' },
      icon: 'cpu',
      accent: 'emerald',
      position: { col: 1, row: 3 },
      action: { type: 'open-window', windowId: 'skills' },
    },
    {
      id: 'icon-journey',
      title: { fr: 'Parcours', en: 'Background' },
      icon: 'compass',
      accent: 'rose',
      position: { col: 1, row: 4 },
      action: { type: 'open-window', windowId: 'journey' },
    },
    {
      id: 'icon-terminal',
      title: { fr: 'Terminal', en: 'Terminal' },
      icon: 'terminal',
      accent: 'amber',
      position: { col: 1, row: 5 },
      action: { type: 'open-window', windowId: 'terminal' },
    },
    {
      id: 'icon-github',
      title: { fr: 'GitHub', en: 'GitHub' },
      icon: 'github',
      accent: 'cyan',
      position: { col: 2, row: 1 },
      // Utilise automatiquement le lien `github` de `portfolioData.socialLinks`
      action: { type: 'open-social', socialId: 'github' },
    },
    {
      id: 'icon-itchio',
      title: { fr: 'itch.io', en: 'itch.io' },
      icon: 'itchio',
      accent: 'rose',
      position: { col: 2, row: 2 },
      // Utilise automatiquement le lien `itchio` de `portfolioData.socialLinks`
      action: { type: 'open-social', socialId: 'itchio' },
    },
    {
      id: 'icon-lang',
      title: { fr: 'Langue : FR / EN', en: 'Language: EN / FR' },
      icon: 'globe',
      accent: 'cyan',
      position: { col: 2, row: 3 },
      action: { type: 'toggle-lang' },
    },
    {
      id: 'icon-cv-print',
      title: { fr: 'CV Classique A4', en: 'Classic CV (A4)' },
      icon: 'printer',
      accent: 'emerald',
      position: { col: 2, row: 4 },
      action: { type: 'open-cv' },
    },
  ],

  // ==========================================================================
  // EDIT HERE: FENÊTRES APPLICATIVES
  // ==========================================================================
  windows: {
    about: {
      id: 'about',
      title: {
        fr: '~/altep/README.md — Profil & Contact',
        en: '~/altep/README.md — Profile & Contact',
      },
      dockLabel: { fr: 'profil.md', en: 'profile.md' },
      icon: 'user',
      accent: 'cyan',
      openByDefault: true,
      defaultBounds: { x: 265, y: 40, width: 700, height: 530 },
      minWidth: 360,
      minHeight: 320,
    },
    projects: {
      id: 'projects',
      title: {
        fr: '~/altep/projects — Projets Principaux',
        en: '~/altep/projects — Core Projects',
      },
      dockLabel: { fr: 'projects/', en: 'projects/' },
      icon: 'folder-code',
      accent: 'violet',
      openByDefault: false,
      defaultBounds: { x: 295, y: 58, width: 780, height: 560 },
      minWidth: 380,
      minHeight: 340,
    },
    skills: {
      id: 'skills',
      title: {
        fr: '~/altep/stack — Développement & Outillage',
        en: '~/altep/stack — Development & Tooling',
      },
      dockLabel: { fr: 'stack', en: 'stack' },
      icon: 'cpu',
      accent: 'emerald',
      openByDefault: false,
      defaultBounds: { x: 330, y: 74, width: 760, height: 530 },
      minWidth: 380,
      minHeight: 340,
    },
    journey: {
      id: 'journey',
      title: {
        fr: 'git log — Parcours & Formations',
        en: 'git log — Background & Education',
      },
      dockLabel: { fr: 'parcours', en: 'journey' },
      icon: 'compass',
      accent: 'rose',
      openByDefault: false,
      defaultBounds: { x: 310, y: 88, width: 740, height: 530 },
      minWidth: 360,
      minHeight: 340,
    },
    terminal: {
      id: 'terminal',
      title: {
        fr: 'tty0 — bash · Commandes rapides',
        en: 'tty0 — bash · Quick Commands',
      },
      dockLabel: { fr: 'tty0', en: 'tty0' },
      icon: 'terminal',
      accent: 'amber',
      openByDefault: false,
      defaultBounds: { x: 370, y: 118, width: 640, height: 420 },
      minWidth: 340,
      minHeight: 260,
    },
  },
};
