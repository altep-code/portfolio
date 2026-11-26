import {
  desktopConfig,
  type WindowBounds,
  type WindowDefinition,
  type WindowId,
} from '../data/desktopConfig';
import { portfolioData, type Locale } from '../data/portfolioData';

export type ThemeMode = 'dark' | 'light';

export interface WindowInstanceState {
  id: WindowId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  bounds: WindowBounds;
}

export interface TerminalEntry {
  kind: 'cmd' | 'out' | 'accent' | 'error';
  text: string;
}

export interface OsState {
  locale: Locale;
  theme: ThemeMode;
  activeProjectTag: string;
  cvModalOpen: boolean;
  emailCopied: boolean;
  nextZIndex: number;
  focusedWindowId: WindowId | null;
  windows: Record<WindowId, WindowInstanceState>;
  terminalLines: TerminalEntry[];
  commandHistory: string[];
}

export const ALL_TAG_KEY = '__ALL__';

const STORAGE_KEYS = {
  locale: 'portfolio_locale',
  theme: 'portfolio_theme',
} as const;

function getInitialLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEYS.locale);
  if (saved === 'fr' || saved === 'en') return saved;
  return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  if (saved === 'dark' || saved === 'light') return saved;
  return 'dark';
}

function clampBoundsToViewport(bounds: WindowBounds, def: WindowDefinition): WindowBounds {
  const vw = Math.max(window.innerWidth, 360);
  const vh = Math.max(window.innerHeight - 76, 360);
  const width = Math.min(Math.max(bounds.width, def.minWidth), vw - 24);
  const height = Math.min(Math.max(bounds.height, def.minHeight), vh - 24);
  const x = Math.min(Math.max(bounds.x, 12), Math.max(12, vw - width - 12));
  const y = Math.min(Math.max(bounds.y, 12), Math.max(12, vh - height - 12));
  return { x, y, width, height };
}

export function createInitialOsState(): OsState {
  const locale = getInitialLocale();
  const theme = getInitialTheme();

  let z = 10;
  let focusedWindowId: WindowId | null = null;
  const windows = {} as Record<WindowId, WindowInstanceState>;

  (Object.keys(desktopConfig.windows) as WindowId[]).forEach((id) => {
    const def = desktopConfig.windows[id];
    const isOpen = def.openByDefault;
    if (isOpen) {
      z += 1;
      focusedWindowId = id;
    }
    windows[id] = {
      id,
      isOpen,
      isMinimized: false,
      isMaximized: false,
      zIndex: z,
      bounds: clampBoundsToViewport(def.defaultBounds, def),
    };
  });

  const { firstName, lastName, handle } = portfolioData.profile;

  return {
    locale,
    theme,
    activeProjectTag: ALL_TAG_KEY,
    cvModalOpen: false,
    emailCopied: false,
    nextZIndex: z + 1,
    focusedWindowId,
    windows,
    terminalLines: [
      {
        kind: 'accent',
        text: `${desktopConfig.osName} ${desktopConfig.osVersion} — ${firstName} ${lastName} (${handle})`,
      },
      {
        kind: 'out',
        text: portfolioData.ui[locale].os.terminalHint,
      },
    ],
    commandHistory: [],
  };
}

export function persistLocale(locale: Locale): void {
  localStorage.setItem(STORAGE_KEYS.locale, locale);
}

export function persistTheme(theme: ThemeMode): void {
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

export function focusWindow(state: OsState, id: WindowId): void {
  const win = state.windows[id];
  win.isOpen = true;
  win.isMinimized = false;
  win.zIndex = state.nextZIndex++;
  state.focusedWindowId = id;
}

function recomputeFocus(state: OsState): void {
  let topId: WindowId | null = null;
  let topZ = -1;

  (Object.keys(state.windows) as WindowId[]).forEach((id) => {
    const w = state.windows[id];
    if (w.isOpen && !w.isMinimized && w.zIndex > topZ) {
      topZ = w.zIndex;
      topId = id;
    }
  });

  state.focusedWindowId = topId;
}

export function closeWindow(state: OsState, id: WindowId): void {
  const win = state.windows[id];
  win.isOpen = false;
  win.isMinimized = false;
  win.isMaximized = false;
  if (state.focusedWindowId === id) {
    recomputeFocus(state);
  }
}

export function minimizeWindow(state: OsState, id: WindowId): void {
  const win = state.windows[id];
  if (!win.isOpen) return;
  win.isMinimized = true;
  if (state.focusedWindowId === id) {
    recomputeFocus(state);
  }
}

export function toggleMaximizeWindow(state: OsState, id: WindowId): void {
  const win = state.windows[id];
  win.isMaximized = !win.isMaximized;
  focusWindow(state, id);
}

export function toggleTaskbarWindow(state: OsState, id: WindowId): void {
  const win = state.windows[id];
  if (!win.isOpen || win.isMinimized || state.focusedWindowId !== id) {
    focusWindow(state, id);
  } else {
    minimizeWindow(state, id);
  }
}

export function updateWindowBounds(state: OsState, id: WindowId, bounds: WindowBounds): void {
  const def = desktopConfig.windows[id];
  state.windows[id].bounds = clampBoundsToViewport(bounds, def);
}

export function getOpenWindowsOrdered(state: OsState): WindowInstanceState[] {
  return (Object.keys(state.windows) as WindowId[])
    .map((id) => state.windows[id])
    .filter((w) => w.isOpen);
}

export interface TerminalCommandSideEffects {
  onOpenCv: () => void;
  onDirectPrint: () => void;
  onSetLocale: (locale: Locale) => void;
  onSetTheme: (theme: ThemeMode) => void;
}

export function runTerminalCommand(
  state: OsState,
  rawInput: string,
  effects: TerminalCommandSideEffects
): void {
  const trimmed = rawInput.trim();
  if (!trimmed) return;

  state.commandHistory.push(trimmed);
  state.terminalLines.push({ kind: 'cmd', text: `$ ${trimmed}` });

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const arg = parts[1]?.toLowerCase();
  const locale = state.locale;

  switch (cmd) {
    case 'help': {
      state.terminalLines.push(
        {
          kind: 'accent',
          text: locale === 'fr' ? 'Commandes disponibles :' : 'Available commands:',
        },
        {
          kind: 'out',
          text:
            '  help                 — ' +
            (locale === 'fr' ? 'Affiche cette aide' : 'Show this help'),
        },
        {
          kind: 'out',
          text:
            '  whoami | about       — ' +
            (locale === 'fr' ? 'Résumé du profil' : 'Profile summary'),
        },
        {
          kind: 'out',
          text:
            '  projects [tag]       — ' +
            (locale === 'fr'
              ? 'Liste les projets (ex: projects godot)'
              : 'List projects (e.g. projects godot)'),
        },
        {
          kind: 'out',
          text:
            '  skills               — ' +
            (locale === 'fr'
              ? 'Affiche les compétences Dev & Outillage'
              : 'Show Dev & Tooling skills'),
        },
        {
          kind: 'out',
          text:
            '  journey              — ' +
            (locale === 'fr' ? 'Parcours & formations' : 'Background & education'),
        },
        {
          kind: 'out',
          text:
            '  open <app|cv>        — ' +
            (locale === 'fr'
              ? 'Ouvre about, projects, skills, journey, cv'
              : 'Open about, projects, skills, journey, cv'),
        },
        {
          kind: 'out',
          text:
            '  lang <fr|en>         — ' +
            (locale === 'fr' ? 'Change la langue instantanément' : 'Switch language immediately'),
        },
        {
          kind: 'out',
          text:
            '  theme <dark|light>   — ' +
            (locale === 'fr' ? 'Bascule le thème du bureau' : 'Switch desktop theme'),
        },
        {
          kind: 'out',
          text:
            '  cv | print           — ' +
            (locale === 'fr' ? 'Ouvre / imprime le CV Classique A4' : 'Open / print Classic A4 CV'),
        },
        {
          kind: 'out',
          text:
            '  clear                — ' +
            (locale === 'fr' ? 'Efface le terminal' : 'Clear terminal'),
        }
      );
      break;
    }

    case 'whoami':
    case 'about': {
      const { firstName, lastName, handle, role, location, email } = portfolioData.profile;
      state.terminalLines.push(
        { kind: 'accent', text: `${firstName} ${lastName} (${handle}) — ${role[locale]}` },
        { kind: 'out', text: `${location[locale]} · ${email}` }
      );
      if (cmd === 'about') {
        focusWindow(state, 'about');
      }
      break;
    }

    case 'projects': {
      const filtered = arg
        ? portfolioData.projects.filter((p) =>
            p.tags.some((t) => t.toLowerCase().includes(arg))
          )
        : portfolioData.projects;

      if (filtered.length === 0) {
        state.terminalLines.push({
          kind: 'error',
          text:
            locale === 'fr'
              ? `Aucun projet trouvé pour le tag "${arg}".`
              : `No projects matching tag "${arg}".`,
        });
      } else {
        filtered.forEach((p) => {
          state.terminalLines.push({
            kind: 'out',
            text: `• [${p.year}] ${p.title[locale]} (${p.tags.join(', ')})`,
          });
        });
        if (arg) {
          const matchedTag = portfolioData.projects
            .flatMap((p) => p.tags)
            .find((t) => t.toLowerCase() === arg);
          if (matchedTag) {
            state.activeProjectTag = matchedTag;
          }
        }
      }
      break;
    }

    case 'skills': {
      portfolioData.skillCategories.forEach((cat) => {
        const names = cat.items.map((i) => i.name).join(', ');
        state.terminalLines.push({
          kind: 'out',
          text: `[${cat.title[locale]}] ${names}`,
        });
      });
      break;
    }

    case 'journey': {
      portfolioData.timeline.forEach((entry) => {
        state.terminalLines.push({
          kind: 'out',
          text: `• ${entry.period[locale]} — ${entry.role[locale]} @ ${entry.organization}`,
        });
      });
      break;
    }

    case 'open': {
      const validIds: WindowId[] = ['about', 'projects', 'skills', 'journey', 'terminal'];
      if (arg === 'cv') {
        effects.onOpenCv();
        state.terminalLines.push({
          kind: 'accent',
          text: locale === 'fr' ? 'Ouverture du CV Classique A4...' : 'Opening Classic A4 CV...',
        });
      } else if (arg && validIds.includes(arg as WindowId)) {
        focusWindow(state, arg as WindowId);
        state.terminalLines.push({
          kind: 'accent',
          text: `${locale === 'fr' ? 'Fenêtre activée' : 'Focused window'}: ${arg}`,
        });
      } else {
        state.terminalLines.push({
          kind: 'error',
          text: 'Usage: open <about|projects|skills|journey|terminal|cv>',
        });
      }
      break;
    }

    case 'lang': {
      if (arg === 'fr' || arg === 'en') {
        effects.onSetLocale(arg);
        state.terminalLines.push({
          kind: 'accent',
          text:
            arg === 'fr'
              ? 'Langue basculée en Français (FR).'
              : 'Language switched to English (EN).',
        });
      } else {
        state.terminalLines.push({ kind: 'error', text: 'Usage: lang <fr|en>' });
      }
      break;
    }

    case 'theme': {
      if (arg === 'dark' || arg === 'light') {
        effects.onSetTheme(arg);
        state.terminalLines.push({
          kind: 'accent',
          text: `Theme -> ${arg}`,
        });
      } else {
        state.terminalLines.push({ kind: 'error', text: 'Usage: theme <dark|light>' });
      }
      break;
    }

    case 'cv':
      effects.onOpenCv();
      state.terminalLines.push({
        kind: 'accent',
        text: locale === 'fr' ? 'Vue CV Classique A4 ouverte.' : 'Classic A4 CV view opened.',
      });
      break;

    case 'print':
      effects.onDirectPrint();
      state.terminalLines.push({
        kind: 'accent',
        text: locale === 'fr' ? 'Préparation de l’impression A4...' : 'Preparing A4 print view...',
      });
      break;

    case 'clear':
      state.terminalLines = [];
      break;

    default:
      state.terminalLines.push({
        kind: 'error',
        text:
          locale === 'fr'
            ? `Commande inconnue : "${cmd}". Tapez "help".`
            : `Command not found: "${cmd}". Type "help".`,
      });
  }
}
