import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from '../shared/constants/Colors';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  colors: typeof colors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme: Theme = colorScheme === 'dark' ? 'dark' : 'light';

  const value = useMemo(() => ({
    theme,
    colors: colors, // We can extend this logic for dark mode colors later
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
