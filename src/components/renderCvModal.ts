import type { CvData } from '../data/cvData';
import type { Locale, PortfolioData } from '../data/portfolioData';
import { escapeHtml } from '../utils/escape';
import { icons } from '../utils/icons';

export function renderCvModalHtml(
  cv: CvData,
  portfolio: PortfolioData,
  locale: Locale,
  isOpen: boolean
): string {
  const ui = portfolio.ui[locale];
  const titles = cv.sectionTitles[locale];

  const linksHtml = cv.links
    .map((link) =>
      link.href
        ? `<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`
        : `<span>${escapeHtml(link.label)}</span>`
    )
    .join('<span aria-hidden="true">·</span>');

  const phoneHtml = cv.phone.trim() ? `<span>${escapeHtml(cv.phone)}</span>` : '';

  const experiencesHtml = cv.experiences
    .map(
      (exp) => `
      <div class="cv-entry">
        <div class="cv-entry__row">
          <span class="cv-entry__title">${escapeHtml(exp.role[locale])}</span>
          <span class="cv-entry__period">${escapeHtml(exp.period[locale])}</span>
        </div>
        <div class="cv-entry__sub">${escapeHtml(exp.organization)} — ${escapeHtml(exp.location[locale])}</div>
        <ul class="cv-entry__bullets">
          ${exp.bullets[locale].map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>
      </div>
    `
    )
    .join('');

  const projectsHtml = cv.projects
    .map(
      (proj) => `
      <div class="cv-entry">
        <div class="cv-entry__row">
          <span class="cv-entry__title">${escapeHtml(proj.name[locale])}</span>
          <span class="cv-entry__period">${escapeHtml(proj.stack)}</span>
        </div>
        <p class="cv-entry__detail">
          ${escapeHtml(proj.summary[locale])}${
            proj.linkText ? ` — ${escapeHtml(proj.linkText)}` : ''
          }
        </p>
      </div>
    `
    )
    .join('');

  const educationHtml = cv.education
    .map(
      (edu) => `
      <div class="cv-entry">
        <div class="cv-entry__row">
          <span class="cv-entry__title">${escapeHtml(edu.degree[locale])}</span>
          <span class="cv-entry__period">${escapeHtml(edu.period[locale])}</span>
        </div>
        <div class="cv-entry__sub">${escapeHtml(edu.school)} — ${escapeHtml(edu.location[locale])}</div>
        <p class="cv-entry__detail">${escapeHtml(edu.details[locale])}</p>
      </div>
    `
    )
    .join('');

  const skillsHtml = cv.skills
    .map(
      (group) => `
      <div class="cv-skill-row">
        <span class="cv-skill-row__cat">${escapeHtml(group.category[locale])}</span>
        <span class="cv-skill-row__items">${escapeHtml(group.items)}</span>
      </div>
    `
    )
    .join('');

  const languagesHtml = cv.spokenLanguages
    .map(
      (lang) =>
        `<li><strong>${escapeHtml(lang.name[locale])} :</strong> ${escapeHtml(lang.level[locale])}</li>`
    )
    .join('');

  const experienceBlockHtml =
    cv.experiences.length > 0
      ? `
          <section class="cv-swiss-block">
            <div class="cv-swiss-block__label">${escapeHtml(titles.experience)}</div>
            <div class="cv-swiss-block__content">${experiencesHtml}</div>
          </section>
        `
      : '';

  return `
    <div
      class="cv-modal ${isOpen ? 'is-open' : ''}"
      role="dialog"
      aria-modal="true"
      aria-hidden="${isOpen ? 'false' : 'true'}"
      aria-label="${escapeHtml(ui.cvModal.title)}"
    >
      <div class="cv-modal__toolbar">
        <div class="cv-modal__title-group">
          <span class="cv-modal__badge">${escapeHtml(ui.cvModal.badge)}</span>
          <h2 class="cv-modal__title">${escapeHtml(ui.cvModal.title)}</h2>
        </div>

        <div class="cv-modal__actions">
          <button type="button" class="cv-toolbar-btn cv-toolbar-btn--ghost" data-action="toggle-lang">
            ${icons.globe}
            <span>${locale.toUpperCase()}</span>
          </button>
          <button type="button" class="cv-toolbar-btn cv-toolbar-btn--print" data-action="print-cv">
            ${icons.printer}
            <span>${escapeHtml(ui.actions.printCv)}</span>
          </button>
          <button type="button" class="cv-toolbar-btn cv-toolbar-btn--ghost" data-action="close-cv">
            ${icons.close}
            <span>${escapeHtml(ui.actions.closePreview)}</span>
          </button>
        </div>
      </div>

      <div class="cv-modal__viewport">
        <p class="cv-modal__hint">${escapeHtml(ui.cvModal.hint)}</p>

        <article class="cv-sheet" id="cv-a4-sheet">
          <header class="cv-swiss-header">
            <div>
              <h1 class="cv-swiss-header__name">${escapeHtml(cv.fullName)} <span class="cv-swiss-header__handle">(${escapeHtml(cv.handle)})</span></h1>
              <p class="cv-swiss-header__headline">${escapeHtml(cv.headline[locale])}</p>
            </div>
            <div class="cv-swiss-header__meta">
              <span>${escapeHtml(cv.location[locale])}</span>
              <a href="mailto:${escapeHtml(cv.email)}">${escapeHtml(cv.email)}</a>
              ${phoneHtml}
              <div class="cv-swiss-header__links">${linksHtml}</div>
            </div>
          </header>

          <section class="cv-swiss-block">
            <div class="cv-swiss-block__label">${escapeHtml(titles.summary)}</div>
            <div class="cv-swiss-block__content">
              <p class="cv-summary">${escapeHtml(cv.summary[locale])}</p>
            </div>
          </section>

          <section class="cv-swiss-block">
            <div class="cv-swiss-block__label">${escapeHtml(titles.skills)}</div>
            <div class="cv-swiss-block__content">
              <div class="cv-skills-table">${skillsHtml}</div>
            </div>
          </section>

          <section class="cv-swiss-block">
            <div class="cv-swiss-block__label">${escapeHtml(titles.projects)}</div>
            <div class="cv-swiss-block__content">${projectsHtml}</div>
          </section>

          <section class="cv-swiss-block">
            <div class="cv-swiss-block__label">${escapeHtml(titles.education)}</div>
            <div class="cv-swiss-block__content">${educationHtml}</div>
          </section>

          ${experienceBlockHtml}

          <section class="cv-swiss-block">
            <div class="cv-swiss-block__label">${escapeHtml(titles.languages)}</div>
            <div class="cv-swiss-block__content">
              <ul class="cv-lang-list">${languagesHtml}</ul>
              <p class="cv-entry__detail"><strong>${escapeHtml(titles.interests)} :</strong> ${escapeHtml(cv.interests[locale])}</p>
            </div>
          </section>
        </article>
      </div>
    </div>
  `;
}
