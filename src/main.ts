import './styles/main.scss';
import { renderCvModalHtml } from './components/renderCvModal';
import { formatClockParts, renderDesktopHtml } from './components/renderDesktopShell';
import { renderTerminalLinesHtml } from './components/windowContents';
import { buildCvData } from './data/cvData';
import { desktopConfig, type WindowBounds, type WindowId } from './data/desktopConfig';
import { portfolioData, type Locale } from './data/portfolioData';
import {
  ALL_TAG_KEY,
  closeWindow,
  createInitialOsState,
  focusWindow,
  minimizeWindow,
  persistLocale,
  persistTheme,
  runTerminalCommand,
  toggleMaximizeWindow,
  toggleTaskbarWindow,
  updateWindowBounds,
  type ThemeMode,
} from './state/windowManager';
import {
  createBackgroundScene,
  type BackgroundSceneController,
  type SceneAccent,
} from './three/backgroundScene';

const VALID_ACCENTS = new Set<SceneAccent>(['cyan', 'violet', 'emerald', 'rose', 'amber']);

const state = createInitialOsState();

const desktopRoot = document.getElementById('os-desktop');
const cvModalRoot = document.getElementById('cv-modal-root');
const bgCanvas = document.getElementById('bg-3d-canvas') as HTMLCanvasElement | null;

const bgScene: BackgroundSceneController | null = bgCanvas
  ? createBackgroundScene(bgCanvas, state.theme)
  : null;

let copyTimer: number | undefined;
let historyCursor = -1;

type DragInteraction =
  | {
      kind: 'drag';
      windowId: WindowId;
      el: HTMLElement;
      startMouseX: number;
      startMouseY: number;
      startBounds: WindowBounds;
    }
  | {
      kind: 'resize';
      windowId: WindowId;
      el: HTMLElement;
      startMouseX: number;
      startMouseY: number;
      startBounds: WindowBounds;
    };

let activeInteraction: DragInteraction | null = null;

function syncDocumentMeta(): void {
  const { firstName, lastName, handle, role } = portfolioData.profile;
  document.documentElement.lang = state.locale;
  document.documentElement.dataset.theme = state.theme;
  document.body.classList.toggle('is-cv-open', state.cvModalOpen);
  document.title = `${firstName} ${lastName} (${handle}) — ${desktopConfig.osName} · ${role[state.locale]}`;
}

function renderAll(preserveTerminalFocus = false): void {
  const terminalInput = document.getElementById('terminal-input') as HTMLInputElement | null;
  const shouldRestoreTerminalFocus =
    preserveTerminalFocus && document.activeElement === terminalInput;
  const savedInputValue = terminalInput?.value ?? '';

  syncDocumentMeta();

  if (desktopRoot) {
    desktopRoot.innerHTML = renderDesktopHtml(portfolioData, state);
  }

  if (cvModalRoot) {
    cvModalRoot.innerHTML = renderCvModalHtml(
      buildCvData(),
      portfolioData,
      state.locale,
      state.cvModalOpen
    );
  }

  const nextOutput = document.getElementById('terminal-output');
  if (nextOutput) {
    nextOutput.scrollTop = nextOutput.scrollHeight;
  }

  if (shouldRestoreTerminalFocus) {
    const nextInput = document.getElementById('terminal-input') as HTMLInputElement | null;
    if (nextInput) {
      nextInput.value = savedInputValue;
      nextInput.focus();
    }
  }
}

function setLocale(locale: Locale): void {
  state.locale = locale;
  persistLocale(locale);
  renderAll(true);
}

function toggleLocale(): void {
  setLocale(state.locale === 'fr' ? 'en' : 'fr');
}

function setTheme(theme: ThemeMode): void {
  state.theme = theme;
  persistTheme(theme);
  bgScene?.setTheme(theme);
  renderAll(true);
}

function toggleTheme(): void {
  setTheme(state.theme === 'dark' ? 'light' : 'dark');
}

function openCvModal(): void {
  state.cvModalOpen = true;
  bgScene?.setBoost(false);
  bgScene?.setAccent(null);
  bgScene?.setPaused(true);
  renderAll();
}

function closeCvModal(): void {
  state.cvModalOpen = false;
  bgScene?.setPaused(false);
  renderAll();
}

function triggerDirectPrint(): void {
  openCvModal();
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      window.print();
    });
  });
}

async function copyEmail(): Promise<void> {
  try {
    await navigator.clipboard.writeText(portfolioData.profile.email);
  } catch {
    // Fallback silencieux si l'API Clipboard est restreinte
  }
  state.emailCopied = true;
  renderAll();
  window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(() => {
    state.emailCopied = false;
    renderAll();
  }, 2200);
}

function syncFocusStylesOnly(): void {
  document.querySelectorAll<HTMLElement>('.os-window').forEach((winEl) => {
    const id = winEl.dataset.windowId as WindowId | undefined;
    if (!id) return;
    const winState = state.windows[id];
    winEl.style.zIndex = String(winState.zIndex);
    winEl.classList.toggle(
      'is-focused',
      state.focusedWindowId === id && !winState.isMinimized
    );
  });

  document.querySelectorAll<HTMLElement>('[data-dock-window]').forEach((pillEl) => {
    const id = pillEl.dataset.dockWindow as WindowId | undefined;
    if (!id) return;
    const winState = state.windows[id];
    pillEl.classList.toggle(
      'is-focused',
      state.focusedWindowId === id && !winState.isMinimized
    );
    pillEl.classList.toggle('is-minimized', winState.isMinimized);
  });
}

function openExternalUrl(url: string): void {
  const cleanUrl = url.trim();
  if (!cleanUrl) return;
  if (cleanUrl.startsWith('mailto:')) {
    window.location.href = cleanUrl;
    return;
  }
  window.open(cleanUrl, '_blank', 'noopener,noreferrer');
}

function executeIconAction(iconId: string): void {
  const cfg = desktopConfig.icons.find((item) => item.id === iconId);
  if (!cfg) return;

  switch (cfg.action.type) {
    case 'open-window':
      focusWindow(state, cfg.action.windowId);
      renderAll();
      if (cfg.action.windowId === 'terminal') {
        (document.getElementById('terminal-input') as HTMLInputElement | null)?.focus();
      }
      break;
    case 'toggle-lang':
      toggleLocale();
      break;
    case 'open-cv':
      openCvModal();
      break;
    case 'open-social': {
      const socialId = cfg.action.socialId;
      const social = portfolioData.socialLinks.find((item) => item.id === socialId);
      if (social) openExternalUrl(social.url);
      break;
    }
    case 'open-url':
      openExternalUrl(cfg.action.url);
      break;
  }
}

function executeTerminal(rawCmd: string): void {
  const beforeOpen = state.windows.terminal.isOpen;
  let needsFullRerender = false;

  runTerminalCommand(state, rawCmd, {
    onOpenCv: () => {
      openCvModal();
      needsFullRerender = true;
    },
    onDirectPrint: () => {
      triggerDirectPrint();
      needsFullRerender = true;
    },
    onSetLocale: (loc) => {
      state.locale = loc;
      persistLocale(loc);
      needsFullRerender = true;
    },
    onSetTheme: (theme) => {
      state.theme = theme;
      persistTheme(theme);
      bgScene?.setTheme(theme);
      needsFullRerender = true;
    },
  });

  historyCursor = state.commandHistory.length;

  const lower = rawCmd.trim().toLowerCase();
  if (
    needsFullRerender ||
    lower.startsWith('open ') ||
    lower.startsWith('projects ') ||
    lower === 'about' ||
    !beforeOpen
  ) {
    renderAll(true);
    const inputEl = document.getElementById('terminal-input') as HTMLInputElement | null;
    if (inputEl) {
      inputEl.value = '';
      if (!state.cvModalOpen) inputEl.focus();
    }
    return;
  }

  const outputEl = document.getElementById('terminal-output');
  if (outputEl) {
    outputEl.innerHTML = renderTerminalLinesHtml(state);
    outputEl.scrollTop = outputEl.scrollHeight;
  }
  const inputEl = document.getElementById('terminal-input') as HTMLInputElement | null;
  if (inputEl) {
    inputEl.value = '';
    inputEl.focus();
  }
}

function parseAccent(value: string | undefined): SceneAccent | null {
  if (value && VALID_ACCENTS.has(value as SceneAccent)) {
    return value as SceneAccent;
  }
  return null;
}

function handlePointerOver(event: PointerEvent): void {
  if (state.cvModalOpen || !bgScene) return;
  const target = event.target as HTMLElement | null;
  if (!target) return;

  const hoverTarget = target.closest<HTMLElement>(
    '.project-card, .telemetry-panel, .desktop-icon, .os-window'
  );
  if (!hoverTarget) return;

  bgScene.setAccent(parseAccent(hoverTarget.dataset.accent));
  bgScene.setBoost(
    hoverTarget.classList.contains('project-card') ||
      hoverTarget.classList.contains('telemetry-panel') ||
      hoverTarget.classList.contains('desktop-icon')
  );
}

function handlePointerOut(event: PointerEvent): void {
  if (!bgScene) return;
  const related = event.relatedTarget as HTMLElement | null;
  const stillInside = related?.closest?.(
    '.project-card, .telemetry-panel, .desktop-icon, .os-window'
  );
  if (!stillInside) {
    bgScene.setAccent(null);
    bgScene.setBoost(false);
  }
}

function handlePointerDown(event: PointerEvent): void {
  if (state.cvModalOpen) return;
  const target = event.target as HTMLElement | null;
  if (!target) return;

  if (target.closest('[data-win-action]')) {
    return;
  }

  const windowEl = target.closest<HTMLElement>('.os-window');
  if (windowEl) {
    const winId = windowEl.dataset.windowId as WindowId | undefined;
    if (winId && state.focusedWindowId !== winId) {
      focusWindow(state, winId);
      syncFocusStylesOnly();
    }
  }

  if (window.innerWidth <= 760) return;

  const resizeHandle = target.closest<HTMLElement>('[data-resize-handle]');
  if (resizeHandle) {
    const winId = resizeHandle.dataset.resizeHandle as WindowId | undefined;
    if (!winId || state.windows[winId].isMaximized) return;
    const el = resizeHandle.closest<HTMLElement>('.os-window');
    if (!el) return;
    el.classList.add('is-dragging');
    activeInteraction = {
      kind: 'resize',
      windowId: winId,
      el,
      startMouseX: event.clientX,
      startMouseY: event.clientY,
      startBounds: { ...state.windows[winId].bounds },
    };
    return;
  }

  const dragHandle = target.closest<HTMLElement>('[data-drag-handle]');
  if (dragHandle) {
    const winId = dragHandle.dataset.dragHandle as WindowId | undefined;
    if (!winId || state.windows[winId].isMaximized) return;
    const el = dragHandle.closest<HTMLElement>('.os-window');
    if (!el) return;
    el.classList.add('is-dragging');
    activeInteraction = {
      kind: 'drag',
      windowId: winId,
      el,
      startMouseX: event.clientX,
      startMouseY: event.clientY,
      startBounds: { ...state.windows[winId].bounds },
    };
  }
}

function handlePointerMove(event: PointerEvent): void {
  if (!activeInteraction) return;

  const dx = event.clientX - activeInteraction.startMouseX;
  const dy = event.clientY - activeInteraction.startMouseY;
  const def = desktopConfig.windows[activeInteraction.windowId];
  const vw = window.innerWidth;
  const vh = window.innerHeight - 72;

  if (activeInteraction.kind === 'drag') {
    const nextX = Math.min(
      Math.max(activeInteraction.startBounds.x + dx, 8),
      Math.max(8, vw - activeInteraction.startBounds.width - 8)
    );
    const nextY = Math.min(
      Math.max(activeInteraction.startBounds.y + dy, 8),
      Math.max(8, vh - 48)
    );
    activeInteraction.el.style.left = `${nextX}px`;
    activeInteraction.el.style.top = `${nextY}px`;
    updateWindowBounds(state, activeInteraction.windowId, {
      ...activeInteraction.startBounds,
      x: nextX,
      y: nextY,
    });
  } else {
    const nextW = Math.min(
      Math.max(activeInteraction.startBounds.width + dx, def.minWidth),
      vw - activeInteraction.startBounds.x - 10
    );
    const nextH = Math.min(
      Math.max(activeInteraction.startBounds.height + dy, def.minHeight),
      vh - activeInteraction.startBounds.y - 10
    );
    activeInteraction.el.style.width = `${nextW}px`;
    activeInteraction.el.style.height = `${nextH}px`;
    updateWindowBounds(state, activeInteraction.windowId, {
      ...activeInteraction.startBounds,
      width: nextW,
      height: nextH,
    });
  }
}

function handlePointerUp(): void {
  if (!activeInteraction) return;
  activeInteraction.el.classList.remove('is-dragging');
  activeInteraction = null;
}

function handleDocumentClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null;
  if (!target) return;

  const winCtrl = target.closest<HTMLElement>('[data-win-action]');
  if (winCtrl) {
    const action = winCtrl.dataset.winAction;
    const winId = winCtrl.dataset.windowTarget as WindowId | undefined;
    if (!winId) return;

    if (action === 'close') closeWindow(state, winId);
    if (action === 'minimize') minimizeWindow(state, winId);
    if (action === 'maximize') toggleMaximizeWindow(state, winId);
    renderAll();
    return;
  }

  const iconEl = target.closest<HTMLElement>('[data-desktop-icon]');
  if (iconEl && desktopConfig.iconTrigger === 'single') {
    const iconId = iconEl.dataset.desktopIcon;
    if (iconId) executeIconAction(iconId);
    return;
  }

  const dockPill = target.closest<HTMLElement>('[data-dock-window]');
  if (dockPill) {
    const winId = dockPill.dataset.dockWindow as WindowId | undefined;
    if (winId) {
      toggleTaskbarWindow(state, winId);
      renderAll();
    }
    return;
  }

  const filterBtn = target.closest<HTMLElement>('[data-filter-tag]');
  if (filterBtn) {
    state.activeProjectTag = filterBtn.dataset.filterTag ?? ALL_TAG_KEY;
    renderAll();
    return;
  }

  const termChip = target.closest<HTMLElement>('[data-terminal-cmd]');
  if (termChip) {
    const cmd = termChip.dataset.terminalCmd;
    if (cmd) executeTerminal(cmd);
    return;
  }

  const actionEl = target.closest<HTMLElement>('[data-action]');
  if (actionEl) {
    switch (actionEl.dataset.action) {
      case 'toggle-lang':
        toggleLocale();
        break;
      case 'toggle-theme':
        toggleTheme();
        break;
      case 'open-cv':
        openCvModal();
        break;
      case 'close-cv':
        closeCvModal();
        break;
      case 'print-cv':
        window.print();
        break;
      case 'copy-email':
        void copyEmail();
        break;
      case 'open-terminal':
        focusWindow(state, 'terminal');
        renderAll();
        (document.getElementById('terminal-input') as HTMLInputElement | null)?.focus();
        break;
    }
    return;
  }

  if (state.cvModalOpen && target.classList.contains('cv-modal__viewport')) {
    closeCvModal();
  }
}

function handleDocumentDoubleClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null;
  if (!target) return;

  const iconEl = target.closest<HTMLElement>('[data-desktop-icon]');
  if (iconEl && desktopConfig.iconTrigger === 'double') {
    const iconId = iconEl.dataset.desktopIcon;
    if (iconId) executeIconAction(iconId);
    return;
  }

  const headerEl = target.closest<HTMLElement>('[data-drag-handle]');
  if (headerEl && !target.closest('[data-win-action]')) {
    const winId = headerEl.dataset.dragHandle as WindowId | undefined;
    if (winId) {
      toggleMaximizeWindow(state, winId);
      renderAll();
    }
  }
}

function handleSubmit(event: SubmitEvent): void {
  const form = event.target as HTMLFormElement | null;
  if (!form || form.id !== 'terminal-form') return;
  event.preventDefault();

  const input = document.getElementById('terminal-input') as HTMLInputElement | null;
  if (!input) return;
  executeTerminal(input.value);
}

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && state.cvModalOpen) {
    closeCvModal();
    return;
  }

  const activeEl = document.activeElement as HTMLElement | null;
  if (activeEl?.id === 'terminal-input') {
    const input = activeEl as HTMLInputElement;
    if (event.key === 'ArrowUp' && state.commandHistory.length > 0) {
      event.preventDefault();
      historyCursor = Math.max(
        0,
        historyCursor === -1 ? state.commandHistory.length - 1 : historyCursor - 1
      );
      input.value = state.commandHistory[historyCursor] ?? '';
    } else if (event.key === 'ArrowDown' && state.commandHistory.length > 0) {
      event.preventDefault();
      historyCursor = Math.min(state.commandHistory.length, historyCursor + 1);
      input.value = state.commandHistory[historyCursor] ?? '';
    }
  }
}

const clockTimer = window.setInterval(() => {
  const timeEl = document.getElementById('dock-clock-time');
  const dateEl = document.getElementById('dock-clock-date');
  if (!timeEl || !dateEl) return;
  const parts = formatClockParts(state.locale, new Date());
  timeEl.textContent = parts.time;
  dateEl.textContent = parts.date;
}, 15000);

desktopRoot?.addEventListener('pointerover', handlePointerOver);
desktopRoot?.addEventListener('pointerout', handlePointerOut);
document.addEventListener('pointerdown', handlePointerDown);
window.addEventListener('pointermove', handlePointerMove);
window.addEventListener('pointerup', handlePointerUp);
document.addEventListener('click', handleDocumentClick);
document.addEventListener('dblclick', handleDocumentDoubleClick);
document.addEventListener('submit', handleSubmit);
document.addEventListener('keydown', handleKeyDown);
window.addEventListener('pagehide', () => {
  window.clearInterval(clockTimer);
  bgScene?.destroy();
});

renderAll();
