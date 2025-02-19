import React, { createContext, useContext, useState } from 'react';

interface Theme {
  primary: string;
  background: string;
  text: string;
  secondary: string;
}

const lightTheme: Theme = {
  primary: '#007AFF',
  background: '#FFFFFF',
  text: '#000000',
  secondary: '#5856D6',
};

const darkTheme: Theme = {
  primary: '#0A84FF',
  background: '#000000',
  text: '#FFFFFF',
  secondary: '#5E5CE6',
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 