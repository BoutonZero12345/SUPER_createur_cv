import { MasterProfile, ParsedJobDetails, AdaptedSkillItem, SkillItem } from '../../types';

export interface MatchingResult {
  matchScore: number;
  adaptedSkills: AdaptedSkillItem[];
  missingSkills: string[];
  suggestedTitle: string;
  suggestedSummary: string;
  topStrengths: string[];
}

export function matchAndAdaptProfile(
  masterProfile: MasterProfile,
  jobDetails: ParsedJobDetails
): MatchingResult {
  const extractedSkills = jobDetails.requiredSkills;
  const masterSkills = [...masterProfile.skills];

  const adaptedSkills: AdaptedSkillItem[] = [];
  const matchedExtractedKeywords = new Set<string>();

  // 1. Evaluate each master skill against job requirements
  for (const skill of masterSkills) {
    let isOfferKeyword = false;
    let isTopMatch = false;
    let relevanceScore = 0.5; // base baseline
    let customNote = '';

    // Check if skill matches any extracted keyword
    const matchedExtract = extractedSkills.find(ext => {
      if (ext.keyword.toLowerCase() === skill.name.toLowerCase()) return true;
      if (skill.aliases && skill.aliases.some(a => a.toLowerCase().includes(ext.keyword.toLowerCase()) || ext.keyword.toLowerCase().includes(a.toLowerCase()))) {
        return true;
      }
      return false;
    });

    if (matchedExtract) {
      isOfferKeyword = true;
      matchedExtractedKeywords.add(matchedExtract.keyword);

      if (matchedExtract.importance === 'critical') {
        isTopMatch = true;
        relevanceScore = 0.98;
        customNote = `Priorité critique dans l'offre (mentionné ${matchedExtract.frequency}x)`;
      } else if (matchedExtract.importance === 'high') {
        isTopMatch = true;
        relevanceScore = 0.90;
        customNote = `Compétence clé recherchée chez ${jobDetails.companyName}`;
      } else {
        relevanceScore = 0.80;
        customNote = 'Mentionné dans l\'offre';
      }
    } else {
      // Bonus skill relevant to general domain
      relevanceScore = skill.level === 'Expert' ? 0.70 : skill.level === 'Avancé' ? 0.60 : 0.45;
    }

    adaptedSkills.push({
      ...skill,
      isTopMatch,
      isOfferKeyword,
      relevanceScore,
      customNote
    });
  }

  // 2. Sort skills: Top matches first (ordered by relevance score desc), then others
  adaptedSkills.sort((a, b) => {
    if (a.isTopMatch !== b.isTopMatch) {
      return a.isTopMatch ? -1 : 1;
    }
    if (a.isOfferKeyword !== b.isOfferKeyword) {
      return a.isOfferKeyword ? -1 : 1;
    }
    return b.relevanceScore - a.relevanceScore;
  });

  // 3. Find missing skills requested by the offer
  const missingSkills = extractedSkills
    .filter(ext => !matchedExtractedKeywords.has(ext.keyword))
    .map(ext => ext.keyword);

  // 4. Compute overall match score (0 - 100%)
  const totalRequired = Math.max(1, extractedSkills.length);
  const matchedCount = matchedExtractedKeywords.size;
  const coverageRatio = matchedCount / totalRequired;
  
  // Weight between 60% and 98% realistic score
  const matchScore = Math.min(99, Math.round(50 + coverageRatio * 45 + (masterSkills.length >= 5 ? 4 : 0)));

  // 5. Generate tailored suggested title
  const mainTool = adaptedSkills.find(s => s.isTopMatch)?.name || 'CAO & Ingénierie';
  const suggestedTitle = `${masterProfile.targetTitle} • Spécialiste ${mainTool}`;

  // 6. Generate tailored suggested summary
  const topMatchesList = adaptedSkills.filter(s => s.isTopMatch).map(s => s.name);
  const strengthsMention = topMatchesList.length > 0 ? topMatchesList.join(', ') : mainTool;
  
  const suggestedSummary = `${masterProfile.targetTitle} avec une solide expérience pratique en ${strengthsMention}. Déterminé à apporter rigueur, réactivité et créativité technique à l'équipe de ${jobDetails.companyName} sur les missions de ${jobDetails.jobTitle}.`;

  return {
    matchScore,
    adaptedSkills,
    missingSkills,
    suggestedTitle,
    suggestedSummary,
    topStrengths: topMatchesList
  };
}
