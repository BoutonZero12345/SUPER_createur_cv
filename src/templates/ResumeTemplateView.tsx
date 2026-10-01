import React from 'react';
import { CVVariant, MasterProfile } from '../types';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Briefcase, 
  GraduationCap, 
  Cpu, 
  FolderGit2, 
  Languages, 
  Award,
  Zap
} from 'lucide-react';

interface ResumeTemplateViewProps {
  variant: CVVariant;
  masterProfile: MasterProfile;
  isEditable?: boolean;
  onUpdateContent?: (updatedContent: Partial<CVVariant['content']>) => void;
}

export const ResumeTemplateView: React.FC<ResumeTemplateViewProps> = ({
  variant,
  masterProfile,
  isEditable = false,
  onUpdateContent
}) => {
  const { layout, visibility, content } = variant;

  const primaryColor = layout.primaryColor || '#2563eb';
  const fontFamily = layout.fontFamily || 'Inter';
  const isTwoColumns = layout.columns === 2;
  const isSidebarLeft = layout.sidebarPosition === 'left';
  const sidebarWidth = `${layout.sidebarWidthPercentage || 35}%`;

  const handleTitleChange = (val: string) => {
    if (onUpdateContent) onUpdateContent({ customTitle: val });
  };

  const handleSummaryChange = (val: string) => {
    if (onUpdateContent) onUpdateContent({ customSummary: val });
  };

  // Section renderers
  const renderSummarySection = () => {
    if (!visibility.summary || !content.customSummary) return null;
    return (
      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{
          fontSize: '0.82rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: primaryColor,
          borderBottom: `1.5px solid ${primaryColor}`,
          paddingBottom: '0.2rem',
          marginBottom: '0.5rem'
        }}>
          Profil & Objectif
        </h4>
        <p 
          contentEditable={isEditable}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleSummaryChange(e.currentTarget.textContent || '')}
          style={{
            fontSize: '0.78rem',
            lineHeight: 1.5,
            color: '#334155',
            outline: 'none',
            padding: isEditable ? '2px' : '0',
            borderRadius: '2px',
            backgroundColor: isEditable ? 'rgba(79, 70, 229, 0.03)' : 'transparent'
          }}
        >
          {content.customSummary}
        </p>
      </div>
    );
  };

  const renderSkillsSection = () => {
    if (!visibility.skills || !content.skills || content.skills.length === 0) return null;
    return (
      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{
          fontSize: '0.82rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: primaryColor,
          borderBottom: `1.5px solid ${primaryColor}`,
          paddingBottom: '0.2rem',
          marginBottom: '0.65rem'
        }}>
          Compétences & Outils
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {content.skills.map((skill) => (
            <div 
              key={skill.id}
              style={{
                padding: skill.isTopMatch ? '0.35rem 0.5rem' : '0.15rem 0',
                backgroundColor: skill.isTopMatch ? 'rgba(79, 70, 229, 0.06)' : 'transparent',
                borderRadius: '4px',
                borderLeft: skill.isTopMatch ? `3px solid ${primaryColor}` : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '0.76rem',
                  fontWeight: skill.isTopMatch ? 700 : 600,
                  color: skill.isTopMatch ? primaryColor : '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {skill.name}
                  {skill.isTopMatch && <Zap size={11} color={primaryColor} />}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {skill.level}
                </span>
              </div>
              {skill.customNote && (
                <div style={{ fontSize: '0.65rem', color: '#64748b', fontStyle: 'italic', marginTop: '0.1rem' }}>
                  {skill.customNote}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExperienceSection = () => {
    if (!visibility.experience || !content.experiences || content.experiences.length === 0) return null;
    return (
      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{
          fontSize: '0.82rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: primaryColor,
          borderBottom: `1.5px solid ${primaryColor}`,
          paddingBottom: '0.2rem',
          marginBottom: '0.75rem'
        }}>
          Expériences & Projets Industriels
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {content.experiences.map((exp) => (
            <div key={exp.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.15rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                  {exp.title}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
                  {exp.startDate} - {exp.endDate || 'Présent'}
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: primaryColor, marginBottom: '0.3rem' }}>
                {exp.company} {exp.location && `• ${exp.location}`}
              </div>
              {exp.description && (
                <p style={{ fontSize: '0.73rem', color: '#475569', marginBottom: '0.35rem', lineHeight: 1.4 }}>
                  {exp.description}
                </p>
              )}
              {exp.bullets && (
                <ul style={{ paddingLeft: '1rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} style={{ fontSize: '0.72rem', color: '#334155', lineHeight: 1.4 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducationSection = () => {
    if (!visibility.education || !content.education || content.education.length === 0) return null;
    return (
      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{
          fontSize: '0.82rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: primaryColor,
          borderBottom: `1.5px solid ${primaryColor}`,
          paddingBottom: '0.2rem',
          marginBottom: '0.65rem'
        }}>
          Formation & Diplômes
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {content.education.map((edu) => (
            <div key={edu.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                  {edu.degree}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: primaryColor, fontWeight: 600 }}>
                {edu.school} {edu.location && `• ${edu.location}`}
              </div>
              {edu.details && (
                <p style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.15rem' }}>
                  {edu.details}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectsSection = () => {
    if (!visibility.projects || !content.projects || content.projects.length === 0) return null;
    return (
      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{
          fontSize: '0.82rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: primaryColor,
          borderBottom: `1.5px solid ${primaryColor}`,
          paddingBottom: '0.2rem',
          marginBottom: '0.65rem'
        }}>
          Projets Réalisés
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {content.projects.map((proj) => (
            <div key={proj.id}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0f172a' }}>
                {proj.title}
              </div>
              <p style={{ fontSize: '0.71rem', color: '#475569', lineHeight: 1.35 }}>
                {proj.description}
              </p>
              {proj.technologies && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.2rem' }}>
                  {proj.technologies.map(t => (
                    <span key={t} style={{
                      fontSize: '0.62rem',
                      padding: '0.1rem 0.35rem',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '3px',
                      color: '#475569'
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguagesSection = () => {
    if (!visibility.languages || !content.languages || content.languages.length === 0) return null;
    return (
      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{
          fontSize: '0.82rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: primaryColor,
          borderBottom: `1.5px solid ${primaryColor}`,
          paddingBottom: '0.2rem',
          marginBottom: '0.5rem'
        }}>
          Langues
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {content.languages.map((l) => (
            <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{l.language}</span>
              <span style={{ color: '#64748b' }}>{l.proficiency}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Header Component
  const renderHeader = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: '1rem',
      marginBottom: '1.25rem',
      borderBottom: `2px solid ${primaryColor}`
    }}>
      <div style={{ flex: 1 }}>
        <h1 style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          color: '#0f172a',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: '0.25rem'
        }}>
          {masterProfile.firstName} {masterProfile.lastName}
        </h1>

        {/* Tailored Job Title */}
        <h2 
          contentEditable={isEditable}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleTitleChange(e.currentTarget.textContent || '')}
          style={{
            fontSize: '0.92rem',
            fontWeight: 700,
            color: primaryColor,
            lineHeight: 1.3,
            marginBottom: '0.55rem',
            outline: 'none'
          }}
        >
          {content.customTitle}
        </h2>

        {/* Contact Info Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.7rem', color: '#64748b' }}>
          {masterProfile.email && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Mail size={11} color={primaryColor} /> {masterProfile.email}
            </span>
          )}
          {masterProfile.phone && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Phone size={11} color={primaryColor} /> {masterProfile.phone}
            </span>
          )}
          {masterProfile.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={11} color={primaryColor} /> {masterProfile.location}
            </span>
          )}
        </div>
      </div>

      {/* Photo */}
      {layout.showPhoto && masterProfile.photoUrl && (
        <div style={{ marginLeft: '1rem' }}>
          <img
            src={masterProfile.photoUrl}
            alt={`${masterProfile.firstName} ${masterProfile.lastName}`}
            style={{
              width: '74px',
              height: '74px',
              objectFit: 'cover',
              borderRadius: layout.photoStyle === 'circle' ? '50%' : layout.photoStyle === 'rounded' ? '12px' : '4px',
              border: `2px solid ${primaryColor}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="a4-page"
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: '16mm 18mm',
        fontFamily,
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      {renderHeader()}

      {/* Body: 1 Column or 2 Columns Asymmetric */}
      {isTwoColumns ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isSidebarLeft ? `${sidebarWidth} 1fr` : `1fr ${sidebarWidth}`,
          gap: '1.5rem'
        }}>
          {isSidebarLeft ? (
            <>
              {/* Left Sidebar */}
              <div>
                {renderSkillsSection()}
                {renderEducationSection()}
                {renderLanguagesSection()}
              </div>
              {/* Right Main Body */}
              <div>
                {renderSummarySection()}
                {renderExperienceSection()}
                {renderProjectsSection()}
              </div>
            </>
          ) : (
            <>
              {/* Left Main Body */}
              <div>
                {renderSummarySection()}
                {renderExperienceSection()}
                {renderProjectsSection()}
              </div>
              {/* Right Sidebar */}
              <div>
                {renderSkillsSection()}
                {renderEducationSection()}
                {renderLanguagesSection()}
              </div>
            </>
          )}
        </div>
      ) : (
        /* Single Column Layout */
        <div>
          {renderSummarySection()}
          {renderSkillsSection()}
          {renderExperienceSection()}
          {renderEducationSection()}
          {renderProjectsSection()}
          {renderLanguagesSection()}
        </div>
      )}
    </div>
  );
};
