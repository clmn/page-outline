import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveSettings, loadSettings } from '../lib/chromeUtils';
import type { Settings } from '../lib/types';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
}

const defaultSettings: Settings = {
  autoScroll: true,
  smoothScroll: true,
  showHeadingLabels: true,
  position: 'popup',
  enabledHeadings: {
    h1: true,
    h2: true,
    h3: true,
    h4: true
  }
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {}
});

export const useSettings = () => useContext(SettingsContext);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const userSettings = await loadSettings();
        setSettings(userSettings);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadUserSettings();
  }, []);

  const updateSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    try {
      await saveSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // Only render children once settings are loaded to avoid flicker
  if (!isLoaded) {
    return null;
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
