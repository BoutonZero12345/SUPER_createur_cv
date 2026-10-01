import { ParsedJobDetails, ExtractedSkill, ContractType } from '../../types';

// Tech & engineering skills dictionary for smart matching
const KNOWN_SKILL_KEYWORDS = [
  // 3D / CAD / Engineering
  { name: 'Fusion 360', category: 'Modélisation & CAO', aliases: ['fusion360', 'autodesk fusion', 'fusion 360'] },
  { name: 'SolidWorks', category: 'Modélisation & CAO', aliases: ['solid works', 'dassault solidworks'] },
  { name: 'CATIA', category: 'Modélisation & CAO', aliases: ['catia v5', 'catia v6', '3dexperience'] },
  { name: 'AutoCAD', category: 'Modélisation & CAO', aliases: ['autocad 2d', 'autocad 3d'] },
  { name: 'Inventor', category: 'Modélisation & CAO', aliases: ['autodesk inventor'] },
  { name: 'Blender', category: 'Modélisation & CAO', aliases: ['blender 3d'] },
  { name: 'Impression 3D', category: 'Technique / Outils', aliases: ['fdm', 'sla', 'fabrication additive', 'prototypage rapide'] },
  { name: 'Simulation FEA / MEF', category: 'Modélisation & CAO', aliases: ['fea', 'mef', 'ansys', 'éléments finis', 'simulation mécanique'] },
  { name: 'Usinage CNC', category: 'Technique / Outils', aliases: ['cnc', 'commande numérique', 'fraisage', 'tournage'] },
  { name: 'RDM', category: 'Modélisation & CAO', aliases: ['résistance des matériaux', 'calcul de structure'] },
  
  // Software / Development
  { name: 'Python', category: 'Langages & Tech', aliases: ['python3', 'numpy', 'scipy', 'pandas'] },
  { name: 'C++', category: 'Langages & Tech', aliases: ['cpp', 'c/c++'] },
  { name: 'JavaScript / TypeScript', category: 'Langages & Tech', aliases: ['javascript', 'typescript', 'js', 'ts'] },
  { name: 'React', category: 'Langages & Tech', aliases: ['reactjs', 'react.js'] },
  { name: 'MATLAB / Simulink', category: 'Langages & Tech', aliases: ['matlab', 'simulink'] },
  { name: 'Git / GitHub', category: 'Technique / Outils', aliases: ['git', 'github', 'gitlab'] },
  { name: 'Arduino / STM32', category: 'Technique / Outils', aliases: ['arduino', 'stm32', 'raspberry pi', 'microcontrôleur'] },
  
  // Methodologies & Soft Skills
  { name: 'Gestion de projet Agile', category: 'Méthodologie', aliases: ['agile', 'scrum', 'kanban', 'sprint'] },
  { name: 'Cycle en V', category: 'Méthodologie', aliases: ['cycle en v', 'waterfall'] },
  { name: 'Lean Manufacturing', category: 'Méthodologie', aliases: ['lean', '5s', 'kaizen', 'six sigma'] },
  { name: 'Autonomie & Rigueur', category: 'Soft Skills', aliases: ['autonomie', 'rigueur', 'proactif', 'polyvalent'] },
  { name: 'Travail en équipe', category: 'Soft Skills', aliases: ['esprit d\'équipe', 'collaboratif', 'communication'] },
  { name: 'Anglais technique', category: 'Langues', aliases: ['anglais', 'english', 'toeic', 'bilingue'] }
];

export function parseJobOffer(rawText: string): ParsedJobDetails {
  const normalized = rawText.toLowerCase();

  // 1. Detect Contract Type
  let contractType: ContractType = 'Stage';
  if (/alternance|apprentissage|contrat de pro/i.test(rawText)) {
    contractType = 'Alternance';
  } else if (/cdi|durée indéterminée/i.test(rawText)) {
    contractType = 'CDI';
  } else if (/cdd|durée déterminée/i.test(rawText)) {
    contractType = 'CDD';
  } else if (/freelance|indépendant/i.test(rawText)) {
    contractType = 'Freelance';
  }

  // 2. Detect Job Title
  let jobTitle = 'Ingénieur / Concepteur';
  const titleMatches = rawText.match(/(?:offre|poste|titre)\s*(?:de\s+stage|d'alternance|du\s+poste)?\s*[:\-]\s*([^\n\r]+)/i);
  if (titleMatches && titleMatches[1]) {
    jobTitle = titleMatches[1].trim();
  } else {
    // Try to find first prominent line
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines.slice(0, 4)) {
      if (line.length < 90 && /stage|ingénieur|conception|développeur|alternance|r&d|technicien|chef de projet/i.test(line)) {
        jobTitle = line.replace(/^[#\*\-\s]+/, '');
        break;
      }
    }
  }

  // 3. Detect Company Name
  let companyName = 'Entreprise Recruteuse';
  const companyMatches = rawText.match(/(?:entreprise|société|chez|groupe)\s*[:\-]\s*([^\n\r]+)/i);
  if (companyMatches && companyMatches[1]) {
    companyName = companyMatches[1].trim().replace(/\s+(?:recrute|cherche).*/i, '');
  }

  // 4. Detect Duration
  let duration = contractType === 'Stage' ? '6 mois' : '12 à 24 mois';
  const durationMatch = rawText.match(/(\d+\s*(?:mois|semaines|ans))/i);
  if (durationMatch) {
    duration = durationMatch[1];
  }

  // 5. Detect Location
  let location = 'Île-de-France / France';
  const locationMatch = rawText.match(/(?:lieu|localisation|ville|site)\s*[:\-]\s*([^\n\r,]+)/i);
  if (locationMatch && locationMatch[1]) {
    location = locationMatch[1].trim();
  }

  // 6. Detect Recruiter Contact
  let recruiterName: string | undefined;
  const recruiterMatch = rawText.match(/(?:contact|recruteur|référent|tuteur)\s*[:\-]\s*([^\n\r]+)/i);
  if (recruiterMatch && recruiterMatch[1]) {
    recruiterName = recruiterMatch[1].trim();
  }

  // 7. Extract Missions
  const missions: string[] = [];
  const lines = rawText.split('\n').map(l => l.trim());
  let inMissionsSection = false;

  for (const line of lines) {
    if (/missions?\s*(?:principales?|du\s+poste)?\s*[:\-]/i.test(line) || /vos\s+responsabilités/i.test(line)) {
      inMissionsSection = true;
      continue;
    }
    if (inMissionsSection && /profil\s*recherché|compétences|pré-requis|conditions/i.test(line)) {
      inMissionsSection = false;
    }

    if (inMissionsSection && /^[-•*–]\s*(.+)/.test(line)) {
      const missionText = line.replace(/^[-•*–]\s*/, '').trim();
      if (missionText.length > 10) {
        missions.push(missionText);
      }
    }
  }

  // Fallback if no formatted bullet points found
  if (missions.length === 0) {
    missions.push(
      'Participation à la conception et modélisation des projets techniques.',
      'Suivi et réalisation des essais et prototypes fonctionnels.',
      'Collaboration active avec les équipes produit et industrielles.'
    );
  }

  // 8. Skill Extraction & Scoring
  const extractedSkills: ExtractedSkill[] = [];
  const detectedKeywords: string[] = [];

  for (const skill of KNOWN_SKILL_KEYWORDS) {
    let freq = 0;
    // Check main name
    const mainRegex = new RegExp(`\\b${escapeRegExp(skill.name)}\\b`, 'gi');
    const mainMatches = rawText.match(mainRegex);
    if (mainMatches) freq += mainMatches.length;

    // Check aliases
    for (const alias of skill.aliases) {
      const aliasRegex = new RegExp(`\\b${escapeRegExp(alias)}\\b`, 'gi');
      const aliasMatches = rawText.match(aliasRegex);
      if (aliasMatches) freq += aliasMatches.length;
    }

    if (freq > 0) {
      // Determine critical importance
      const hasMandatoryHint = new RegExp(`(?:indispensable|impératif|obligatoire|requis|maîtrise).*${escapeRegExp(skill.name)}`, 'i').test(rawText);
      const importance: 'critical' | 'high' | 'normal' = freq >= 3 || hasMandatoryHint ? 'critical' : freq >= 2 ? 'high' : 'normal';

      extractedSkills.push({
        keyword: skill.name,
        frequency: freq,
        importance,
        category: skill.category
      });
      detectedKeywords.push(skill.name);
    }
  }

  // Sort extracted skills by importance and frequency
  extractedSkills.sort((a, b) => {
    const impWeight = { critical: 3, high: 2, normal: 1 };
    if (impWeight[b.importance] !== impWeight[a.importance]) {
      return impWeight[b.importance] - impWeight[a.importance];
    }
    return b.frequency - a.frequency;
  });

  return {
    rawText,
    jobTitle,
    companyName,
    contractType,
    duration,
    location,
    recruiterName,
    missions: missions.slice(0, 5),
    requiredSkills,
    detectedKeywords,
    toneOrKeywordsSummary: `Poste orienté ${detectedKeywords.slice(0, 3).join(', ')} chez ${companyName}`
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
