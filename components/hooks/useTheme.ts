'use client';

import { useState, useEffect, useCallback } from 'react';

const THEMES = ['sage', 'light', 'amber', 'dracula', 'cyan', 'matrix', 'openai'] as const;
export type Theme = typeof THEMES[number];
const THEME_STORAGE_KEY = 'app-theme';

export const useTheme = () => {
    const [theme, setThemeState] = useState<Theme>('openai');
    const [mounted, setMounted] = useState(false);

    // Load theme from localStorage after mount (SSR-safe)
    useEffect(() => {
        setMounted(true);
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        const isValidTheme = THEMES.includes(storedTheme as Theme);
        if (isValidTheme) {
            setThemeState(storedTheme as Theme);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        }
    }, [theme, mounted]);

    const setTheme = useCallback((newTheme: Theme) => {
        if (THEMES.includes(newTheme)) {
            setThemeState(newTheme);
        } else {
            console.warn(`Invalid theme: ${newTheme}. Available themes are: ${THEMES.join(', ')}`);
        }
    }, []);

    return { theme, setTheme, availableThemes: THEMES };
};
