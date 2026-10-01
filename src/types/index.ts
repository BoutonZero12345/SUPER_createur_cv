// ==========================================
// TAILORCV - DOMAIN & DATA MODEL DEFINITIONS
// ==========================================

export type ContractType = 'Stage' | 'Alternance' | 'CDI' | 'CDD' | 'Freelance' | 'Autre';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role?: string;
  createdAt: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Technique / Outils' | 'Modélisation & CAO' | 'Langages & Tech' | 'Méthodologie' | 'Soft Skills' | 'Langues' | 'Autre';
  level?: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  aliases?: string[]; // e.g. ["Fusion360", "Autodesk Fusion 360", "CAO 3D"]
  yearsOfExperience?: number;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description: string;
  bullets: string[];
  skillsUsed?: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  school: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  details?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  link?: string;
  description: string;
  technologies: string[];
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'Langue maternelle' | 'Bilingue / C2' | 'Courant / C1' | 'Intermédiaire / B2' | 'Notions / A2';
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface MasterProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  targetTitle: string; // Titre par défaut (ex: "Élève Ingénieur en Conception Mécanique")
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  photoUrl?: string;
  defaultSummary: string;
  skills: SkillItem[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  languages: LanguageItem[];
  certifications: CertificationItem[];
  updatedAt: string;
}

// ==========================================
// JOB OFFER & ANALYZER TYPES
// ==========================================

export interface ExtractedSkill {
  keyword: string;
  frequency: number;
  importance: 'critical' | 'high' | 'normal';
  category: string;
  matchedMasterSkillId?: string;
}

export interface ParsedJobDetails {
  rawText: string;
  jobTitle: string;
  companyName: string;
  contractType: ContractType;
  duration?: string;
  location?: string;
  recruiterName?: string;
  department?: string;
  missions: string[];
  requiredSkills: ExtractedSkill[];
  detectedKeywords: string[];
  toneOrKeywordsSummary: string;
}

export interface JobOffer {
  id: string;
  userId: string;
  title: string;
  company: string;
  parsedDetails: ParsedJobDetails;
  createdAt: string;
}

// ==========================================
// A/B TESTING & CV DOCUMENT CONFIG
// ==========================================

export type TemplateId = 'executive-pro' | 'tech-minimal' | 'modern-accent' | 'split-duo';

export interface LayoutSettings {
  templateId: TemplateId;
  columns: 1 | 2;
  sidebarPosition: 'left' | 'right';
  sidebarWidthPercentage: number; // 30, 35, 40
  showPhoto: boolean;
  photoStyle: 'circle' | 'rounded' | 'square';
  density: 'compact' | 'normal' | 'relaxed';
  fontFamily: 'Inter' | 'Outfit' | 'Plus Jakarta Sans' | 'System';
  fontSizeBase: number; // in pt (9, 9.5, 10, 10.5, 11)
  primaryColor: string; // Hex color
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  sectionOrder: string[]; // ['summary', 'skills', 'experience', 'projects', 'education', 'languages']
}

export interface SectionVisibility {
  summary: boolean;
  skills: boolean;
  experience: boolean;
  education: boolean;
  projects: boolean;
  languages: boolean;
  certifications: boolean;
}

export interface AdaptedSkillItem extends SkillItem {
  isTopMatch: boolean;
  isOfferKeyword: boolean;
  relevanceScore: number;
  customNote?: string;
}

export interface CVVariantContent {
  customTitle: string; // Titre du CV adapté à l'offre
  customSummary: string; // Accroche / Synthèse adaptée à l'offre
  skills: AdaptedSkillItem[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  languages: LanguageItem[];
  certifications: CertificationItem[];
}

export interface CVVariant {
  id: string;
  label: string; // "Variante A (Focus Technique & CAO)", "Variante B (Polyvalence & Gestion)"
  description?: string;
  layout: LayoutSettings;
  visibility: SectionVisibility;
  content: CVVariantContent;
  matchScore: number; // Score de correspondance 0-100%
  updatedAt: string;
}

export interface CVDocument {
  id: string;
  userId: string;
  jobOfferId?: string;
  jobTitleTarget: string;
  companyTarget: string;
  activeVariantId: string;
  variants: CVVariant[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}
