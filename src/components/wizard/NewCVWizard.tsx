import React, { useState } from 'react';
import { MasterProfile, ParsedJobDetails, CVDocument, JobOffer } from '../../types';
import { parseJobOffer } from '../../core/analyzer/offerParser';
import { createDefaultVariantsForJob } from '../../core/abTesting/variantGenerator';
import { SAMPLE_JOB_OFFERS } from '../../data/mockData';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Briefcase, 
  Clock, 
  MapPin, 
  UserCheck, 
  Cpu, 
  CheckCircle2, 
  FileText, 
  Zap,
  SkipForward
} from 'lucide-react';

interface NewCVWizardProps {
  masterProfile: MasterProfile;
  onFinish: (newCV: CVDocument, newOffer?: JobOffer) => void;
  onCancel: () => void;
}

export const NewCVWizard: React.FC<NewCVWizardProps> = ({ masterProfile, onFinish, onCancel }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [rawText, setRawText] = useState('');
  
  // Parsed offer state
  const [parsedOffer, setParsedOffer] = useState<ParsedJobDetails | null>(null);

  // Load sample offer (Fusion 360 scenario)
  const handleLoadSampleOffer = () => {
    const sample = SAMPLE_JOB_OFFERS[0].parsedDetails;
    setRawText(sample.rawText);
  };

  // Step 1: Parse and proceed to Step 2
  const handleProceedToStep2 = () => {
    if (!rawText.trim()) {
      handleSkipStep1();
      return;
    }
    const parsed = parseJobOffer(rawText);
    setParsedOffer(parsed);
    setStep(2);
  };

  // Step 1: Skip entirely to Step 2 with blank offer
  const handleSkipStep1 = () => {
    const blank: ParsedJobDetails = {
      rawText: '',
      jobTitle: masterProfile.targetTitle,
      companyName: 'Nouvelle Entreprise',
      contractType: 'CDI',
      duration: 'Indéterminée',
      location: 'France',
      missions: [
        'Participation active aux projets stratégiques de l\'équipe.',
        'Mise en œuvre des compétences techniques et méthodologiques.'
      ],
      requiredSkills: [],
      detectedKeywords: [],
      toneOrKeywordsSummary: 'Candidature spontanée / CV standard'
    };
    setParsedOffer(blank);
    setStep(2);
  };

  // Step 2: Finalize creation & open Studio
  const handleFinalize = () => {
    if (!parsedOffer) return;

    const offerId = `job_${Date.now()}`;
    const newOffer: JobOffer = {
      id: offerId,
      userId: masterProfile.userId,
      title: parsedOffer.jobTitle,
      company: parsedOffer.companyName,
      parsedDetails: parsedOffer,
      createdAt: new Date().toISOString()
    };

    const variants = createDefaultVariantsForJob(masterProfile, parsedOffer);

    const newCV: CVDocument = {
      id: `cv_${Date.now()}`,
      userId: masterProfile.userId,
      jobOfferId: offerId,
      jobTitleTarget: parsedOffer.jobTitle,
      companyTarget: parsedOffer.companyName,
      activeVariantId: variants[0].id,
      variants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [parsedOffer.contractType, parsedOffer.companyName, 'A/B Ready']
    };

    onFinish(newCV, newOffer);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Wizard Header Stepper */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2.5rem',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: step >= 1 ? 'var(--primary)' : 'var(--bg-card)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem',
            boxShadow: step >= 1 ? 'var(--shadow-glow)' : 'none'
          }}>
            1
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: step === 1 ? 'var(--text-main)' : 'var(--text-muted)' }}>
              Étape 1 : Contenu de l'offre
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Copier-coller le texte (ou passer)
            </div>
          </div>
        </div>

        <div style={{ flex: 1, height: '2px', backgroundColor: 'var(--border)', margin: '0 1.5rem' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: step >= 2 ? 'var(--primary)' : 'var(--bg-card)',
            color: step >= 2 ? '#ffffff' : 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem',
            border: step >= 2 ? 'none' : '1px solid var(--border)',
            boxShadow: step >= 2 ? 'var(--shadow-glow)' : 'none'
          }}>
            2
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: step === 2 ? 'var(--text-main)' : 'var(--text-muted)' }}>
              Étape 2 : Extraction & Affinage
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Missions, outils, compétences requises
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: Paste Offer */}
      {step === 1 && (
        <div className="animate-fade-in" style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.35rem' }}>
                Collez l'annonce d'emploi
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Notre moteur extrait automatiquement les logiciels attendus, les missions clés et prépare le scoring de vos compétences.
              </p>
            </div>

            {/* Quick Demo Button */}
            <button
              onClick={handleLoadSampleOffer}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                backgroundColor: 'rgba(79, 70, 229, 0.15)',
                color: '#818cf8',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: '1px solid rgba(99, 102, 241, 0.3)'
              }}
            >
              <Zap size={14} />
              Exemple : Stage Fusion 360
            </button>
          </div>

          <textarea
            rows={10}
            placeholder="Exemple : 
Offre de Stage : Ingénieur R&D Conception Mécanique (H/F)
Entreprise : AeroSphere Dynamics
Missions : Modélisation 3D sous Autodesk Fusion 360, Prototypage rapide par impression 3D...
Profil : Maîtrise impérative de Fusion 360..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
              lineHeight: 1.5,
              resize: 'vertical',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-mono)'
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={onCancel}
              style={{
                padding: '0.65rem 1.25rem',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              Annuler
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={handleSkipStep1}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.65rem 1.15rem',
                  backgroundColor: 'var(--bg-card-hover)',
                  color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid var(--border)'
                }}
              >
                <SkipForward size={15} />
                Passer cette étape
              </button>

              <button
                onClick={handleProceedToStep2}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.5rem',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                Analyser l'offre & Continuer
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Extraction & Refinement */}
      {step === 2 && parsedOffer && (
        <div className="animate-fade-in" style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-success">Extraction NLP Réussie</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  {parsedOffer.requiredSkills.length} compétences détectées
                </span>
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                Détails de l'offre détectés
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Vous pouvez modifier librement chaque champ avant la génération de vos variantes de CV.
              </p>
            </div>
          </div>

          {/* Form Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Intitulé du poste recherché
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={parsedOffer.jobTitle}
                  onChange={(e) => setParsedOffer({ ...parsedOffer, jobTitle: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.2rem', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                />
                <Briefcase size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Nom de l'entreprise
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={parsedOffer.companyName}
                  onChange={(e) => setParsedOffer({ ...parsedOffer, companyName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.2rem', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                />
                <Building2 size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Type de contrat & Durée
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={`${parsedOffer.contractType} (${parsedOffer.duration || '6 mois'})`}
                  onChange={(e) => setParsedOffer({ ...parsedOffer, duration: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.2rem', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                />
                <Clock size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Lieu ou Contact Recruteur
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={`${parsedOffer.location || 'Paris'} ${parsedOffer.recruiterName ? `• ${parsedOffer.recruiterName}` : ''}`}
                  onChange={(e) => setParsedOffer({ ...parsedOffer, location: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.2rem', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                />
                <MapPin size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
            </div>
          </div>

          {/* Detected Skills Breakdown (e.g. Fusion 360 prominence) */}
          <div style={{
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Cpu size={16} color="#818cf8" />
                Compétences prioritaires repérées dans l'offre
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Pondération automatique pour le CV
              </span>
            </div>

            {parsedOffer.requiredSkills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {parsedOffer.requiredSkills.map((sk) => {
                  const isMasterMatched = masterProfile.skills.some(
                    ms => ms.name.toLowerCase() === sk.keyword.toLowerCase() ||
                    (ms.aliases && ms.aliases.some(a => a.toLowerCase().includes(sk.keyword.toLowerCase())))
                  );

                  return (
                    <div
                      key={sk.keyword}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: sk.importance === 'critical' ? 'rgba(79, 70, 229, 0.2)' : 'var(--bg-card)',
                        border: sk.importance === 'critical' ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid var(--border)',
                        fontSize: '0.82rem'
                      }}
                    >
                      <span style={{ fontWeight: 700, color: sk.importance === 'critical' ? '#c7d2fe' : 'var(--text-main)' }}>
                        {sk.keyword}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                        ({sk.frequency}x)
                      </span>
                      {isMasterMatched ? (
                        <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem' }}>
                          ✓ Dans votre profil
                        </span>
                      ) : (
                        <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem' }}>
                          + À ajouter
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Aucune compétence spécifique détectée. Le CV utilisera les compétences principales de votre profil maître.
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={() => setStep(1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1.15rem',
                backgroundColor: 'var(--bg-card-hover)',
                color: 'var(--text-muted)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: '1px solid var(--border)'
              }}
            >
              <ArrowLeft size={16} />
              Retour
            </button>

            <button
              onClick={handleFinalize}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.8rem',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.92rem',
                fontWeight: 700,
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <Sparkles size={18} />
              Générer mon CV adapté & Ouvrir le Studio A/B
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
