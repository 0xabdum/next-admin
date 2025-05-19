// Create a Providers component to wrap your application with all the components requiring 'use client', such as next-nprogress-bar or your different contexts...
'use client';

import { createContext, useEffect, useState } from 'react';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

import type { Dispatch, SetStateAction } from 'react';

import { ThemeProvider } from './theme-providers';

export type ThemeProps = {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeProps | null>(null);

const TemplateProviders = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light');
  };

  const getCurrentTheme = () => {
    const themeLocalStorage = localStorage.getItem('theme');
    if (themeLocalStorage) {
      setTheme(themeLocalStorage);
    }
  };

  useEffect(() => {
    getCurrentTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <ThemeProvider
        attribute="class"
        defaultTheme={'light'}
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <ProgressBar height="5px" color="#0260c5" options={{ showSpinner: false }} shallowRouting />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default TemplateProviders;
