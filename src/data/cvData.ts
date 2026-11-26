/**
 * ============================================================================
 * CLASSIC A4 CV DATA (SYNCHRONISÉ AVEC `portfolioData.ts`)
 * ============================================================================
 * Le CV A4 réutilise automatiquement le profil, les liens, les compétences,
 * les 4 projets et le parcours depuis `src/data/portfolioData.ts`.
 *
 * Les descriptions sont calibrées pour rester aérées et lisibles sur 1 page A4.
 */

import { portfolioData, type Locale, type LocalizedList, type LocalizedText } from './portfolioData';

export interface CvContactItem {
  label: string;
  href?: string;
}

export interface CvSkillGroup {
  category: LocalizedText;
  items: string;
}

export interface CvExperienceItem {
  role: LocalizedText;
  organization: string;
  location: LocalizedText;
  period: LocalizedText;
  bullets: LocalizedList;
}

export interface CvEducationItem {
  degree: LocalizedText;
  school: string;
  location: LocalizedText;
  period: LocalizedText;
  details: LocalizedText;
}

export interface CvProjectItem {
  name: LocalizedText;
  stack: string;
  summary: LocalizedText;
  linkText?: string;
}

export interface CvLanguageSkill {
  name: LocalizedText;
  level: LocalizedText;
}

export interface CvData {
  fullName: string;
  handle: string;
  headline: LocalizedText;
  location: LocalizedText;
  email: string;
  phone: string;
  links: CvContactItem[];
  summary: LocalizedText;
  sectionTitles: Record<
    Locale,
    {
      summary: string;
      experience: string;
      projects: string;
      education: string;
      skills: string;
      languages: string;
      interests: string;
    }
  >;
  experiences: CvExperienceItem[];
  projects: CvProjectItem[];
  education: CvEducationItem[];
  skills: CvSkillGroup[];
  spokenLanguages: CvLanguageSkill[];
  interests: LocalizedText;
}

function formatLinkText(url: string | undefined): string | undefined {
  const clean = url?.trim();
  if (!clean) return undefined;
  return clean.replace(/^https?:\/\//, '');
}

/**
 * Résumés courants du CV : ils utilisent directement les descriptions du
 * portfolio afin qu'ajout, modification ou retrait d'un projet reste cohérent.
 */

export function buildCvData(): CvData {
  const { profile, socialLinks, skillCategories, projects, timeline } = portfolioData;

  return {
    fullName: `${profile.firstName} ${profile.lastName}`,
    handle: profile.handle,
    headline: profile.role,
    location: profile.location,
    email: profile.email,
    // EDIT HERE: Ajoutez votre numéro de téléphone si souhaité (ou laissez "" pour masquer)
    phone: '',
    links: socialLinks
      .filter((link) => link.id !== 'contact' && link.url.trim().length > 0)
      .map((link) => ({
        label: link.handle,
        href: link.url,
      })),
    summary: profile.heroBio,
    sectionTitles: {
      fr: {
        summary: 'Profil',
        experience: 'Expériences',
        projects: 'Projets Principaux',
        education: 'Formation',
        skills: 'Compétences Techniques',
        languages: 'Langues',
        interests: 'Centres d’intérêt',
      },
      en: {
        summary: 'Profile',
        experience: 'Experience',
        projects: 'Core Projects',
        education: 'Education',
        skills: 'Technical Skills',
        languages: 'Languages',
        interests: 'Interests',
      },
    },
    skills: skillCategories.map((cat) => ({
      category: cat.title,
      items: cat.items.map((item) => item.name).join(' · '),
    })),
    projects: projects.map((project) => ({
      name: project.title,
      stack: project.tags.join(' · '),
      summary: project.description,
      linkText: formatLinkText(project.links.github) ?? formatLinkText(project.links.demo),
    })),
    // Garder automatiquement toutes les expériences du portfolio.
    experiences: timeline
      .filter((entry) => entry.kind === 'experience')
      .map((entry) => ({
        role: entry.role,
        organization: entry.organization,
        location: entry.location,
        period: entry.period,
        bullets: entry.bullets,
      })),
    education: timeline
      .filter((entry) => entry.kind === 'education')
      .map((entry) => ({
        degree: entry.role,
        school: entry.organization,
        location: entry.location,
        period: entry.period,
        details: entry.summary,
      })),
    // EDIT HERE: Langues parlées
    spokenLanguages: [
      {
        name: { fr: 'Français', en: 'French' },
        level: { fr: 'Langue maternelle', en: 'Native' },
      },
      {
        name: { fr: 'Anglais', en: 'English' },
        level: {
          fr: 'Technique courant (lecture / rédaction)',
          en: 'Proficient technical reading & writing',
        },
      },
    ],
    // EDIT HERE: Centres d'intérêt
    interests: {
      fr: 'Génération procédurale 3D, open data civique, IA locale & traçable, modélisation Blender, Linux Fedora.',
      en: 'Procedural 3D generation, civic open data, local & traceable AI, Blender modeling, Linux Fedora.',
    },
  };
}
