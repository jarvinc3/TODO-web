export interface Theme {
  name: string;
  colors: {
    background: string;
    surface: string;
    'surface-hover': string;
    primary: string;
    'primary-hover': string;
    text: string;
    'text-secondary': string;
    border: string;
    'border-secondary': string;
    error: string;
  };
}

export const themes: Record<string, Theme> = {
  light: {
    name: 'Light',
    colors: {
      background: '#f9fafb',
      surface: '#ffffff',
      'surface-hover': '#f3f4f6',
      primary: '#3b82f6',
      'primary-hover': '#2563eb',
      text: '#111827',
      'text-secondary': '#6b7280',
      border: '#e5e7eb',
      'border-secondary': '#d1d5db',
      error: '#ef4444',
    },
  },
  dark: {
    name: 'Dark',
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      'surface-hover': '#334155',
      primary: '#3b82f6',
      'primary-hover': '#2563eb',
      text: '#f1f5f9',
      'text-secondary': '#94a3b8',
      border: '#334155',
      'border-secondary': '#475569',
      error: '#ef4444',
    },
  },
  blue: {
    name: 'Ocean Blue',
    colors: {
      background: '#f0f9ff',
      surface: '#ffffff',
      'surface-hover': '#e0f2fe',
      primary: '#0284c7',
      'primary-hover': '#0369a1',
      text: '#0c4a6e',
      'text-secondary': '#475569',
      border: '#bae6fd',
      'border-secondary': '#475569',
      error: '#dc2626',
    },
  },
  purple: {
    name: 'Purple Dream',
    colors: {
      background: '#faf5ff',
      surface: '#ffffff',
      'surface-hover': '#f3e8ff',
      primary: '#9333ea',
      'primary-hover': '#7e22ce',
      text: '#581c87',
      'text-secondary': '#6b7280',
      border: '#e9d5ff',
      'border-secondary': '#475569',
      error: '#dc2626',
    },
  },
  forest: {
    name: 'Forest Green',
    colors: {
      background: '#f0fdf4',
      surface: '#ffffff',
      'surface-hover': '#dcfce7',
      primary: '#16a34a',
      'primary-hover': '#15803d',
      text: '#14532d',
      'text-secondary': '#6b7280',
      border: '#bbf7d0',
      'border-secondary': '#475569',
      error: '#dc2626',
    },
  },
};

export function applyTheme(themeName: string) {
  const theme = themes[themeName];
  if (!theme) return;

  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
}
