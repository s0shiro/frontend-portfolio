import { useTheme as useNextTheme } from 'next-themes'

type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

export function useTheme(): ThemeContextValue {
  const { resolvedTheme, setTheme } = useNextTheme()
  const theme = (resolvedTheme ?? 'dark') as Theme

  return {
    theme,
    toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
  }
}
