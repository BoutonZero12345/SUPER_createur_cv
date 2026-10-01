import React, { useState } from 'react';
import { MasterProfile, SkillItem, ExperienceItem, EducationItem } from '../../types';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Cpu, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  ArrowLeft,
  Check
} from 'lucide-react';

interface MasterProfileEditorProps {
  profile: MasterProfile;
  onSave: (updated: MasterProfile) => void;
  onBack: () => void;
}

export const MasterProfileEditor: React.FC<MasterProfileEditorProps> = ({ profile, onSave, onBack }) => {
  const [formData, setFormData] = useState<MasterProfile>(profile);
  const [activeTab, setActiveTab] = useState<'info' | 'skills' | 'experiences' | 'education'>('skills');
  const [savedNotification, setSavedNotification] = useState(false);

  // New Skill quick input
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillItem['category']>('Modélisation & CAO');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillItem['level']>('Avancé');
  const [newSkillAliases, setNewSkillAliases] = useState('');

  const handleSave = () => {
    onSave(formData);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: SkillItem = {
      id: `sk_${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
      aliases: newSkillAliases.split(',').map(s => s.trim()).filter(Boolean),
      yearsOfExperience: 2
    };

    setFormData(prev => ({
      ...prev,
      skills: [newSkill, ...prev.skills]
    }));

    setNewSkillName('');
    setNewSkillAliases('');
  };

  const handleDeleteSkill = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== skillId)
    }));
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onBack}
            style={{
              padding: '0.5rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)'
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              Profil Maître & Vivier de Compétences
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Définissez ici l'intégralité de vos savoir-faire. TailorCV sélectionnera les éléments pertinents pour chaque offre.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.4rem',
            backgroundColor: savedNotification ? '#10b981' : 'var(--primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: 'var(--shadow-glow)',
            transition: 'background-color var(--transition-fast)'
          }}
        >
          {savedNotification ? <Check size={18} /> : <Save size={18} />}
          {savedNotification ? 'Enregistré avec succès !' : 'Enregistrer le Profil'}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border)',
        marginBottom: '1.75rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem'
      }}>
        <button
          onClick={() => setActiveTab('skills')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.65rem 1.1rem',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: activeTab === 'skills' ? '#818cf8' : 'var(--text-muted)',
            backgroundColor: activeTab === 'skills' ? 'var(--bg-card)' : 'transparent',
            borderBottom: activeTab === 'skills' ? '2px solid #818cf8' : '2px solid transparent'
          }}
        >
          <Cpu size={16} />
          Compétences & Outils ({formData.skills.length})
        </button>

        <button
          onClick={() => setActiveTab('info')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.65rem 1.1rem',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: activeTab === 'info' ? '#818cf8' : 'var(--text-muted)',
            backgroundColor: activeTab === 'info' ? 'var(--bg-card)' : 'transparent',
            borderBottom: activeTab === 'info' ? '2px solid #818cf8' : '2px solid transparent'
          }}
        >
          <User size={16} />
          Coordonnées & Pitch
        </button>

        <button
          onClick={() => setActiveTab('experiences')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.65rem 1.1rem',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: activeTab === 'experiences' ? '#818cf8' : 'var(--text-muted)',
            backgroundColor: activeTab === 'experiences' ? 'var(--bg-card)' : 'transparent',
            borderBottom: activeTab === 'experiences' ? '2px solid #818cf8' : '2px solid transparent'
          }}
        >
          <Briefcase size={16} />
          Expériences & Stages ({formData.experiences.length})
        </button>

        <button
          onClick={() => setActiveTab('education')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.65rem 1.1rem',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: activeTab === 'education' ? '#818cf8' : 'var(--text-muted)',
            backgroundColor: activeTab === 'education' ? 'var(--bg-card)' : 'transparent',
            borderBottom: activeTab === 'education' ? '2px solid #818cf8' : '2px solid transparent'
          }}
        >
          <GraduationCap size={16} />
          Formations & Diplômes ({formData.education.length})
        </button>
      </div>

      {/* Tab 1: Skills Repository (Le Vivier de compétences) */}
      {activeTab === 'skills' && (
        <div className="animate-fade-in">
          {/* Add Skill Box */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} color="#818cf8" />
              Ajouter une compétence au vivier maître
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Exemple : Fusion 360, SolidWorks, Python, Impression 3D...
            </p>

            <form onSubmit={handleAddSkill} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Nom de l'outil ou compétence *</label>
                <input
                  type="text"
                  placeholder="ex: Fusion 360"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
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
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Catégorie</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Modélisation & CAO">Modélisation & CAO</option>
                  <option value="Technique / Outils">Technique / Outils</option>
                  <option value="Langages & Tech">Langages & Tech</option>
                  <option value="Méthodologie">Méthodologie</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Langues">Langues</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Niveau</label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Expert">Expert</option>
                  <option value="Avancé">Avancé</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Débutant">Débutant</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Alias / Mots-clés alternatifs (séparés par virgule)</label>
                <input
                  type="text"
                  placeholder="ex: Autodesk, CAO, 3D"
                  value={newSkillAliases}
                  onChange={(e) => setNewSkillAliases(e.target.value)}
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

              <button
                type="submit"
                style={{
                  padding: '0.55rem 1rem',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <Plus size={16} />
                Ajouter
              </button>
            </form>
          </div>

          {/* Skills Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1rem'
          }}>
            {formData.skills.map((skill) => (
              <div
                key={skill.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      {skill.name}
                    </span>
                    <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                      {skill.level}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>
                    {skill.category}
                  </div>
                  {skill.aliases && skill.aliases.length > 0 && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Alias : {skill.aliases.join(', ')}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  style={{ color: 'var(--text-dim)', padding: '0.3rem' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--rose)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Coordonnées & Pitch */}
      {activeTab === 'info' && (
        <div className="animate-fade-in" style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '1.75rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Prénom</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Nom</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Titre cible par défaut (Métier / Poste)</label>
            <input
              type="text"
              value={formData.targetTitle}
              onChange={(e) => setFormData({ ...formData, targetTitle: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Localisation & Mobilité</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Accroche / Résumé de présentation par défaut</label>
            <textarea
              rows={4}
              value={formData.defaultSummary}
              onChange={(e) => setFormData({ ...formData, defaultSummary: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', lineHeight: 1.5 }}
            />
          </div>
        </div>
      )}

      {/* Tab 3: Expériences */}
      {activeTab === 'experiences' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {formData.experiences.map((exp, index) => (
            <div
              key={exp.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                  {exp.title} • <span style={{ color: '#818cf8' }}>{exp.company}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {exp.startDate} à {exp.endDate || 'Présent'}
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {exp.description}
              </p>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {exp.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Formations */}
      {activeTab === 'education' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {formData.education.map((edu) => (
            <div
              key={edu.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                padding: '1.25rem'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
                {edu.degree}
              </div>
              <div style={{ color: '#818cf8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                {edu.school} ({edu.startDate} - {edu.endDate})
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {edu.details}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
