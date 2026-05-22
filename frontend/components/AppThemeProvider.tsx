"use client";

import type { ReactNode } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const userPrefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = createTheme({
    colorSchemes: {
      dark: userPrefersDarkMode,
      light: !userPrefersDarkMode,
    },
    palette: {
      mode: userPrefersDarkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
