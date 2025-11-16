import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from './auth';

interface AuthState {
    // 인증 상태
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    setAuth: (authData: AuthResponse) => void;
    setUser: (user: User) => void;
    setTokens: (accessToken: string, refreshToken?: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setAuth: (authData) =>
                set({
                    user: authData.user,
                    accessToken: authData.accessToken,
                    refreshToken: authData.refreshToken || null,
                    isAuthenticated: true,
                    error: null,
                }),

            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: true,
                }),

            setTokens: (accessToken, refreshToken) =>
                set({
                    accessToken,
                    refreshToken: refreshToken || null,
                }),

            logout: () =>
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    error: null,
                }),

            setLoading: (loading) => set({ isLoading: loading }),

            setError: (error) => set({ error }),

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

