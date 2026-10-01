import React from 'react';
import { User, MasterProfile } from '../../types';
import { CompletenessReport } from '../../db/storageAdapter';
import { 
  FileText, 
  PlusCircle, 
  User as UserIcon, 
  CheckCircle2, 
  Sparkles, 
  LogOut, 
  Layers, 
  DownloadCloud
} from 'lucide-react';

interface NavbarProps {
  user: User | null;
  masterProfile: MasterProfile;
  completeness: CompletenessReport;
  activeView: 'dashboard' | 'profile' | 'studio' | 'wizard';
  onNavigate: (view: 'dashboard' | 'profile' | 'wizard') => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onExportBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  masterProfile,
  completeness,
  activeView,
  onNavigate,
  onOpenAuth,
  onLogout,
  onExportBackup
}) => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1.5rem',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)'
    }}>
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div 
          onClick={() => onNavigate('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <FileText size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ 
                fontFamily: 'var(--font-display)', 
                fontWeight: 800, 
                fontSize: '1.2rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Tailor<span style={{ color: '#818cf8', WebkitTextFillColor: '#818cf8' }}>CV</span>
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                PRO SaaS
              </span>
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        {user && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
            <button
              onClick={() => onNavigate('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: activeView === 'dashboard' ? '#ffffff' : 'var(--text-muted)',
                backgroundColor: activeView === 'dashboard' ? 'var(--bg-card-hover)' : 'transparent',
                transition: 'var(--transition-fast)'
              }}
            >
              <Layers size={16} />
              Mes CVs & Galerie
            </button>

            <button
              onClick={() => onNavigate('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: activeView === 'profile' ? '#ffffff' : 'var(--text-muted)',
                backgroundColor: activeView === 'profile' ? 'var(--bg-card-hover)' : 'transparent',
                transition: 'var(--transition-fast)'
              }}
            >
              <UserIcon size={16} />
              Profil Maître & Compétences
            </button>
          </nav>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            {/* Profile Completeness Meter */}
            <div 
              onClick={() => onNavigate('profile')}
              title="Cliquez pour compléter votre profil maître"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.35rem 0.75rem',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              <CheckCircle2 size={15} color={completeness.score >= 80 ? '#10b981' : '#f59e0b'} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.72rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Profil Maître</span>
                  <span style={{ fontWeight: 700, color: completeness.score >= 80 ? '#34d399' : '#fbbf24' }}>
                    {completeness.score}%
                  </span>
                </div>
                <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${completeness.score}%`,
                    height: '100%',
                    backgroundColor: completeness.score >= 80 ? '#10b981' : '#f59e0b',
                    borderRadius: '2px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            </div>

            {/* Quick Export Data Backup */}
            <button
              onClick={onExportBackup}
              title="Sauvegarder / Exporter mes données en JSON"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.7rem',
                backgroundColor: 'var(--bg-card-hover)',
                color: 'var(--text-muted)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                border: '1px solid var(--border)'
              }}
            >
              <DownloadCloud size={15} />
              <span style={{ display: 'none' }}>Export</span>
            </button>

            {/* New CV Button */}
            <button
              onClick={() => onNavigate('wizard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.1rem',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-glow)',
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary)')}
            >
              <PlusCircle size={16} />
              Créer un nouveau CV
            </button>

            {/* User Profile & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--primary)' }}
                />
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  {user.name.charAt(0)}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{user.email.split('@')[0]}</span>
              </div>
              <button 
                onClick={onLogout}
                title="Déconnexion"
                style={{ color: 'var(--text-dim)', padding: '0.35rem', marginLeft: '0.25rem' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--rose)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
              >
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={onOpenAuth}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1.2rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Sparkles size={16} />
            Se connecter / Créer un compte
          </button>
        )}
      </div>
    </header>
  );
};
