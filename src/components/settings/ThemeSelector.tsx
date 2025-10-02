import { Check } from 'lucide-react';
import { themes } from '../../utils/themes';

interface ThemeSelectorProps {
   currentTheme: string;
   onThemeChange: (theme: string) => void;
}

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
   return (
      <div className="space-y-4">
         <div>
            <h3 className="text-lg font-semibold text-text mb-1">Theme</h3>
            <p className="text-sm text-text-secondary">Choose your preferred color scheme</p>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(themes).map(([key, value]) => (
               <button
                  key={key}
                  onClick={() => onThemeChange(key)}
                  className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${currentTheme === key
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/50'
                     }`}
               >
                  {currentTheme === key && (
                     <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                     </div>
                  )}
                  <div className="text-sm font-medium text-text mb-3">{value.name}</div>
                  <div className="flex gap-2">
                     <div
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: value.colors.background }}
                     />
                     <div
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: value.colors.surface }}
                     />
                     <div
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: value.colors.primary }}
                     />
                  </div>
               </button>
            ))}
         </div>
      </div>
   );
}

