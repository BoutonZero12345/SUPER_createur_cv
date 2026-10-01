import React, { useState, useEffect } from 'react';
import { User, MasterProfile, CVDocument, JobOffer } from './types';
import { StorageAdapter, CompletenessReport } from './db/storageAdapter';
import { Navbar } from './components/common/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { Dashboard } from './components/dashboard/Dashboard';
import { MasterProfileEditor } from './components/masterProfile/MasterProfileEditor';
import { NewCVWizard } from './components/wizard/NewCVWizard';
import { CVStudio } from './components/studio/CVStudio';
import confetti from 'canvas-confetti';

export function App() {
  // Core state from storage adapter
  const [user, setUser] = useState<User | null>(() => StorageAdapter.getUser());
  const [masterProfile, setMasterProfile] = useState<MasterProfile>(() => StorageAdapter.getMasterProfile());
  const [cvDocuments, setCvDocuments] = useState<CVDocument[]>(() => StorageAdapter.getCVDocuments());
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'studio' | 'wizard'>('dashboard');
  const [activeStudioCVId, setActiveStudioCVId] = useState<string | null>(() => {
    const docs = StorageAdapter.getCVDocuments();
    return docs.length > 0 ? docs[0].id : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Compute profile completeness
  const [completeness, setCompleteness] = useState<CompletenessReport>(() => 
    StorageAdapter.calculateProfileCompleteness(masterProfile)
  );

  useEffect(() => {
    setCompleteness(StorageAdapter.calculateProfileCompleteness(masterProfile));
  }, [masterProfile]);

  // Auth actions
  const handleLoginSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    StorageAdapter.saveUser(authenticatedUser);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tailorcv_user_session');
  };

  // Master profile actions
  const handleSaveMasterProfile = (updatedProfile: MasterProfile) => {
    setMasterProfile(updatedProfile);
    StorageAdapter.saveMasterProfile(updatedProfile);
  };

  // CV Studio actions
  const handleOpenStudio = (cvId: string) => {
    setActiveStudioCVId(cvId);
    setActiveView('studio');
  };

  const handleSaveCV = (updatedCV: CVDocument) => {
    StorageAdapter.saveSingleCV(updatedCV);
    setCvDocuments(StorageAdapter.getCVDocuments());
  };

  const handleDuplicateCV = (cvId: string) => {
    const target = cvDocuments.find(d => d.id === cvId);
    if (!target) return;

    const duplicated: CVDocument = {
      ...JSON.parse(JSON.stringify(target)),
      id: `cv_${Date.now()}`,
      jobTitleTarget: `${target.jobTitleTarget} (Copie)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageAdapter.saveSingleCV(duplicated);
    setCvDocuments(StorageAdapter.getCVDocuments());
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleDeleteCV = (cvId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce CV ?')) {
      StorageAdapter.deleteCV(cvId);
      setCvDocuments(StorageAdapter.getCVDocuments());
    }
  };

  // Wizard action
  const handleWizardFinish = (newCV: CVDocument, newOffer?: JobOffer) => {
    if (newOffer) {
      StorageAdapter.saveJobOffer(newOffer);
    }
    StorageAdapter.saveSingleCV(newCV);
    setCvDocuments(StorageAdapter.getCVDocuments());
    setActiveStudioCVId(newCV.id);
    setActiveView('studio');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const jsonStr = StorageAdapter.exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tailorcv-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentStudioCV = cvDocuments.find(d => d.id === activeStudioCVId) || cvDocuments[0];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        user={user}
        masterProfile={masterProfile}
        completeness={completeness}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onExportBackup={handleExportBackup}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeView === 'dashboard' && (
          <Dashboard
            user={user || { id: 'anon', name: 'Utilisateur Invité', email: 'invite@tailorcv.pro', createdAt: '' }}
            masterProfile={masterProfile}
            cvDocuments={cvDocuments}
            completeness={completeness}
            onOpenStudio={handleOpenStudio}
            onCreateNewCV={() => setActiveView('wizard')}
            onOpenProfile={() => setActiveView('profile')}
            onDuplicateCV={handleDuplicateCV}
            onDeleteCV={handleDeleteCV}
          />
        )}

        {activeView === 'profile' && (
          <MasterProfileEditor
            profile={masterProfile}
            onSave={handleSaveMasterProfile}
            onBack={() => setActiveView('dashboard')}
          />
        )}

        {activeView === 'wizard' && (
          <NewCVWizard
            masterProfile={masterProfile}
            onFinish={handleWizardFinish}
            onCancel={() => setActiveView('dashboard')}
          />
        )}

        {activeView === 'studio' && currentStudioCV && (
          <CVStudio
            cv={currentStudioCV}
            masterProfile={masterProfile}
            onSaveCV={handleSaveCV}
            onBack={() => setActiveView('dashboard')}
          />
        )}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
