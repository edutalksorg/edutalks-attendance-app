import { useColorScheme as useSystemColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { ColorSchemeName } from 'react-native';

const THEME_KEY = '@hr:theme';

type Theme = 'light' | 'dark' | 'system';

export const ThemeContext = createContext({
  theme: 'light' as Theme,
  setTheme: (t: Theme) => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useSystemColorScheme() as ColorSchemeName;
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem(THEME_KEY);
      if (t === 'light' || t === 'dark' || t === 'system') setThemeState(t);
    })();
  }, []);

  const setTheme = async (t: Theme) => {
    setThemeState(t);
    await AsyncStorage.setItem(THEME_KEY, t);
  };

  const resolved = theme === 'system' ? (system === 'dark' ? 'dark' : 'light') : theme;

  return <ThemeContext.Provider value={{ theme: resolved, setTheme }}>{children}</ThemeContext.Provider>;
}

export default ThemeContext;
