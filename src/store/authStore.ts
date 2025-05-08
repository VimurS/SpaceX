import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: (token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const storedAuth = localStorage.getItem('auth') === 'true';
  return {
    isAuthenticated: storedAuth,
    login: (token?: string) => {
      localStorage.setItem('auth', 'true');
      if (token) localStorage.setItem('token', token);
      set({ isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('auth');
      localStorage.removeItem('token');
      set({ isAuthenticated: false });
    }
  };
});
