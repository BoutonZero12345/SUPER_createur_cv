import React, { useState } from 'react';
import { CVDocument, MasterProfile, User } from '../../types';
import { CompletenessReport } from '../../db/storageAdapter';
import { 
  PlusCircle, 
  FileText, 
  Building2, 
  Calendar, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle, 
  AlertCircle, 
  SlidersHorizontal, 
  Trash2, 
  Copy, 
  Layers, 
  Download, 
  Search,
  ExternalLink
} from 'lucide-react';

interface DashboardProps {
  user: User;
  masterProfile: MasterProfile;
  cvDocuments: CVDocument[];
  completeness: CompletenessReport;
  onOpenStudio: (cvId: string) => void;
  onCreateNewCV: () => void;
  onOpenProfile: () => void;
  onDuplicateCV: (cvId: string) => void;
  onDeleteCV: (cvId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  masterProfile,
  cvDocuments,
  completeness,
  onOpenStudio,
  onCreateNewCV,
  onOpenProfile,
  onDuplicateCV,
  onDeleteCV
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter CVs
  const filteredCVs = cvDocuments.filter(cv => {
    const matchesSearch = 
      cv.jobTitleTarget.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cv.companyTarget.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cv.variants.some(v => v.content.customTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = !selectedTag || (cv.tags && cv.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  // Extract all unique tags
  const allTags = Array.from(new Set(cvDocuments.flatMap(cv => cv.tags || [])));

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Top Banner / Welcome */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Bonjour, {user.name.split(' ')[0]} 👋
            </h1>
            <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
              En ligne • Profil actif
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Personnalisez vos CVs pour chaque offre d'emploi avec scoring de mots-clés et tests A/B en direct.
          </p>
        </div>

        {/* High Visibility Action Button */}
        <button
          onClick={onCreateNewCV}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.85rem 1.6rem',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: 'var(--shadow-glow)',
            transition: 'all var(--transition-smooth)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <PlusCircle size={20} />
          Créer un nouveau CV ciblé
        </button>
      </div>

      {/* Grid: Profile Checklist ("Ce qu'il reste à faire") + Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Checklist Widget: Ce qu'il reste à faire */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: completeness.score >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: completeness.score >= 80 ? '#34d399' : '#fbbf24'
              }}>
                <CheckCircle size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Complétude du Profil Maître</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ce qui alimente automatiquement vos CVs</span>
              </div>
            </div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: completeness.score >= 80 ? '#34d399' : '#fbbf24'
            }}>
              {completeness.score}%
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-app)', borderRadius: '3px', overflow: 'hidden', marginBottom: '1.25rem' }}>
            <div style={{
              width: `${completeness.score}%`,
              height: '100%',
              backgroundColor: completeness.score >= 80 ? '#10b981' : '#f59e0b',
              transition: 'width 0.5s ease'
            }} />
          </div>

          {/* Checklist items remaining */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {completeness.items.map((item) => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: item.completed ? 'transparent' : 'var(--bg-app)',
                  border: item.completed ? '1px solid transparent' : '1px solid var(--border)',
                  fontSize: '0.82rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {item.completed ? (
                    <CheckCircle size={15} color="#10b981" />
                  ) : (
                    <AlertCircle size={15} color="#f59e0b" />
                  )}
                  <span style={{ color: item.completed ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: item.completed ? 'line-through' : 'none' }}>
                    {item.label}
                  </span>
                </div>
                {!item.completed && (
                  <button
                    onClick={onOpenProfile}
                    style={{ fontSize: '0.72rem', fontWeight: 600, color: '#818cf8', textDecoration: 'underline' }}
                  >
                    Compléter
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={onOpenProfile}
            style={{
              width: '100%',
              marginTop: '1.25rem',
              padding: '0.6rem',
              backgroundColor: 'var(--bg-card-hover)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              border: '1px solid var(--border)'
            }}
          >
            <SlidersHorizontal size={14} />
            Gérer mon Profil Maître & Compétences
          </button>
        </div>

        {/* Master Profile Summary & Key Capabilities */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(79, 70, 229, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#818cf8'
                }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Vivier de Compétences Actif</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Moteur de matching déterministe</span>
                </div>
              </div>
              <span className="badge badge-primary">{masterProfile.skills.length} compétences</span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Lorsqu'une offre demande une compétence (ex: <strong>Fusion 360</strong>), TailorCV la propulse immédiatement en haut de votre CV et adapte vos accroches.
            </p>

            {/* Quick Skills Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.25rem' }}>
              {masterProfile.skills.slice(0, 8).map(sk => (
                <span 
                  key={sk.id}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: sk.name.includes('Fusion 360') ? 'rgba(79, 70, 229, 0.25)' : 'var(--bg-app)',
                    border: sk.name.includes('Fusion 360') ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid var(--border)',
                    color: sk.name.includes('Fusion 360') ? '#c7d2fe' : 'var(--text-muted)',
                    fontWeight: sk.name.includes('Fusion 360') ? 700 : 500
                  }}
                >
                  {sk.name} {sk.name.includes('Fusion 360') && '⚡'}
                </span>
              ))}
              {masterProfile.skills.length > 8 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', alignSelf: 'center' }}>
                  +{masterProfile.skills.length - 8} autres...
                </span>
              )}
            </div>
          </div>

          <div style={{
            padding: '0.85rem',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Titre du Profil Source</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{masterProfile.targetTitle}</div>
            </div>
            <button
              onClick={onOpenProfile}
              style={{ color: '#818cf8', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              Modifier <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* CV Gallery Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            Vos CVs Générés ({filteredCVs.length})
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Chaque CV est personnalisé selon l'offre et supporte l'A/B testing
          </span>
        </div>

        {/* Search & Tag Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <input
              type="text"
              placeholder="Rechercher entreprise, poste..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                color: 'var(--text-main)'
              }}
            />
            <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          </div>

          {allTags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                onClick={() => setSelectedTag(null)}
                style={{
                  fontSize: '0.72rem',
                  padding: '0.25rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: selectedTag === null ? 'var(--primary)' : 'var(--bg-card)',
                  color: selectedTag === null ? '#ffffff' : 'var(--text-muted)',
                  border: '1px solid var(--border)'
                }}
              >
                Tous
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.25rem 0.55rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: selectedTag === tag ? 'var(--primary)' : 'var(--bg-card)',
                    color: selectedTag === tag ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid var(--border)'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CV Cards Grid */}
      {filteredCVs.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border)',
          padding: '3rem 1.5rem',
          textAlign: 'center'
        }}>
          <FileText size={40} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Aucun CV trouvé</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Collez le contenu d'une offre d'emploi pour générer votre premier CV ciblé en quelques secondes.
          </p>
          <button
            onClick={onCreateNewCV}
            style={{
              padding: '0.65rem 1.4rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
          >
            Créer un nouveau CV
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredCVs.map((cv) => {
            const activeVariant = cv.variants.find(v => v.id === cv.activeVariantId) || cv.variants[0];
            const hasMultipleVariants = cv.variants.length > 1;

            return (
              <div
                key={cv.id}
                className="animate-fade-in"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Card Header: Company Target + Match Score */}
                <div style={{
                  padding: '1.25rem 1.25rem 0.75rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                      <Building2 size={14} />
                      {cv.companyTarget || 'Entreprise Cible'}
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.3, color: 'var(--text-main)' }}>
                      {cv.jobTitleTarget}
                    </h3>
                  </div>

                  {/* Match Score Badge */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0.35rem 0.65rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>Match</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                      {activeVariant.matchScore}%
                    </span>
                  </div>
                </div>

                {/* Card Body: Active Variant & Details */}
                <div style={{ padding: '1rem 1.25rem', flex: 1 }}>
                  {/* Active Variant Info */}
                  <div style={{
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--bg-app)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    marginBottom: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        VARIANTE ACTIVE ({cv.variants.length} au total)
                      </span>
                      {hasMultipleVariants && (
                        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                          A/B Testing actif
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {activeVariant.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                      Template : {activeVariant.layout.templateId} • {activeVariant.layout.columns} colonne(s)
                    </div>
                  </div>

                  {/* Top Highlighted Skill */}
                  {activeVariant.content.skills && activeVariant.content.skills.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 600 }}>Compétence n°1 propulsée : </span>
                      <span style={{ color: '#818cf8', fontWeight: 700 }}>
                        {activeVariant.content.skills[0].name}
                      </span>
                      {activeVariant.content.skills[0].isTopMatch && ' ⚡'}
                    </div>
                  )}

                  {/* Tags */}
                  {cv.tags && cv.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {cv.tags.map(t => (
                        <span key={t} className="badge" style={{ fontSize: '0.68rem' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div style={{
                  padding: '0.85rem 1.25rem',
                  backgroundColor: 'var(--bg-card-hover)',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => onDuplicateCV(cv.id)}
                      title="Dupliquer ce CV"
                      style={{ padding: '0.4rem', color: 'var(--text-dim)', borderRadius: 'var(--radius-sm)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteCV(cv.id)}
                      title="Supprimer ce CV"
                      style={{ padding: '0.4rem', color: 'var(--text-dim)', borderRadius: 'var(--radius-sm)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--rose)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenStudio(cv.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.45rem 1rem',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    Ouvrir le Studio CV
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
