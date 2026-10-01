import { CVVariant, MasterProfile, ParsedJobDetails, LayoutSettings } from '../../types';
import { matchAndAdaptProfile } from '../matcher/skillMatcher';

export function createDefaultVariantsForJob(
  masterProfile: MasterProfile,
  jobDetails: ParsedJobDetails
): CVVariant[] {
  const matchResult = matchAndAdaptProfile(masterProfile, jobDetails);

  // Variant A: Dynamic 2-columns, high contrast, top skills emphasis
  const variantA: CVVariant = {
    id: `var_${Date.now()}_a`,
    label: 'Variante A : Focus Technique & Outils Clés',
    description: 'Mise en page moderne à 2 colonnes avec accent sur les logiciels phares et la réalisation concrète.',
    matchScore: matchResult.matchScore,
    updatedAt: new Date().toISOString(),
    layout: {
      templateId: 'modern-accent',
      columns: 2,
      sidebarPosition: 'left',
      sidebarWidthPercentage: 35,
      showPhoto: true,
      photoStyle: 'circle',
      density: 'normal',
      fontFamily: 'Inter',
      fontSizeBase: 10,
      primaryColor: '#2563eb', // Royal Blue
      secondaryColor: '#1e293b',
      accentColor: '#10b981',
      backgroundColor: '#ffffff',
      sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'languages']
    },
    visibility: {
      summary: true,
      skills: true,
      experience: true,
      education: true,
      projects: true,
      languages: true,
      certifications: true
    },
    content: {
      customTitle: matchResult.suggestedTitle,
      customSummary: matchResult.suggestedSummary,
      skills: matchResult.adaptedSkills,
      experiences: masterProfile.experiences,
      education: masterProfile.education,
      projects: masterProfile.projects,
      languages: masterProfile.languages,
      certifications: masterProfile.certifications
    }
  };

  // Variant B: Executive Minimalist 1-column, elegant emerald/zinc, focus on impact & leadership
  const variantB: CVVariant = {
    id: `var_${Date.now()}_b`,
    label: 'Variante B : Focus Projets & Impact Global',
    description: 'Mise en page épurée 1 colonne de type Executive, valorisant les missions et la prise d\'initiative.',
    matchScore: Math.max(75, matchResult.matchScore - 4),
    updatedAt: new Date().toISOString(),
    layout: {
      templateId: 'executive-pro',
      columns: 1,
      sidebarPosition: 'left',
      sidebarWidthPercentage: 30,
      showPhoto: false,
      photoStyle: 'rounded',
      density: 'compact',
      fontFamily: 'Outfit',
      fontSizeBase: 9.5,
      primaryColor: '#059669', // Emerald Green
      secondaryColor: '#0f172a',
      accentColor: '#6366f1',
      backgroundColor: '#ffffff',
      sectionOrder: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications']
    },
    visibility: {
      summary: true,
      skills: true,
      experience: true,
      education: true,
      projects: true,
      languages: true,
      certifications: true
    },
    content: {
      customTitle: `${masterProfile.targetTitle} • Impact Projet & R&D`,
      customSummary: `Profil orienté résultats et innovation chez ${jobDetails.companyName}. Expertise démontrée dans la gestion de projets de modélisation et conception industrielle, alliant rigueur méthodologique et polyvalence technique.`,
      skills: matchResult.adaptedSkills,
      experiences: masterProfile.experiences,
      education: masterProfile.education,
      projects: masterProfile.projects,
      languages: masterProfile.languages,
      certifications: masterProfile.certifications
    }
  };

  return [variantA, variantB];
}

export function duplicateVariant(sourceVariant: CVVariant, newLabel: string): CVVariant {
  return {
    ...JSON.parse(JSON.stringify(sourceVariant)),
    id: `var_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    label: newLabel,
    updatedAt: new Date().toISOString()
  };
}
