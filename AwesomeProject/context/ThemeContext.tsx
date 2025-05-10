// context/ThemeContext.tsx
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Appearance, ColorSchemeName} from 'react-native';

type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextType = {
  theme: 'light' | 'dark';
  isDarkMode: boolean;
  mode: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDarkMode: false,
  mode: 'system',
  toggleTheme: () => {},
});

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  useEffect(() => {
    const listener = Appearance.addChangeListener(({colorScheme}) => {
      setSystemTheme(colorScheme);
    });

    return () => listener.remove();
  }, []);

  const toggleTheme = () => {
    setMode(prev => {
      if (prev === 'system') {
        return 'dark';
      }
      if (prev === 'dark') {
        return 'light';
      }
      return 'system';
    });
  };

  const resolveTheme = (): 'light' | 'dark' => {
    if (mode === 'light') {
      return 'light';
    }
    if (mode === 'dark') {
      return 'dark';
    }
    return systemTheme === 'dark' ? 'dark' : 'light';
  };

  const theme = resolveTheme();
  const isDarkMode = theme === 'dark';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        mode,
        toggleTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
