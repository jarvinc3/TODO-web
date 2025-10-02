import { ArrowLeft } from 'lucide-react';
import PriorityManager from '../components/settings/PriorityManager';
import ProjectManager from '../components/settings/ProjectManager';
import TaskTypeManager from '../components/settings/TaskTypeManager';
import ThemeSelector from '../components/settings/ThemeSelector';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../contexts/ToastContext';

interface SettingsPageProps {
   onClose: () => void;
}

export default function SettingsPage({ onClose }: SettingsPageProps) {
   const { settings, updateSettings } = useSettings();
   const { showToast } = useToast();

   const handleToggleSetting = (key: keyof typeof settings) => {
      updateSettings({ ...settings, [key]: !settings[key] });
      showToast('Setting updated', 'success');
   };

   const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large') => {
      updateSettings({ ...settings, fontSize });
      showToast('Font size updated', 'success');
   };

   return (
      <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
         {/* Sticky Header */}
         <div className="sticky max-w-5xl mx-auto flex items-center gap-2 top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 p-4 sm:p-6">
            <button
               onClick={onClose}
               className="text-text-secondary hover:text-primary transition-all"
            >
               <ArrowLeft className="size-8" />
            </button>
            <h1 className="text-3xl font-bold text-text">Settings</h1>
         </div>

         {/* Content */}
         <div className="max-w-5xl mx-auto p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-8">
               {/* Projects Section */}
               <section className="bg-surface rounded-xl shadow-sm p-4 sm:p-6 border-2 border-border">
                  <div className="mb-4">
                     <h2 className="text-xl font-semibold text-text">Projects</h2>
                     <p className="text-sm text-text-secondary mt-1">
                        Manage your projects and switch between them
                     </p>
                  </div>
                  <ProjectManager />
               </section>

               {/* Appearance Section */}
               <section className="bg-surface rounded-xl shadow-sm p-4 sm:p-6 border-2 border-border">
                  <div className="mb-6">
                     <h2 className="text-xl font-semibold text-text">Appearance</h2>
                     <p className="text-sm text-text-secondary mt-1">
                        Customize the look and feel of your workspace
                     </p>
                  </div>
                  <div className="space-y-6">
                     {/* Theme Selector */}
                     <div>
                        <ThemeSelector
                           currentTheme={settings.theme}
                           onThemeChange={(theme) => {
                              updateSettings({ ...settings, theme });
                              showToast('Theme updated', 'success');
                           }}
                        />
                     </div>

                     <div className="border-t border-border" />

                     {/* Font Size */}
                     <div>
                        <h3 className="text-lg font-medium text-text mb-3">Font Size</h3>
                        <div className="grid grid-cols-3 sm:flex gap-3">
                           {['small', 'medium', 'large'].map((size) => (
                              <button
                                 key={size}
                                 onClick={() => handleFontSizeChange(size as 'small' | 'medium' | 'large')}
                                 className={`px-4 py-2 rounded-lg border-2 transition-all ${settings.fontSize === size
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50 hover:bg-surface-hover'
                                    } text-text`}
                              >
                                 {size.charAt(0).toUpperCase() + size.slice(1)}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="border-t border-border" />

                     {/* Display Options */}
                     <div>
                        <h3 className="text-lg font-medium text-text mb-3">Display Options</h3>
                        <div className="space-y-3">
                           <div className="flex gap-2 items-center justify-between p-2 sm:p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-all">
                              <div>
                                 <div className="text-sm font-medium text-text">Compact Mode</div>
                                 <div className="text-xs text-text-secondary mt-1">
                                    Reduce spacing between elements for a denser view
                                 </div>
                              </div>
                              <label
                                 className="relative inline-block h-7 w-[55px] cursor-pointer rounded-full bg-gray-500 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-[#1976D2]"
                              >
                                 <input type="checkbox" id="AcceptConditions" className="peer sr-only" checked={settings.compactMode} onChange={() => handleToggleSetting('compactMode')} />
                                 <span
                                    className="absolute inset-y-0 start-0 m-1 size-5 rounded-full ring-[5px] ring-inset ring-white transition-all peer-checked:start-7 bg-gray-500 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"
                                 ></span>
                              </label>
                           </div>

                           <div className="flex gap-2 items-center justify-between p-2 sm:p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-all">
                              <div>
                                 <div className="text-sm font-medium text-text">Animations</div>
                                 <div className="text-xs text-text-secondary mt-1">
                                    Enable or disable UI animations and transitions
                                 </div>
                              </div>
                              <label
                                 className="relative inline-block h-7 w-[48px] cursor-pointer rounded-full bg-gray-500 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-[#1976D2]"
                              >
                                 <input type="checkbox" id="AcceptConditions" className="peer sr-only" checked={settings.animationsEnabled} onChange={() => handleToggleSetting('animationsEnabled')} />
                                 <span
                                    className="absolute inset-y-0 start-0 m-1 size-5 rounded-full ring-[5px] ring-inset ring-white transition-all peer-checked:start-7 bg-gray-500 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"
                                 ></span>
                              </label>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>

               {/* Task Configuration Section */}
               <section className="bg-surface rounded-xl shadow-sm p-4 sm:p-6 border-2 border-border">
                  <div className="mb-6">
                     <h2 className="text-xl font-semibold text-text">Task Configuration</h2>
                     <p className="text-sm text-text-secondary mt-1">
                        Define task types and priority levels for your projects
                     </p>
                  </div>
                  <div className="space-y-6">
                     {/* Task Type Manager */}
                     <div>
                        <h3 className="text-lg font-medium text-text mb-2">Task Types</h3>
                        <p className="text-xs text-text-secondary mb-3">
                           Define the types of tasks for your projects. Click to set default.
                        </p>
                        <TaskTypeManager />
                     </div>

                     <div className="border-t border-border" />

                     {/* Priority Manager */}
                     <div>
                        <h3 className="text-lg font-medium text-text mb-2">Priorities</h3>
                        <p className="text-xs text-text-secondary mb-3">
                           Manage task priority levels. Click to set default.
                        </p>
                        <PriorityManager />
                     </div>
                  </div>
               </section>

               {/* General Section */}
               <section className="bg-surface rounded-xl shadow-sm p-4 sm:p-6 border-2 border-border">
                  <div className="mb-6">
                     <h2 className="text-xl font-semibold text-text">General</h2>
                     <p className="text-sm text-text-secondary mt-1">
                        General application settings and preferences
                     </p>
                  </div>
                  <div className="space-y-3">
                     {/* Auto-save */}
                     <div className="flex gap-2 items-center justify-between p-2 sm:p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-all">
                        <div>
                           <div className="text-sm font-medium text-text">Auto-save</div>
                           <div className="text-xs text-text-secondary mt-1">
                              Automatically save changes as you make them
                           </div>
                        </div>
                        <label
                           className="relative inline-block h-7 w-[48px] cursor-pointer rounded-full bg-gray-500 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-[#1976D2]"
                        >
                           <input type="checkbox" id="AcceptConditions" className="peer sr-only" checked={settings.autoSave} onChange={() => handleToggleSetting('autoSave')} />
                           <span
                              className="absolute inset-y-0 start-0 m-1 size-5 rounded-full ring-[5px] ring-inset ring-white transition-all peer-checked:start-7 bg-gray-500 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"
                           ></span>
                        </label>
                     </div>
                  </div>
               </section>

               {/* Bottom padding for better scrolling */}
               <div className="p-4 sm:p-6 pb-20">
                  <p className="text-sm text-center text-text-secondary">
                     Version 1.0.0
                  </p>
                  <p className="text-xs text-center text-text-secondary">
                     &copy; {new Date().getFullYear()} TODO Kanban Web App
                  </p>
                  <p className="text-xs text-center text-text-secondary">
                     Made with ❤️ by Jarvinc3
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
