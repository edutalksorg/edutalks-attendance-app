import { createContext, ReactNode, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
const ACCESS_KEY = 'hr_theme';

export const ThemeContext = createContext({
  theme: 'light' as Theme,
  setTheme: (t: Theme) => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    try {
      const t = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null;
      if (t === 'light' || t === 'dark' || t === 'system') setThemeState(t);
    } catch (e) {
      // ignore
    }
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem(ACCESS_KEY, t);
    } catch (e) {
      // ignore
    }
  };

  const resolved = theme === 'system' ? 'light' : theme;

  return <ThemeContext.Provider value={{ theme: resolved, setTheme }}>{children}</ThemeContext.Provider>;
}

export default ThemeContext;
