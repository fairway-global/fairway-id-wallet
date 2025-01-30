// store/store.ts
import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import {
  AuthState,
  Err,
  IEducationCredential,
  IIdentityCredential,
  IWorkCredential,
  UserState,
} from "../utils/types";

interface AppState {
  // Auth State
  auth: AuthState | null;
  setAuth: (auth: AuthState) => void;
  clearAuth: () => void;

  // User State
  user: UserState | null;
  setUser: (user: UserState) => void;
  clearUser: () => void;

  // Identity Credential
  identityCredential: IIdentityCredential | null;
  setIdentityCredential: (credential: IIdentityCredential) => void;
  clearIdentityCredential: () => void;

  // Education Credentials
  educationCredentials: IEducationCredential[];
  setEducationCredentials: (credentials: IEducationCredential[]) => void;
  addEducationCredential: (credential: IEducationCredential) => void;
  removeEducationCredential: (id: number) => void;

  // Work Credentials
  workCredentials: IWorkCredential[];
  setWorkCredentials: (credentials: IWorkCredential[]) => void;
  addWorkCredential: (credential: IWorkCredential) => void;
  removeWorkCredential: (id: number) => void;

  // Error Handling
  error: Err | null;
  setError: (error: Err) => void;
  clearError: () => void;
}

type MyPersist = (
  config: StateCreator<AppState>,
  options: PersistOptions<AppState>
) => StateCreator<AppState>;

const useStore = create<AppState>(
  (persist as MyPersist)(
    (set) => ({
      // Auth State
      auth: null,
      setAuth: (auth) => set({ auth }),
      clearAuth: () => set({ auth: null }),

      // User State
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      // Identity Credential
      identityCredential: null,
      setIdentityCredential: (credential) =>
        set({ identityCredential: credential }),
      clearIdentityCredential: () => set({ identityCredential: null }),

      // Education Credentials
      educationCredentials: [],
      setEducationCredentials: (credentials) =>
        set({ educationCredentials: credentials }),
      addEducationCredential: (credential) =>
        set((state) => ({
          educationCredentials: [...state.educationCredentials, credential],
        })),
      removeEducationCredential: (id) =>
        set((state) => ({
          educationCredentials: state.educationCredentials.filter(
            (cred) => cred.id !== id
          ),
        })),

      // Work Credentials
      workCredentials: [],
      setWorkCredentials: (credentials) =>
        set({ workCredentials: credentials }),
      addWorkCredential: (credential) =>
        set((state) => ({
          workCredentials: [...state.workCredentials, credential],
        })),
      removeWorkCredential: (id) =>
        set((state) => ({
          workCredentials: state.workCredentials.filter(
            (cred) => cred.id !== id
          ),
        })),

      // Error Handling
      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "app-storage", // Key for localStorage
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) =>
          localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

export default useStore;
