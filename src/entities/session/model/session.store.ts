import { create } from 'zustand';
import { Session } from './types';
import { LocalStorageFactory } from '@/src/shared/lib/localStorage';

type SessionStore = {
  currentSession?: Session;
  isLoading: boolean;
  setCurrentSession: (session: Session) => void;
  loadCurrentSession: () => void;
  removeSession: () => void;
};

const sessionLStorage = new LocalStorageFactory('session');

export const useSession = create<SessionStore>(set => ({
  currentSession: undefined,
  isLoading: true,
  loadCurrentSession: async () => {
    const session = sessionLStorage.get<Session>();
    set({ currentSession: session, isLoading: false });
  },
  setCurrentSession: session => {
    sessionLStorage.set(session);
    set(() => ({ currentSession: session }));
  },
  removeSession: () => {
    sessionLStorage.remove();
    set(() => ({ currentSession: undefined }));
  },
}));
