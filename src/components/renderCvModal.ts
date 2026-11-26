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
    .join('<span class="cv-dot" aria-hidden="true">·</span>');

  const phoneHtml = cv.phone.trim() ? `<span>${escapeHtml(cv.phone)}</span>` : '';

  const experiencesHtml = cv.experiences
    .map(
      (exp) => {
        const organizationMeta = exp.organization.trim()
          ? `${escapeHtml(exp.organization)} · ${escapeHtml(exp.location[locale])}`
          : escapeHtml(exp.location[locale]);

        return `
      <div class="cv-entry">
        <div class="cv-entry__row">
          <span class="cv-entry__title">${escapeHtml(exp.role[locale])}</span>
          <span class="cv-entry__meta">${escapeHtml(exp.period[locale])}</span>
        </div>
        <div class="cv-entry__sub">${organizationMeta}</div>
        <ul class="cv-entry__bullets">
          ${exp.bullets[locale].map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>
      </div>
    `;
      }
    )
    .join('');

  const projectsHtml = cv.projects
    .map(
      (proj) => `
      <div class="cv-project-card">
        <div class="cv-project-card__title">${escapeHtml(proj.name[locale])}</div>
        <div class="cv-project-card__stack">${escapeHtml(proj.stack)}</div>
        <p class="cv-project-card__summary">${escapeHtml(proj.summary[locale])}</p>
        ${
          proj.linkText
            ? `<div class="cv-project-card__link">${escapeHtml(proj.linkText)}</div>`
            : ''
        }
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
          <span class="cv-entry__meta">${escapeHtml(edu.period[locale])}</span>
        </div>
        <div class="cv-entry__sub">${escapeHtml(edu.school)} · ${escapeHtml(edu.location[locale])}</div>
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

  const experienceSectionHtml =
    cv.experiences.length > 0
      ? `
          <section class="cv-section">
            <h2 class="cv-section__title">${escapeHtml(titles.experience)}</h2>
            <div class="cv-section__body cv-stack-md">${experiencesHtml}</div>
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
          <header class="cv-header">
            <div class="cv-header__identity">
              <p class="cv-header__eyebrow">${escapeHtml(cv.handle)}</p>
              <h1 class="cv-header__name">${escapeHtml(cv.fullName)}</h1>
              <p class="cv-header__headline">${escapeHtml(cv.headline[locale])}</p>
            </div>
            <address class="cv-header__right">
              <span>${escapeHtml(cv.location[locale])}</span>
              <a href="mailto:${escapeHtml(cv.email)}">${escapeHtml(cv.email)}</a>
              ${phoneHtml}
              <div class="cv-header__links">${linksHtml}</div>
            </address>
          </header>

          <div class="cv-layout">
            <main class="cv-main">
              <section class="cv-section cv-section--profile">
                <h2 class="cv-section__title">${escapeHtml(titles.summary)}</h2>
                <p class="cv-summary">${escapeHtml(cv.summary[locale])}</p>
              </section>

              ${experienceSectionHtml}

              <section class="cv-section">
                <h2 class="cv-section__title">${escapeHtml(titles.projects)}</h2>
                <div class="cv-projects-grid">${projectsHtml}</div>
              </section>
            </main>

            <aside class="cv-aside">
              <section class="cv-section">
                <h2 class="cv-section__title">${escapeHtml(titles.skills)}</h2>
                <div class="cv-skills-grid">${skillsHtml}</div>
              </section>

              <section class="cv-section">
                <h2 class="cv-section__title">${escapeHtml(titles.education)}</h2>
                <div class="cv-section__body cv-stack-md">${educationHtml}</div>
              </section>

              <section class="cv-section cv-footer-split">
                <div>
                  <h2 class="cv-section__title">${escapeHtml(titles.languages)}</h2>
                  <ul class="cv-lang-list">${languagesHtml}</ul>
                </div>
                <div>
                  <h2 class="cv-section__title">${escapeHtml(titles.interests)}</h2>
                  <p class="cv-interests">${escapeHtml(cv.interests[locale])}</p>
                </div>
              </section>
            </aside>
          </div>
        </article>
      </div>
    </div>
  `;
}
