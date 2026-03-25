import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '../shared/constants/Colors';

type Theme = 'light' | 'dark';
type AppColors = typeof lightColors;

interface ThemeContextType {
  theme: Theme;
  colors: AppColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme: Theme = colorScheme === 'dark' ? 'dark' : 'light';

  const value = useMemo(() => ({
    theme,
    colors: theme === 'dark' ? darkColors : lightColors,
    isDark: theme === 'dark',
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
