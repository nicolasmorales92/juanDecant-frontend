import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StateAuth } from '../lib/interfaces/usuario/authUsuario';

export const useStateAuth = create<StateAuth>()(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      estaAutenticado: false,

      login: (token, usuario) => {
        set({ token, usuario, estaAutenticado: true });
      },

      logout: () => {
        set({ token: null, usuario: null, estaAutenticado: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage), 
    }
  )
);