import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material';
import { themeCreator } from './base';
import { StylesProvider } from '@mui/styles';

export const ThemeContext = React.createContext({
  themeName: 'PureLightTheme',
  setThemeName: (themeName: string): void => {}
});

type ThemeProviderWrapperProps = { children: React.ReactNode };

const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = (props: ThemeProviderWrapperProps) => {
  const curThemeName =
    localStorage.getItem('appTheme') ||
    (window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'PureDarkTheme'
      : 'PureLightTheme');
  const [themeName, _setThemeName] = useState(curThemeName);
  const theme = themeCreator(themeName);
  const setThemeName = (themeNameStr: string): void => {
    localStorage.setItem('appTheme', themeNameStr);
    _setThemeName(themeNameStr);
  };

  return (
    <StylesProvider injectFirst>
      <ThemeContext.Provider value={{ themeName, setThemeName }}>
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
      </ThemeContext.Provider>
    </StylesProvider>
  );
};

export default ThemeProviderWrapper;
