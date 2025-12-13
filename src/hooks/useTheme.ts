import { useState, useEffect, useCallback } from 'react';

const THEMES = ['sage', 'light', 'amber', 'dracula', 'cyan', 'matrix', 'openai'] as const;
export type Theme = typeof THEMES[number];
const THEME_STORAGE_KEY = 'app-theme';

const isTheme = (value: string | null): value is Theme => {
    return THEMES.includes(value as any);
};

export const useTheme = () => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        return THEMES.includes(storedTheme as any) ? storedTheme as Theme : 'openai';
    });

    useEffect(() => {
        // Apply the theme to the root element
        document.documentElement.setAttribute('data-theme', theme);
        // Persist the theme in localStorage
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const setTheme = useCallback((newTheme: Theme) => {
        if (THEMES.includes(newTheme)) {
            setThemeState(newTheme);
        } else {
            console.warn(`Invalid theme: ${newTheme}. Available themes are: ${THEMES.join(', ')}`);
        }
    }, []);

    return { theme, setTheme, availableThemes: THEMES };
};
