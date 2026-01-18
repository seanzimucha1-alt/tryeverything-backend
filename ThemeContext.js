import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightTheme = {
  mode: 'light',
  background: '#FFFFFF',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#F3F4F6',
  primary: '#556B2F',
  status: 'dark',
};

export const darkTheme = {
  mode: 'dark',
  background: '#111827',
  card: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  primary: '#84A98C',
  status: 'light',
};

const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
  isDark: false,
});

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadThemePreference();
  }, []);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    // AsyncStorage temporarily disabled
  };

  // Prevent rendering until theme is loaded to avoid flash
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);