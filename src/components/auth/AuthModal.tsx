import React, { useState } from 'react';
import { User } from '../../types';
import { INITIAL_USER } from '../../data/mockData';
import { X, Lock, Mail, User as UserIcon, Github, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    const authenticatedUser: User = {
      id: `usr_${Date.now()}`,
      email,
      name: isSignUp ? (name || email.split('@')[0]) : (name || INITIAL_USER.name),
      avatarUrl: INITIAL_USER.avatarUrl,
      createdAt: new Date().toISOString()
    };

    onLoginSuccess(authenticatedUser);
    onClose();
  };

  const handleDemoLogin = () => {
    onLoginSuccess(INITIAL_USER);
    onClose();
  };

  const handleGithubLogin = () => {
    // Simulated GitHub OAuth flow with high fidelity
    const ghUser: User = {
      id: 'usr_gh_99',
      email: 'lucas.martin@github.com',
      name: 'Lucas Martin (via GitHub)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      createdAt: new Date().toISOString()
    };
    onLoginSuccess(ghUser);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div 
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          padding: '2rem',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: 'var(--text-dim)',
            padding: '0.25rem'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Lock size={22} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.35rem' }}>
            {isSignUp ? 'Créer votre compte TailorCV' : 'Connexion à votre espace'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isSignUp 
              ? 'Synchronisez vos CVs et profils en ligne en toute sécurité' 
              : 'Accédez à votre galerie de CVs ciblés et à vos métriques'}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.65rem 0.85rem',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#f43f5e',
            fontSize: '0.8rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* GitHub Direct Auth */}
        <button
          onClick={handleGithubLogin}
          type="button"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            padding: '0.65rem',
            backgroundColor: '#24292f',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.88rem',
            border: '1px solid #30363d',
            marginBottom: '1rem',
            transition: 'var(--transition-fast)'
          }}
        >
          <Github size={18} />
          Continuer avec GitHub
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          margin: '1rem 0',
          color: 'var(--text-dim)',
          fontSize: '0.75rem'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
          <span>ou avec votre email</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {isSignUp && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Nom complet
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Lucas Martin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem 0.6rem 2.2rem',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
                <UserIcon size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="votre.email@domaine.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem 0.6rem 2.2rem',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
              <Mail size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem 0.6rem 2.2rem',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
              <Lock size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.7rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            {isSignUp ? 'Créer mon compte' : 'Se connecter'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Toggle sign in / sign up */}
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'underline' }}
          >
            {isSignUp ? 'Se connecter' : 'Créer un compte gratuitement'}
          </button>
        </div>

        {/* Quick Demo Login Option */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.85rem',
          backgroundColor: 'var(--bg-app)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-light)',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#10b981', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            <ShieldCheck size={14} /> Accès Direct Rapide Démo
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.6rem' }}>
            Tester immédiatement avec le compte Ingénieur CAO (Lucas Martin)
          </p>
          <button
            onClick={handleDemoLogin}
            type="button"
            style={{
              padding: '0.4rem 0.9rem',
              backgroundColor: 'var(--bg-card-hover)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: '1px solid var(--border)'
            }}
          >
            Se connecter avec le profil démo
          </button>
        </div>
      </div>
    </div>
  );
};
