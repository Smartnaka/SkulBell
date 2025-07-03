import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'APP_THEME';

const lightColors = {
  primary: '#1e3a8a',
  primaryLight: '#3b82f6',
  primaryDark: '#1e40af',
  secondary: '#047857',
  secondaryLight: '#10b981',
  accent: '#dc2626',
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceElevated: '#f1f5f9',
  text: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  success: '#065f46',
  warning: '#d97706',
  error: '#dc2626',
  info: '#0284c7',
  border: '#e2e8f0',
  borderDark: '#cbd5e1',
  statusActive: '#059669',
  statusPending: '#0891b2',
  statusCompleted: '#6b7280',
  statusUrgent: '#dc2626',
};

const darkColors = {
  ...lightColors,
  background: '#181e2a',
  surface: '#232b3b',
  surfaceElevated: '#2c3650',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  textLight: '#64748b',
  border: '#232b3b',
  borderDark: '#181e2a',
};

const ThemeContext = createContext({
  theme: 'light',
  colors: lightColors,
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('light');
  const [colors, setColors] = useState(lightColors);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme) {
        setThemeState(savedTheme);
        setColors(savedTheme === 'dark' ? darkColors : lightColors);
      } else {
        const sysTheme = Appearance.getColorScheme();
        setThemeState(sysTheme);
        setColors(sysTheme === 'dark' ? darkColors : lightColors);
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    setColors(newTheme === 'dark' ? darkColors : lightColors);
    await AsyncStorage.setItem(THEME_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 