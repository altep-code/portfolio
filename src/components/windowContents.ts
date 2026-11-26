import { desktopConfig, type WindowId } from '../data/desktopConfig';
import type {
  Locale,
  PortfolioData,
  ProjectItem,
  SkillLevel,
  TimelineEntry,
} from '../data/portfolioData';
import { ALL_TAG_KEY, type OsState } from '../state/windowManager';
import { escapeHtml } from '../utils/escape';
import { getCategoryIcon, getSocialIcon, icons } from '../utils/icons';

function renderProjectLinkSlot(
  url: string | undefined,
  activeLabel: string,
  reservedLabel: string,
  iconSvg: string
): string {
  const cleanUrl = url?.trim();
  if (cleanUrl) {
    return `
      <a class="link-slot link-slot--active" href="${escapeHtml(cleanUrl)}" target="_blank" rel="noopener noreferrer">
        ${iconSvg}
        <span>${escapeHtml(activeLabel)}</span>
      </a>
    `;
  }

  return `
    <span class="link-slot link-slot--reserved" aria-disabled="true">
      ${icons.clock}
      <span>${escapeHtml(reservedLabel)}</span>
    </span>
  `;
}

function renderProjectCard(project: ProjectItem, locale: Locale, data: PortfolioData): string {
  const t = data.ui[locale].projects;
  const featuredBadge = project.featured
    ? `<span class="project-card__featured">${escapeHtml(t.featuredBadge)}</span>`
    : '';

  const docsUrl = project.links.docs?.trim();
  const docsHtml = docsUrl
    ? `
      <a class="link-slot link-slot--active link-slot--full" href="${escapeHtml(docsUrl)}" target="_blank" rel="noopener noreferrer">
        ${icons.external}
        <span>${escapeHtml(t.docsLabel)}</span>
      </a>
    `
    : '';

  return `
    <article class="project-card" data-accent="${escapeHtml(project.accent)}">
      <div class="project-card__meta">
        <span>${escapeHtml(project.year)}</span>
        <div class="project-card__badges">
          ${featuredBadge}
          <span class="project-card__status">${escapeHtml(project.status[locale])}</span>
        </div>
      </div>
      <h3 class="project-card__title">${escapeHtml(project.title[locale])}</h3>
      <p class="project-card__tagline">${escapeHtml(project.tagline[locale])}</p>
      <p class="project-card__desc">${escapeHtml(project.description[locale])}</p>
      <ul class="project-card__highlights">
        ${project.highlights[locale].map((h) => `<li>${escapeHtml(h)}</li>`).join('')}
      </ul>
      <div class="project-card__tags">
        ${project.tags.map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join('')}
      </div>
      <div class="project-card__links">
        ${renderProjectLinkSlot(project.links.github, t.githubLabel, t.githubReserved, icons.github)}
        ${renderProjectLinkSlot(project.links.demo, t.demoLabel, t.demoReserved, icons.external)}
        ${docsHtml}
      </div>
    </article>
  `;
}

function renderAboutWindow(data: PortfolioData, state: OsState): string {
  const { locale, emailCopied } = state;
  const { profile } = data;
  const ui = data.ui[locale];
  const fullName = `${profile.firstName} ${profile.lastName}`;

  const highlightsHtml = profile.highlights
    .map(
      (h) => `
      <div class="stat-tile">
        <span class="stat-tile__val">${escapeHtml(h.value)}</span>
        <span class="stat-tile__label">${escapeHtml(h.label[locale])}</span>
      </div>
    `
    )
    .join('');

  const linksHtml = data.socialLinks
    .filter((link) => link.showInContact !== false && link.url.trim().length > 0)
    .map((link) => {
      const isMail = link.url.startsWith('mailto:');
      const extraAttrs = isMail ? '' : ' target="_blank" rel="noopener noreferrer"';
      return `
      <a class="contact-link-tile" href="${escapeHtml(link.url)}"${extraAttrs}>
        ${getSocialIcon(link.icon)}
        <div>
          <span class="contact-link-tile__label">${escapeHtml(link.label[locale])}</span>
          <span class="contact-link-tile__handle">${escapeHtml(link.handle)}</span>
        </div>
      </a>
    `;
    })
    .join('');

  return `
    <div class="about-app">
      <div class="inspector-bar">
        <span class="inspector-bar__path">${escapeHtml(ui.os.inspectorProfilePath)}</span>
        <span>${escapeHtml(profile.location[locale])} · ${escapeHtml(profile.email)}</span>
      </div>

      <div class="about-app__hero">
        <div class="about-app__identity">
          <div class="about-app__avatar">${escapeHtml(profile.monogram)}</div>
          <div>
            <h2 class="about-app__name">${escapeHtml(fullName)} <span class="about-app__handle">@${escapeHtml(profile.handle)}</span></h2>
            <p class="about-app__role">${escapeHtml(profile.role[locale])}</p>
          </div>
        </div>
        <div class="availability-pill">
          <span class="pulse-dot"></span>
          <span>${escapeHtml(profile.availability[locale])}</span>
        </div>
      </div>

      <h3 class="about-app__headline">${escapeHtml(profile.heroHeadline[locale])}</h3>
      <p class="about-app__bio">${escapeHtml(profile.heroBio[locale])}</p>

      <div class="about-app__stats">${highlightsHtml}</div>

      <div class="about-app__actions">
        <button type="button" class="btn btn--primary" data-action="open-cv">
          ${icons.printer}
          <span>${escapeHtml(ui.actions.generateCv)}</span>
        </button>
        <a class="btn btn--glass" href="mailto:${escapeHtml(profile.email)}">
          ${icons.mail}
          <span>${escapeHtml(ui.actions.contactMe)}</span>
        </a>
        <button type="button" class="btn btn--glass" data-action="copy-email">
          ${emailCopied ? icons.check : icons.copy}
          <span>${escapeHtml(emailCopied ? ui.actions.emailCopied : ui.actions.copyEmail)}</span>
        </button>
      </div>

      <div class="about-app__links">${linksHtml}</div>
    </div>
  `;
}

function renderProjectsWindow(data: PortfolioData, state: OsState): string {
  const { locale, activeProjectTag } = state;
  const ui = data.ui[locale];

  const tags = Array.from(new Set(data.projects.flatMap((p) => p.tags)));
  const filterHtml = [
    `<button type="button" class="filter-pill ${activeProjectTag === ALL_TAG_KEY ? 'is-active' : ''}" data-filter-tag="${ALL_TAG_KEY}">${escapeHtml(ui.projects.allFilter)}</button>`,
    ...tags.map(
      (tag) =>
        `<button type="button" class="filter-pill ${activeProjectTag === tag ? 'is-active' : ''}" data-filter-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`
    ),
  ].join('');

  const filtered =
    activeProjectTag === ALL_TAG_KEY
      ? data.projects
      : data.projects.filter((p) => p.tags.includes(activeProjectTag));

  const cardsHtml =
    filtered.length > 0
      ? filtered.map((p) => renderProjectCard(p, locale, data)).join('')
      : `<p>${escapeHtml(ui.projects.emptyState)}</p>`;

  return `
    <div>
      <div class="inspector-bar">
        <span class="inspector-bar__path">${escapeHtml(ui.os.inspectorProjectsPath)}</span>
        <span>${filtered.length} / ${data.projects.length} ${escapeHtml(ui.os.inspectorProjectsCountUnit)}</span>
      </div>
      <div class="filter-bar" role="group" aria-label="${escapeHtml(ui.sections.projectsTitle)}">${filterHtml}</div>
      <div class="projects-grid">${cardsHtml}</div>
    </div>
  `;
}

function levelPercent(level: SkillLevel): number {
  switch (level) {
    case 'core':
      return 94;
    case 'advanced':
      return 80;
    case 'proficient':
      return 66;
  }
}

function renderSkillsWindow(data: PortfolioData, state: OsState): string {
  const { locale } = state;
  const ui = data.ui[locale];

  const totalSkills = data.skillCategories.reduce((sum, cat) => sum + cat.items.length, 0);
  const coreSkills = data.skillCategories.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.level === 'core').length,
    0
  );

  const panelsHtml = data.skillCategories
    .map((cat) => {
      const metersHtml = cat.items
        .map(
          (skill) => `
          <div class="telemetry-meter">
            <div class="telemetry-meter__row">
              <span>${escapeHtml(skill.name)}</span>
              <span class="telemetry-meter__badge">${escapeHtml(skill.level)}</span>
            </div>
            <div class="telemetry-meter__track">
              <div class="telemetry-meter__fill" style="width:${levelPercent(skill.level)}%"></div>
            </div>
            ${
              skill.note
                ? `<span class="telemetry-meter__note">${escapeHtml(skill.note[locale])}</span>`
                : ''
            }
          </div>
        `
        )
        .join('');

      return `
        <section class="telemetry-panel" data-accent="${escapeHtml(cat.accent)}">
          <div class="telemetry-panel__head">
            <div class="telemetry-panel__icon">${getCategoryIcon(cat.icon)}</div>
            <div>
              <h3 class="telemetry-panel__title">${escapeHtml(cat.title[locale])}</h3>
              <p class="telemetry-panel__sub">${escapeHtml(cat.subtitle[locale])}</p>
            </div>
          </div>
          ${metersHtml}
        </section>
      `;
    })
    .join('');

  return `
    <div>
      <div class="inspector-bar">
        <span class="inspector-bar__path">${escapeHtml(ui.os.inspectorSkillsPath)}</span>
        <span>${data.skillCategories.length} ${escapeHtml(ui.os.inspectorSkillsCountUnit)}</span>
      </div>
      <div class="telemetry-kpis">
        <div class="telemetry-kpi">
          <span class="telemetry-kpi__label">${escapeHtml(ui.os.telemetryTotal)}</span>
          <span class="telemetry-kpi__value">${totalSkills}</span>
        </div>
        <div class="telemetry-kpi">
          <span class="telemetry-kpi__label">${escapeHtml(ui.os.telemetryCore)}</span>
          <span class="telemetry-kpi__value">${coreSkills}</span>
        </div>
        <div class="telemetry-kpi">
          <span class="telemetry-kpi__label">${escapeHtml(ui.os.telemetryReady)}</span>
          <span class="telemetry-kpi__value">${escapeHtml(ui.os.telemetryOnlineValue)}</span>
        </div>
      </div>

      <div class="telemetry-grid">${panelsHtml}</div>
    </div>
  `;
}

function renderTimelineCard(entry: TimelineEntry, locale: Locale): string {
  return `
    <article class="timeline-card">
      <div class="timeline-card__top">
        <h4 class="timeline-card__role">${escapeHtml(entry.role[locale])}</h4>
        <span class="timeline-card__period">${escapeHtml(entry.period[locale])}</span>
      </div>
      <p class="timeline-card__org">${escapeHtml(entry.organization)} · ${escapeHtml(entry.location[locale])}</p>
      <p class="timeline-card__summary">${escapeHtml(entry.summary[locale])}</p>
      <ul class="timeline-card__bullets">
        ${entry.bullets[locale].map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
      </ul>
      <div class="timeline-card__tags">
        ${entry.tags.map((t) => `<span class="tag-chip">${escapeHtml(t)}</span>`).join('')}
      </div>
    </article>
  `;
}

function renderJourneyWindow(data: PortfolioData, state: OsState): string {
  const { locale } = state;
  const ui = data.ui[locale];

  const expHtml = data.timeline
    .filter((i) => i.kind === 'experience')
    .map((i) => renderTimelineCard(i, locale))
    .join('');

  const eduHtml = data.timeline
    .filter((i) => i.kind === 'education')
    .map((i) => renderTimelineCard(i, locale))
    .join('');

  return `
    <div>
      <div class="inspector-bar">
        <span class="inspector-bar__path">${escapeHtml(ui.os.inspectorJourneyPath)}</span>
        <span>${data.timeline.length} ${escapeHtml(ui.os.inspectorJourneyCountUnit)}</span>
      </div>
      <div class="journey-split">
        <div class="journey-col">
          <h3 class="journey-col__title">${icons.graduation}<span>${escapeHtml(ui.sections.educationLabel)}</span></h3>
          ${eduHtml}
        </div>
        <div class="journey-col">
          <h3 class="journey-col__title">${icons.briefcase}<span>${escapeHtml(ui.sections.experienceLabel)}</span></h3>
          ${expHtml}
        </div>
      </div>
    </div>
  `;
}

export function renderTerminalLinesHtml(state: OsState): string {
  return state.terminalLines
    .map((line) => {
      const cls =
        line.kind === 'cmd'
          ? 'terminal-line terminal-line--cmd'
          : line.kind === 'accent'
            ? 'terminal-line terminal-line--accent'
            : line.kind === 'error'
              ? 'terminal-line terminal-line--error'
              : 'terminal-line';
      return `<div class="${cls}">${escapeHtml(line.text)}</div>`;
    })
    .join('');
}

function renderTerminalWindow(data: PortfolioData, state: OsState): string {
  const ui = data.ui[state.locale];
  const langToggleCmd = `lang ${state.locale === 'fr' ? 'en' : 'fr'}`;
  const quickCommands = [
    ...desktopConfig.terminalQuickCommands.map((item) => item.cmd),
    langToggleCmd,
  ];

  return `
    <div class="terminal-app">
      <div class="terminal-quick">
        ${quickCommands
          .map(
            (cmd) =>
              `<button type="button" class="terminal-chip" data-terminal-cmd="${escapeHtml(cmd)}">${escapeHtml(cmd)}</button>`
          )
          .join('')}
      </div>

      <div class="terminal-output" id="terminal-output">
        ${renderTerminalLinesHtml(state)}
      </div>

      <form class="terminal-form" id="terminal-form" autocomplete="off">
        <span class="terminal-prompt">${escapeHtml(data.profile.handle)}@fedora:~$</span>
        <input
          type="text"
          id="terminal-input"
          class="terminal-input"
          placeholder="${escapeHtml(ui.os.terminalPlaceholder)}"
          aria-label="${escapeHtml(ui.os.terminalPlaceholder)}"
        />
      </form>
    </div>
  `;
}

export function renderWindowBody(windowId: WindowId, data: PortfolioData, state: OsState): string {
  switch (windowId) {
    case 'about':
      return renderAboutWindow(data, state);
    case 'projects':
      return renderProjectsWindow(data, state);
    case 'skills':
      return renderSkillsWindow(data, state);
    case 'journey':
      return renderJourneyWindow(data, state);
    case 'terminal':
      return renderTerminalWindow(data, state);
  }
}
