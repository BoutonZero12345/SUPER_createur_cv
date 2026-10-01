import { MasterProfile, CVDocument, JobOffer, User } from '../types';
import { INITIAL_USER, INITIAL_MASTER_PROFILE, INITIAL_CV_DOCUMENTS, SAMPLE_JOB_OFFERS } from '../data/mockData';

const STORAGE_KEYS = {
  USER: 'tailorcv_user_session',
  MASTER_PROFILE: 'tailorcv_master_profile',
  CV_DOCS: 'tailorcv_cv_documents',
  JOB_OFFERS: 'tailorcv_job_offers',
};

export interface CompletenessReport {
  score: number; // 0 - 100
  items: {
    id: string;
    label: string;
    completed: boolean;
    points: number;
    actionHint: string;
  }[];
}

export const StorageAdapter = {
  // 1. User Session
  getUser(): User {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USER;
  },

  saveUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // 2. Master Profile
  getMasterProfile(): MasterProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MASTER_PROFILE);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MASTER_PROFILE;
  },

  saveMasterProfile(profile: MasterProfile): void {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.MASTER_PROFILE, JSON.stringify(profile));
  },

  // 3. CV Documents
  getCVDocuments(): CVDocument[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CV_DOCS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CV_DOCUMENTS;
  },

  saveCVDocuments(docs: CVDocument[]): void {
    localStorage.setItem(STORAGE_KEYS.CV_DOCS, JSON.stringify(docs));
  },

  saveSingleCV(cv: CVDocument): void {
    const list = this.getCVDocuments();
    const index = list.findIndex(item => item.id === cv.id);
    cv.updatedAt = new Date().toISOString();
    if (index >= 0) {
      list[index] = cv;
    } else {
      list.unshift(cv);
    }
    this.saveCVDocuments(list);
  },

  deleteCV(cvId: string): void {
    const list = this.getCVDocuments().filter(item => item.id !== cvId);
    this.saveCVDocuments(list);
  },

  // 4. Job Offers
  getJobOffers(): JobOffer[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.JOB_OFFERS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_JOB_OFFERS;
  },

  saveJobOffer(offer: JobOffer): void {
    const list = this.getJobOffers();
    const index = list.findIndex(o => o.id === offer.id);
    if (index >= 0) {
      list[index] = offer;
    } else {
      list.unshift(offer);
    }
    localStorage.setItem(STORAGE_KEYS.JOB_OFFERS, JSON.stringify(list));
  },

  // 5. Completeness Calculator
  calculateProfileCompleteness(profile: MasterProfile): CompletenessReport {
    const items = [
      {
        id: 'phone',
        label: 'Numéro de téléphone renseigné',
        completed: Boolean(profile.phone && profile.phone.trim().length > 6),
        points: 10,
        actionHint: 'Ajouter votre téléphone pour être joignable par les recruteurs'
      },
      {
        id: 'location',
        label: 'Localisation & mobilité définies',
        completed: Boolean(profile.location && profile.location.trim().length > 3),
        points: 10,
        actionHint: 'Préciser votre ville et si vous êtes mobile'
      },
      {
        id: 'photo',
        label: 'Photo professionnelle ajoutée',
        completed: Boolean(profile.photoUrl && profile.photoUrl.trim().length > 5),
        points: 10,
        actionHint: 'Ajouter une photo de profil nette'
      },
      {
        id: 'summary',
        label: 'Résumé / Pitch de présentation rédigé',
        completed: Boolean(profile.defaultSummary && profile.defaultSummary.trim().length > 30),
        points: 15,
        actionHint: 'Rédiger une accroche résumant vos points forts'
      },
      {
        id: 'skills',
        label: 'Au moins 5 compétences dans votre vivier',
        completed: Boolean(profile.skills && profile.skills.length >= 5),
        points: 20,
        actionHint: 'Ajouter vos logiciels et savoir-faire clés (ex: Fusion 360, etc.)'
      },
      {
        id: 'experiences',
        label: 'Au moins 1 expérience ou stage renseigné',
        completed: Boolean(profile.experiences && profile.experiences.length >= 1),
        points: 20,
        actionHint: 'Détailler vos stages, projets ou emplois passés'
      },
      {
        id: 'education',
        label: 'Parcours de formation / diplômes renseigné',
        completed: Boolean(profile.education && profile.education.length >= 1),
        points: 15,
        actionHint: 'Ajouter votre formation actuelle ou diplôme visé'
      }
    ];

    const earnedPoints = items.reduce((acc, curr) => acc + (curr.completed ? curr.points : 0), 0);

    return {
      score: Math.min(100, earnedPoints),
      items
    };
  },

  // 6. Backup & Export / Import JSON
  exportDataJSON(): string {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: this.getUser(),
      masterProfile: this.getMasterProfile(),
      cvDocuments: this.getCVDocuments(),
      jobOffers: this.getJobOffers()
    };
    return JSON.stringify(fullBackup, null, 2);
  },

  importDataJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.masterProfile) localStorage.setItem(STORAGE_KEYS.MASTER_PROFILE, JSON.stringify(data.masterProfile));
      if (data.cvDocuments) localStorage.setItem(STORAGE_KEYS.CV_DOCS, JSON.stringify(data.cvDocuments));
      if (data.jobOffers) localStorage.setItem(STORAGE_KEYS.JOB_OFFERS, JSON.stringify(data.jobOffers));
      if (data.user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  },

  resetDemo(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.MASTER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.CV_DOCS);
    localStorage.removeItem(STORAGE_KEYS.JOB_OFFERS);
  }
};
