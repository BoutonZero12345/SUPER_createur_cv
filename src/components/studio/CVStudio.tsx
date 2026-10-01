import React, { useState, useRef, useEffect } from 'react';
import { CVDocument, CVVariant, MasterProfile, LayoutSettings } from '../../types';
import { ResumeTemplateView } from '../../templates/ResumeTemplateView';
import { duplicateVariant } from '../../core/abTesting/variantGenerator';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Palette, 
  Sliders, 
  Edit3, 
  Check, 
  Copy, 
  Trash2, 
  Plus, 
  Zap, 
  Eye, 
  EyeOff, 
  Columns, 
  Layout, 
  User, 
  HelpCircle,
  Share2
} from 'lucide-react';

interface CVStudioProps {
  cv: CVDocument;
  masterProfile: MasterProfile;
  onSaveCV: (updatedCV: CVDocument) => void;
  onBack: () => void;
}

export const CVStudio: React.FC<CVStudioProps> = ({
  cv,
  masterProfile,
  onSaveCV,
  onBack
}) => {
  const [currentCV, setCurrentCV] = useState<CVDocument>(cv);
  const activeVariant = currentCV.variants.find(v => v.id === currentCV.activeVariantId) || currentCV.variants[0];

  // Studio UI state
  const [activeTab, setActiveTab] = useState<'ab' | 'match' | 'design' | 'content'>('ab');
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [isEditableInline, setIsEditableInline] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Resizable split screen
  const [sidebarWidthPercent, setSidebarWidthPercent] = useState<number>(38); // 38% for controls, 62% for preview
  const isDraggingRef = useRef(false);

  // Auto-save on modification
  const handleUpdateActiveVariant = (updates: Partial<CVVariant>) => {
    setSaveStatus('saving');
    const updatedVariants = currentCV.variants.map(v => {
      if (v.id === activeVariant.id) {
        return {
          ...v,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return v;
    });

    const updatedCV = {
      ...currentCV,
      variants: updatedVariants,
      updatedAt: new Date().toISOString()
    };

    setCurrentCV(updatedCV);
    onSaveCV(updatedCV);

    setTimeout(() => {
      setSaveStatus('saved');
    }, 400);
  };

  // Switch A/B active variant
  const handleSwitchVariant = (variantId: string) => {
    const updatedCV = {
      ...currentCV,
      activeVariantId: variantId
    };
    setCurrentCV(updatedCV);
    onSaveCV(updatedCV);
  };

  // Duplicate Variant
  const handleDuplicateCurrentVariant = () => {
    const newVariant = duplicateVariant(
      activeVariant,
      `Variante ${String.fromCharCode(65 + currentCV.variants.length)} (Copie personnalisée)`
    );
    const updatedCV = {
      ...currentCV,
      variants: [...currentCV.variants, newVariant],
      activeVariantId: newVariant.id
    };
    setCurrentCV(updatedCV);
    onSaveCV(updatedCV);
  };

  // Delete Variant (if > 1)
  const handleDeleteCurrentVariant = () => {
    if (currentCV.variants.length <= 1) return;
    const remaining = currentCV.variants.filter(v => v.id !== activeVariant.id);
    const updatedCV = {
      ...currentCV,
      variants: remaining,
      activeVariantId: remaining[0].id
    };
    setCurrentCV(updatedCV);
    onSaveCV(updatedCV);
  };

  // Export PDF via native vector print dialog
  const handlePrintPDF = () => {
    window.print();
  };

  // Divider resize handlers
  const handleMouseDown = () => {
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const windowWidth = window.innerWidth;
      const newPercent = ((windowWidth - e.clientX) / windowWidth) * 100;
      if (newPercent >= 25 && newPercent <= 60) {
        setSidebarWidthPercent(newPercent);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Preset Colors
  const COLOR_PALETTES = [
    { label: 'Bleu Aero', primary: '#2563eb', secondary: '#1e293b' },
    { label: 'Émeraude Forest', primary: '#059669', secondary: '#0f172a' },
    { label: 'Indigo Royal', primary: '#4f46e5', secondary: '#1e293b' },
    { label: 'Noir Minimal', primary: '#0f172a', secondary: '#475569' },
    { label: 'Corail Industriel', primary: '#e11d48', secondary: '#0f172a' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 65px)', overflow: 'hidden' }}>
      {/* Studio Top Control Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1.25rem',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        zIndex: 10
      }}>
        {/* Left: Back & CV Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={onBack}
            style={{
              padding: '0.45rem',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)'
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {currentCV.companyTarget}
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>•</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {currentCV.jobTitleTarget}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: saveStatus === 'saved' ? '#10b981' : '#f59e0b' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: saveStatus === 'saved' ? '#10b981' : '#f59e0b' }} />
              {saveStatus === 'saved' ? 'Enregistré en temps réel' : 'Sauvegarde...'}
            </div>
          </div>
        </div>

        {/* Center: A/B Variant Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: 'var(--bg-app)',
          padding: '0.3rem 0.4rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)'
        }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', padding: '0 0.4rem' }}>
            A/B TESTING :
          </span>
          {currentCV.variants.map((v, idx) => (
            <button
              key={v.id}
              onClick={() => handleSwitchVariant(v.id)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: v.id === activeVariant.id ? 'var(--primary)' : 'transparent',
                color: v.id === activeVariant.id ? '#ffffff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'var(--transition-fast)'
              }}
            >
              Variante {String.fromCharCode(65 + idx)}
              <span style={{
                fontSize: '0.68rem',
                padding: '0.05rem 0.3rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: v.id === activeVariant.id ? 'rgba(255,255,255,0.25)' : 'var(--bg-card-hover)',
                color: v.id === activeVariant.id ? '#ffffff' : 'var(--text-dim)'
              }}>
                {v.matchScore}%
              </span>
            </button>
          ))}
          <button
            onClick={handleDuplicateCurrentVariant}
            title="Créer une nouvelle variante de test A/B"
            style={{
              padding: '0.35rem 0.5rem',
              color: '#818cf8',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            <Plus size={14} /> + Variante
          </button>
        </div>

        {/* Right: Zoom & Export Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
              style={{ padding: '0.35rem 0.5rem', color: 'var(--text-muted)' }}
              title="Zoom arrière"
            >
              <ZoomOut size={15} />
            </button>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', padding: '0 0.35rem', fontFamily: 'var(--font-mono)' }}>
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
              style={{ padding: '0.35rem 0.5rem', color: 'var(--text-muted)' }}
              title="Zoom avant"
            >
              <ZoomIn size={15} />
            </button>
          </div>

          {/* Export PDF Button */}
          <button
            onClick={handlePrintPDF}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 1.1rem',
              backgroundColor: '#10b981',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.85rem',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Printer size={15} />
            Exporter PDF (A4)
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* LEFT PANE: Live A4 Resume Preview */}
        <div style={{
          flex: 1,
          backgroundColor: '#090d16',
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '2.5rem 1.5rem',
          position: 'relative'
        }}>
          {/* Zoomed Container */}
          <div style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease'
          }}>
            <ResumeTemplateView
              variant={activeVariant}
              masterProfile={masterProfile}
              isEditable={isEditableInline}
              onUpdateContent={(updatedContent) => {
                handleUpdateActiveVariant({
                  content: {
                    ...activeVariant.content,
                    ...updatedContent
                  }
                });
              }}
            />
          </div>
        </div>

        {/* DRAGGABLE DIVIDER */}
        <div
          onMouseDown={handleMouseDown}
          title="Faites glisser pour ajuster la taille"
          style={{
            width: '6px',
            backgroundColor: 'var(--border)',
            cursor: 'col-resize',
            transition: 'background-color var(--transition-fast)',
            position: 'relative',
            zIndex: 20
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary)')}
          onMouseLeave={(e) => {
            if (!isDraggingRef.current) e.currentTarget.style.backgroundColor = 'var(--border)';
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '18px',
            height: '36px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-dim)',
            fontSize: '10px'
          }}>
            ⋮
          </div>
        </div>

        {/* RIGHT PANE: Granular Controls Drawer */}
        <div style={{
          width: `${sidebarWidthPercent}%`,
          backgroundColor: 'var(--bg-card)',
          borderLeft: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Drawer Sub-tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--bg-app)',
            padding: '0.4rem 0.5rem',
            gap: '0.35rem',
            overflowX: 'auto'
          }}>
            <button
              onClick={() => setActiveTab('ab')}
              style={{
                flex: 1,
                padding: '0.45rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: activeTab === 'ab' ? '#ffffff' : 'var(--text-muted)',
                backgroundColor: activeTab === 'ab' ? 'var(--bg-card)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              <Layers size={14} />
              A/B Testing
            </button>

            <button
              onClick={() => setActiveTab('match')}
              style={{
                flex: 1,
                padding: '0.45rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: activeTab === 'match' ? '#ffffff' : 'var(--text-muted)',
                backgroundColor: activeTab === 'match' ? 'var(--bg-card)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              <Zap size={14} />
              Matching
            </button>

            <button
              onClick={() => setActiveTab('design')}
              style={{
                flex: 1,
                padding: '0.45rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: activeTab === 'design' ? '#ffffff' : 'var(--text-muted)',
                backgroundColor: activeTab === 'design' ? 'var(--bg-card)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              <Palette size={14} />
              Design
            </button>

            <button
              onClick={() => setActiveTab('content')}
              style={{
                flex: 1,
                padding: '0.45rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: activeTab === 'content' ? '#ffffff' : 'var(--text-muted)',
                backgroundColor: activeTab === 'content' ? 'var(--bg-card)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              <Sliders size={14} />
              Contenu
            </button>
          </div>

          {/* Drawer Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
            {/* TAB: A/B TESTING */}
            {activeTab === 'ab' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Variante Active</span>
                    <span className="badge badge-primary">{activeVariant.label.split(':')[0]}</span>
                  </div>
                  <input
                    type="text"
                    value={activeVariant.label}
                    onChange={(e) => handleUpdateActiveVariant({ label: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '0.5rem'
                    }}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {activeVariant.description || 'Testez différentes dispositions, couleurs ou accroches pour cette offre.'}
                  </p>
                </div>

                {/* Compare Variants */}
                <div>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.65rem', textTransform: 'uppercase' }}>
                    Toutes les variantes de ce CV ({currentCV.variants.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {currentCV.variants.map((v, i) => (
                      <div
                        key={v.id}
                        onClick={() => handleSwitchVariant(v.id)}
                        style={{
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: v.id === activeVariant.id ? 'rgba(79, 70, 229, 0.15)' : 'var(--bg-app)',
                          border: v.id === activeVariant.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: v.id === activeVariant.id ? '#c7d2fe' : 'var(--text-main)' }}>
                            {v.label}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                            {v.layout.columns} colonne(s) • Couleur {v.layout.primaryColor}
                          </div>
                        </div>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                          {v.matchScore}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={handleDuplicateCurrentVariant}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      backgroundColor: 'var(--bg-card-hover)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <Copy size={14} /> Dupliquer la variante
                  </button>

                  {currentCV.variants.length > 1 && (
                    <button
                      onClick={handleDeleteCurrentVariant}
                      style={{
                        padding: '0.6rem 0.85rem',
                        backgroundColor: 'rgba(244, 63, 94, 0.1)',
                        color: '#f43f5e',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        border: '1px solid rgba(244, 63, 94, 0.3)'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TAB: MATCHING & KEYWORDS */}
            {activeTab === 'match' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Match Score Gauge */}
                <div style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Score d'Appariement Déterministe
                  </span>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981', fontFamily: 'var(--font-mono)', margin: '0.3rem 0' }}>
                    {activeVariant.matchScore}%
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Calculé d'après les logiciels requis dans l'offre (ex: <strong>Fusion 360</strong>) et votre vivier de compétences.
                  </p>
                </div>

                {/* Priority Skills Reordering */}
                <div>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.65rem', textTransform: 'uppercase' }}>
                    Compétences & Priorités dans ce CV
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {activeVariant.content.skills.map((skill, index) => (
                      <div
                        key={skill.id}
                        style={{
                          padding: '0.6rem 0.75rem',
                          backgroundColor: skill.isTopMatch ? 'rgba(79, 70, 229, 0.12)' : 'var(--bg-app)',
                          border: skill.isTopMatch ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.82rem', color: skill.isTopMatch ? '#c7d2fe' : 'var(--text-main)' }}>
                              #{index + 1} {skill.name}
                            </span>
                            {skill.isTopMatch && <Zap size={13} color="#818cf8" />}
                          </div>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                            {skill.level} • {skill.customNote || 'Pertinence confirmée'}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            // Toggle top match status
                            const updated = activeVariant.content.skills.map(s => 
                              s.id === skill.id ? { ...s, isTopMatch: !s.isTopMatch } : s
                            );
                            // Re-sort: top match on top
                            updated.sort((a, b) => (b.isTopMatch ? 1 : 0) - (a.isTopMatch ? 1 : 0));
                            handleUpdateActiveVariant({
                              content: { ...activeVariant.content, skills: updated }
                            });
                          }}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: skill.isTopMatch ? '#10b981' : 'var(--text-muted)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-card)'
                          }}
                        >
                          {skill.isTopMatch ? '★ En tête' : 'Promouvoir'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DESIGN & LAYOUT */}
            {activeTab === 'design' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Columns Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Structure des Colonnes
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleUpdateActiveVariant({ layout: { ...activeVariant.layout, columns: 1 } })}
                      style={{
                        padding: '0.6rem',
                        backgroundColor: activeVariant.layout.columns === 1 ? 'var(--primary)' : 'var(--bg-app)',
                        color: activeVariant.layout.columns === 1 ? '#ffffff' : 'var(--text-main)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        border: '1px solid var(--border)'
                      }}
                    >
                      1 Colonne (Executive)
                    </button>
                    <button
                      onClick={() => handleUpdateActiveVariant({ layout: { ...activeVariant.layout, columns: 2 } })}
                      style={{
                        padding: '0.6rem',
                        backgroundColor: activeVariant.layout.columns === 2 ? 'var(--primary)' : 'var(--bg-app)',
                        color: activeVariant.layout.columns === 2 ? '#ffffff' : 'var(--text-main)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        border: '1px solid var(--border)'
                      }}
                    >
                      2 Colonnes (Moderne)
                    </button>
                  </div>
                </div>

                {/* Sidebar Position & Width if 2 columns */}
                {activeVariant.layout.columns === 2 && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Position & Largeur de la Barre Latérale
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <button
                        onClick={() => handleUpdateActiveVariant({ layout: { ...activeVariant.layout, sidebarPosition: 'left' } })}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: activeVariant.layout.sidebarPosition === 'left' ? 'var(--bg-card-hover)' : 'var(--bg-app)',
                          color: 'var(--text-main)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          border: activeVariant.layout.sidebarPosition === 'left' ? '1px solid var(--primary)' : '1px solid var(--border)'
                        }}
                      >
                        Sidebar à Gauche
                      </button>
                      <button
                        onClick={() => handleUpdateActiveVariant({ layout: { ...activeVariant.layout, sidebarPosition: 'right' } })}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: activeVariant.layout.sidebarPosition === 'right' ? 'var(--bg-card-hover)' : 'var(--bg-app)',
                          color: 'var(--text-main)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          border: activeVariant.layout.sidebarPosition === 'right' ? '1px solid var(--primary)' : '1px solid var(--border)'
                        }}
                      >
                        Sidebar à Droite
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {[30, 35, 40].map(pct => (
                        <button
                          key={pct}
                          onClick={() => handleUpdateActiveVariant({ layout: { ...activeVariant.layout, sidebarWidthPercentage: pct } })}
                          style={{
                            flex: 1,
                            padding: '0.4rem',
                            backgroundColor: activeVariant.layout.sidebarWidthPercentage === pct ? 'var(--primary)' : 'var(--bg-app)',
                            color: activeVariant.layout.sidebarWidthPercentage === pct ? '#ffffff' : 'var(--text-dim)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          {pct}% largeur
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Palettes */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Palette de Couleurs
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.5rem' }}>
                    {COLOR_PALETTES.map(cp => (
                      <div
                        key={cp.primary}
                        onClick={() => handleUpdateActiveVariant({ layout: { ...activeVariant.layout, primaryColor: cp.primary, secondaryColor: cp.secondary } })}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: 'var(--bg-app)',
                          borderRadius: 'var(--radius-md)',
                          border: activeVariant.layout.primaryColor === cp.primary ? '2px solid var(--primary-focus)' : '1px solid var(--border)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: cp.primary }} />
                        <span style={{ fontSize: '0.74rem', fontWeight: 600 }}>{cp.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photo Display & Shape */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Affichage de la Photo
                    </label>
                    <button
                      onClick={() => handleUpdateActiveVariant({ layout: { ...activeVariant.layout, showPhoto: !activeVariant.layout.showPhoto } })}
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        backgroundColor: activeVariant.layout.showPhoto ? '#10b981' : 'var(--bg-app)',
                        color: activeVariant.layout.showPhoto ? '#ffffff' : 'var(--text-dim)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      {activeVariant.layout.showPhoto ? 'Photo Visible' : 'Photo Masquée'}
                    </button>
                  </div>

                  {activeVariant.layout.showPhoto && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
                      {(['circle', 'rounded', 'square'] as const).map(shape => (
                        <button
                          key={shape}
                          onClick={() => handleUpdateActiveVariant({ layout: { ...activeVariant.layout, photoStyle: shape } })}
                          style={{
                            padding: '0.4rem',
                            backgroundColor: activeVariant.layout.photoStyle === shape ? 'var(--bg-card-hover)' : 'var(--bg-app)',
                            color: 'var(--text-main)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            border: activeVariant.layout.photoStyle === shape ? '1px solid var(--primary)' : '1px solid var(--border)'
                          }}
                        >
                          {shape === 'circle' ? 'Cercle' : shape === 'rounded' ? 'Arrondi' : 'Carré'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Typography */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Typographie
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                    {(['Inter', 'Outfit'] as const).map(font => (
                      <button
                        key={font}
                        onClick={() => handleUpdateActiveVariant({ layout: { ...activeVariant.layout, fontFamily: font } })}
                        style={{
                          padding: '0.45rem',
                          backgroundColor: activeVariant.layout.fontFamily === font ? 'var(--primary)' : 'var(--bg-app)',
                          color: activeVariant.layout.fontFamily === font ? '#ffffff' : 'var(--text-main)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.78rem',
                          fontWeight: 600
                        }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CONTENT & TEXT PHRASING */}
            {activeTab === 'content' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Titre du CV adapté à l'offre
                  </label>
                  <input
                    type="text"
                    value={activeVariant.content.customTitle}
                    onChange={(e) => handleUpdateActiveVariant({
                      content: { ...activeVariant.content, customTitle: e.target.value }
                    })}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Accroche / Synthèse de présentation
                  </label>
                  <textarea
                    rows={5}
                    value={activeVariant.content.customSummary}
                    onChange={(e) => handleUpdateActiveVariant({
                      content: { ...activeVariant.content, customSummary: e.target.value }
                    })}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                      lineHeight: 1.45
                    }}
                  />
                </div>

                {/* Section Visibility Toggles */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.65rem', textTransform: 'uppercase' }}>
                    Visibilité des Sections
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                    {Object.entries(activeVariant.visibility).map(([secKey, isVisible]) => (
                      <button
                        key={secKey}
                        onClick={() => handleUpdateActiveVariant({
                          visibility: {
                            ...activeVariant.visibility,
                            [secKey]: !isVisible
                          }
                        })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.45rem 0.65rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: isVisible ? 'var(--bg-app)' : 'rgba(15, 23, 42, 0.4)',
                          border: isVisible ? '1px solid var(--border)' : '1px dashed var(--border)',
                          fontSize: '0.75rem',
                          color: isVisible ? 'var(--text-main)' : 'var(--text-dim)'
                        }}
                      >
                        <span style={{ textTransform: 'capitalize' }}>{secKey}</span>
                        {isVisible ? <Eye size={13} color="#10b981" /> : <EyeOff size={13} color="var(--text-dim)" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
