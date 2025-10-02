import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Settings, storage } from '../services/storage';
import { applyTheme } from '../utils/themes';

interface SettingsContextType {
   settings: Settings;
   updateSettings: (newSettings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
   const [settings, setSettings] = useState<Settings>(storage.getSettings());

   useEffect(() => {
      applyTheme(settings.theme);
   }, [settings.theme]);

   const updateSettings = (newSettings: Settings) => {
      storage.saveSettings(newSettings);
      setSettings(newSettings);
   };

   return (
      <SettingsContext.Provider value={{ settings, updateSettings }}>
         {children}
      </SettingsContext.Provider>
   );
}

export function useSettings() {
   const context = useContext(SettingsContext);
   if (!context) {
      throw new Error('useSettings must be used within a SettingsProvider');
   }
   return context;
}

