import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        theme: 'system',
        
        setTheme: (theme) => set({ theme }, false, 'setTheme'),
        
        setUser: (user) => set({ 
          user, 
          isAuthenticated: !!user 
        }, false, 'setUser'),
        
        logout: () => {
          localStorage.removeItem('auth_token')
          set({ user: null, isAuthenticated: false }, false, 'logout')
        },
      }),
      {
        name: 'agenticx-storage',
        partialize: (state) => ({ theme: state.theme }),
      }
    ),
    { name: 'AppStore' }
  )
)
