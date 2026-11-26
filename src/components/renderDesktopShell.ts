import { desktopConfig, type DesktopIconConfig, type WindowId } from '../data/desktopConfig';
import type { PortfolioData } from '../data/portfolioData';
import { getOpenWindowsOrdered, type OsState } from '../state/windowManager';
import { escapeHtml } from '../utils/escape';
import { getDesktopIcon, icons } from '../utils/icons';
import { renderWindowBody } from './windowContents';

export function formatClockParts(locale: OsState['locale'], now: Date): { time: string; date: string } {
  const tag = locale === 'fr' ? 'fr-FR' : 'en-US';
  return {
    time: now.toLocaleTimeString(tag, { hour: '2-digit', minute: '2-digit' }),
    date: now.toLocaleDateString(tag, { weekday: 'short', day: '2-digit', month: 'short' }),
  };
}

function renderDesktopIconItem(iconCfg: DesktopIconConfig, state: OsState): string {
  const { locale } = state;
  const isLangToggle = iconCfg.action.type === 'toggle-lang';
  const isExternalLink = iconCfg.action.type === 'open-social' || iconCfg.action.type === 'open-url';
  const windowId = iconCfg.action.type === 'open-window' ? iconCfg.action.windowId : null;
  const isWindowOpen = windowId ? state.windows[windowId].isOpen : false;

  const badgeHtml = isLangToggle
    ? `<span class="desktop-icon__lang-badge">${locale.toUpperCase()}</span>`
    : isExternalLink
      ? `<span class="desktop-icon__ext-badge" aria-hidden="true">${icons.external}</span>`
      : '';

  const runningDotHtml = isWindowOpen
    ? `<span class="desktop-icon__running-dot" aria-hidden="true"></span>`
    : '';

  return `
    <button
      type="button"
      class="desktop-icon"
      style="--col:${iconCfg.position.col}; --row:${iconCfg.position.row};"
      data-accent="${escapeHtml(iconCfg.accent)}"
      data-desktop-icon="${escapeHtml(iconCfg.id)}"
      aria-label="${escapeHtml(iconCfg.title[locale])}"
    >
      <span class="desktop-icon__tile">
        ${getDesktopIcon(iconCfg.icon)}
        ${badgeHtml}
        ${runningDotHtml}
      </span>
      <span class="desktop-icon__label">${escapeHtml(iconCfg.title[locale])}</span>
    </button>
  `;
}

function renderWindowShell(id: WindowId, data: PortfolioData, state: OsState): string {
  const winState = state.windows[id];
  if (!winState.isOpen) return '';

  const def = desktopConfig.windows[id];
  const { locale, focusedWindowId } = state;
  const ui = data.ui[locale];
  const isFocused = focusedWindowId === id && !winState.isMinimized;

  const classes = [
    'os-window',
    isFocused ? 'is-focused' : '',
    winState.isMinimized ? 'is-minimized' : '',
    winState.isMaximized ? 'is-maximized' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const styleAttr = `left:${winState.bounds.x}px; top:${winState.bounds.y}px; width:${winState.bounds.width}px; height:${winState.bounds.height}px; z-index:${winState.zIndex};`;

  return `
    <section
      class="${classes}"
      data-window-id="${escapeHtml(id)}"
      data-accent="${escapeHtml(def.accent)}"
      style="${styleAttr}"
      aria-label="${escapeHtml(def.title[locale])}"
    >
      <header class="os-window__header" data-drag-handle="${escapeHtml(id)}">
        <div class="os-window__title-wrap">
          <span class="os-window__app-icon">${getDesktopIcon(def.icon)}</span>
          <span class="os-window__title">${escapeHtml(def.title[locale])}</span>
        </div>

        <div class="os-window__controls">
          <button
            type="button"
            class="win-ctrl win-ctrl--min"
            data-win-action="minimize"
            data-window-target="${escapeHtml(id)}"
            title="${escapeHtml(ui.os.windowMinimize)}"
            aria-label="${escapeHtml(ui.os.windowMinimize)}"
          >
            ${icons.minimize}
          </button>
          <button
            type="button"
            class="win-ctrl win-ctrl--max"
            data-win-action="maximize"
            data-window-target="${escapeHtml(id)}"
            title="${escapeHtml(winState.isMaximized ? ui.os.windowRestore : ui.os.windowMaximize)}"
            aria-label="${escapeHtml(winState.isMaximized ? ui.os.windowRestore : ui.os.windowMaximize)}"
          >
            ${winState.isMaximized ? icons.restore : icons.maximize}
          </button>
          <button
            type="button"
            class="win-ctrl win-ctrl--close"
            data-win-action="close"
            data-window-target="${escapeHtml(id)}"
            title="${escapeHtml(ui.os.windowClose)}"
            aria-label="${escapeHtml(ui.os.windowClose)}"
          >
            ${icons.close}
          </button>
        </div>
      </header>

      <div class="os-window__body">
        ${renderWindowBody(id, data, state)}
      </div>

      <div class="os-window__resize" data-resize-handle="${escapeHtml(id)}" aria-hidden="true"></div>
    </section>
  `;
}

export function renderDesktopHtml(data: PortfolioData, state: OsState): string {
  const { locale, theme, focusedWindowId } = state;
  const ui = data.ui[locale];
  const { profile } = data;
  const clock = formatClockParts(locale, new Date());

  const iconsHtml = desktopConfig.icons
    .map((cfg) => renderDesktopIconItem(cfg, state))
    .join('');

  const windowsHtml = (Object.keys(desktopConfig.windows) as WindowId[])
    .map((id) => renderWindowShell(id, data, state))
    .join('');

  const openWindows = getOpenWindowsOrdered(state);
  const dockPillsHtml =
    openWindows.length > 0
      ? openWindows
          .map((w) => {
            const def = desktopConfig.windows[w.id];
            const isFocused = focusedWindowId === w.id && !w.isMinimized;
            const cls = [
              'dock-window-pill',
              isFocused ? 'is-focused' : '',
              w.isMinimized ? 'is-minimized' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return `
              <button
                type="button"
                class="${cls}"
                data-accent="${escapeHtml(def.accent)}"
                data-dock-window="${escapeHtml(w.id)}"
              >
                ${getDesktopIcon(def.icon)}
                <span>${escapeHtml(def.dockLabel[locale])}</span>
                <span class="dock-window-pill__dot" aria-hidden="true"></span>
              </button>
            `;
          })
          .join('')
      : `<span class="dock-empty">${escapeHtml(ui.os.noWindowsOpen)}</span>`;

  return `
    <div class="os-topbar" aria-hidden="true">
      <span class="os-topbar__dot"></span>
      <span>${escapeHtml(desktopConfig.osName)} ${escapeHtml(desktopConfig.osVersion)} · ${escapeHtml(profile.firstName)} ${escapeHtml(profile.lastName)} (${escapeHtml(profile.handle)})</span>
    </div>

    <main class="desktop-workspace">
      <section class="desktop-icons" aria-label="${escapeHtml(ui.os.desktopIconsAria)}">
        ${iconsHtml}
      </section>

      <section class="windows-layer" aria-label="${escapeHtml(ui.os.windowsLayerAria)}">
        ${windowsHtml}
      </section>
    </main>

    <footer class="os-dock" aria-label="${escapeHtml(ui.os.taskbarAria)}">
      <div class="os-dock__left">
        <button
          type="button"
          class="dock-brand"
          data-action="open-terminal"
          title="${escapeHtml(ui.os.terminalTooltip)}"
        >
          <span class="dock-brand__badge">${escapeHtml(profile.monogram)}</span>
          <span class="dock-brand__text">${escapeHtml(profile.handle)}</span>
        </button>

        <span class="dock-divider" aria-hidden="true"></span>

        ${dockPillsHtml}
      </div>

      <div class="os-dock__right">
        <button
          type="button"
          class="dock-btn"
          data-action="toggle-lang"
          title="${escapeHtml(ui.actions.switchLang)}"
          aria-label="${escapeHtml(ui.actions.switchLang)}"
        >
          ${icons.globe}
          <span>${locale.toUpperCase()}</span>
        </button>

        <button
          type="button"
          class="dock-btn"
          data-action="toggle-theme"
          title="${escapeHtml(ui.actions.toggleTheme)}"
          aria-label="${escapeHtml(ui.actions.toggleTheme)}"
        >
          ${theme === 'dark' ? icons.sun : icons.moon}
        </button>

        <button
          type="button"
          class="dock-btn dock-btn--cv"
          data-action="open-cv"
        >
          ${icons.printer}
          <span class="dock-btn__label-hide">${escapeHtml(ui.actions.generateCv)}</span>
        </button>

        <div class="dock-clock" aria-label="${escapeHtml(ui.os.clockAria)}">
          <span class="dock-clock__time" id="dock-clock-time">${escapeHtml(clock.time)}</span>
          <span class="dock-clock__date" id="dock-clock-date">${escapeHtml(clock.date)}</span>
        </div>
      </div>
    </footer>
  `;
}
