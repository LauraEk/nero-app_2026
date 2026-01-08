import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { hexToHSL, hexToHue } from '@/lib/theme-utils';

import DashboardPage from '@/pages/DashboardPage';
import AnkaufPage from '@/pages/AnkaufPage';
import VerkaufPage from '@/pages/VerkaufPage';
import BelegePage from '@/pages/BelegePage';
import SettingsPage from '@/pages/SettingsPage';
import InfoPage from '@/pages/InfoPage';

function App() {
  const { settings } = useSettings();

  useEffect(() => {
    const root = window.document.documentElement;

    // Handle Primary Color
    if (settings.primaryColor) {
      const hsl = hexToHSL(settings.primaryColor);
      const hue = hexToHue(settings.primaryColor);
      root.style.setProperty('--primary', hsl);
      root.style.setProperty('--primary-hue', hue);
    }

    // Handle Theme
    root.classList.remove('light', 'dark');

    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme);
    }
  }, [settings.primaryColor, settings.theme]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="ankauf" element={<AnkaufPage />} />
        <Route path="verkauf" element={<VerkaufPage />} />
        <Route path="belege" element={<BelegePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="info" element={<InfoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
