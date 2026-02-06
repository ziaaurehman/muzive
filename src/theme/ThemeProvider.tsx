import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { ThemeColor } from './interfaces/theme.color';
import { LIGHT_COLORS, DARK_COLORS } from './colors';
import { useColorScheme } from 'react-native';

export type AppTheme = 'light' | 'dark' | 'system';
type ThemeContextProps = {
  theme: AppTheme;
  colors: ThemeColor;
  changeTheme: (newTheme: AppTheme) => void;
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren): React.ReactNode => {
  const [theme, setTheme] = useState<AppTheme>('system');
  const scheme = useColorScheme();

  const colors = useMemo(() => {
    if (theme === 'light') return LIGHT_COLORS;
    if (theme === 'dark') return DARK_COLORS;
    return scheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  }, [theme, scheme]);

  const changeTheme = useCallback((newTheme: AppTheme) => {
    setTheme(newTheme);
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      colors,
      changeTheme,
    }),
    [theme, colors, changeTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
