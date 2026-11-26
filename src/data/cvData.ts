/**
 * ============================================================================
 * CLASSIC A4 CV DATA (SYNCHRONISÉ AVEC `portfolioData.ts`)
 * ============================================================================
 * Le CV A4 réutilise automatiquement le profil, les liens, les compétences,
 * les 4 projets et le parcours depuis `src/data/portfolioData.ts`.
 *
 * Modifiez ici uniquement les champs spécifiques au document A4 imprimable :
 *   - `headline` & `summary` condensés pour tenir sur une page A4
 *   - `phone` (laisser "" pour ne pas l'afficher)
 *   - `spokenLanguages` & `interests`
 *   - `sectionTitles` (FR / EN)
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

export function buildCvData(): CvData {
  const { profile, socialLinks, skillCategories, projects, timeline } = portfolioData;

  return {
    fullName: `${profile.firstName} ${profile.lastName}`,
    handle: profile.handle,
    // EDIT HERE: Titre court affiché en haut du CV A4
    headline: {
      fr: 'Étudiant 1ère année BTS SIO (SLAM) · Développeur Godot 4, Rust, C++, TypeScript/Bun & Python',
      en: '1st-Year BTS SIO (SLAM) Student · Godot 4, Rust, C++, TypeScript/Bun & Python Developer',
    },
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
    // EDIT HERE: Résumé court calibré pour tenir sur une seule page A4
    summary: {
      fr: "Étudiant en 1ère année de BTS SIO (parcours SLAM) après un Bac Pro CIEL obtenu avec Mention Très Bien. Orienté développement logiciel, moteurs 3D temps réel (Godot 4, Rust/gdext, C++, Three.js) et applications TypeScript/Bun & Python sous Linux (Fedora).",
      en: 'First-year BTS SIO (SLAM software track) student following a Bac Pro CIEL with Highest Honors. Focused on software engineering, real-time 3D engines (Godot 4, Rust/gdext, C++, Three.js), and TypeScript/Bun & Python applications on Linux (Fedora).',
    },
    sectionTitles: {
      fr: {
        summary: 'Profil',
        experience: 'Expériences & Pratique',
        projects: 'Projets Principaux',
        education: 'Formation',
        skills: 'Compétences',
        languages: 'Langues',
        interests: 'Centres d’intérêt',
      },
      en: {
        summary: 'Profile',
        experience: 'Experience & Practice',
        projects: 'Core Projects',
        education: 'Education',
        skills: 'Skills',
        languages: 'Languages',
        interests: 'Interests',
      },
    },
    skills: skillCategories.map((cat) => ({
      category: cat.title,
      items: cat.items.map((item) => item.name).join(', '),
    })),
    projects: projects.map((project) => ({
      name: project.title,
      stack: project.tags.join(' · '),
      summary: project.description,
      linkText: formatLinkText(project.links.github) ?? formatLinkText(project.links.demo),
    })),
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
          fr: 'Technique & lecture documentaire courante',
          en: 'Proficient technical reading & writing',
        },
      },
    ],
    // EDIT HERE: Centres d'intérêt
    interests: {
      fr: 'Génération procédurale 3D, open data civique, IA locale & traçable, création d’assets Blender, écosystème Linux Fedora.',
      en: 'Procedural 3D generation, civic open data, local & traceable AI, Blender 3D modeling, Linux Fedora ecosystem.',
    },
  };
}
