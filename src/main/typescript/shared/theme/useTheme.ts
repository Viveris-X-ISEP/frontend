import { useColorScheme } from 'react-native';
import { useThemeStore } from '../../store/theme-store'; 
import { lightTheme, darkTheme, type Theme } from './theme';

export interface UseThemeReturn {
  theme: Theme;
  mode: 'light' | 'dark' | 'system';
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  isDark: boolean;
}

/**
 * Hook that bridges theme state (from store) with theme definitions.
 * Returns the computed theme object and controls for changing the mode.
 */
export function useTheme(): UseThemeReturn {
  const { mode, setMode } = useThemeStore();
  const systemScheme = useColorScheme();
  const isDark = 
    mode === 'dark' || 
    (mode === 'system' && systemScheme === 'dark');

  return {
    theme: isDark ? darkTheme : lightTheme,
    mode,
    setMode,
    isDark,
  };
}
