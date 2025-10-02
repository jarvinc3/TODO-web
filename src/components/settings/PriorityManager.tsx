import { Palette, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { Priority } from '../../services/storage';
import { isColorDark } from '../../utils/helpers';

const defaultColors = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
];

export default function PriorityManager() {
  const { settings, updateSettings } = useSettings();
  const { showToast } = useToast();
  const [newPriorityName, setNewPriorityName] = useState('');
  const [newPriorityColor, setNewPriorityColor] = useState(defaultColors[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSetDefaultPriority = (priorityName: string) => {
    updateSettings({ ...settings, defaultPriority: priorityName });
    showToast(`Default priority set to "${priorityName}"`, 'success');
  };

  const handleAddPriority = () => {
    if (newPriorityName.trim() && !settings.priorities.some(p => p.name === newPriorityName.trim())) {
      const newPriority: Priority = { name: newPriorityName.trim(), color: newPriorityColor };
      const updatedPriorities = [...settings.priorities, newPriority];
      updateSettings({ ...settings, priorities: updatedPriorities });
      setNewPriorityName('');
      setNewPriorityColor(defaultColors[0]);
      setShowColorPicker(false);
      showToast(`Priority "${newPriorityName.trim()}" added`, 'success');
    } else if (settings.priorities.some(p => p.name === newPriorityName.trim())) {
      showToast('Priority already exists', 'warning');
    }
  };

  const handleDeletePriority = (priorityToDelete: Priority) => {
    if (settings.priorities.length <= 1) {
      showToast('Cannot delete the last priority', 'error');
      return;
    }
    const updatedPriorities = settings.priorities.filter(p => p.name !== priorityToDelete.name);
    updateSettings({ ...settings, priorities: updatedPriorities });
    if (settings.defaultPriority === priorityToDelete.name) {
      updateSettings({ ...settings, defaultPriority: updatedPriorities[0].name });
    }
    showToast(`Priority "${priorityToDelete.name}" removed`, 'success');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {settings.priorities?.map((priority) => (
          <button
            key={priority.name}
            onClick={() => handleSetDefaultPriority(priority.name)}
            className={`relative flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${settings.defaultPriority === priority.name
              ? 'border-primary bg-primary/10 shadow-sm'
              : 'border-border hover:border-primary/50 hover:bg-surface-hover'
              }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: priority.color }}
              />
              <span className="text-sm font-medium text-text">{priority.name}</span>
            </div>
            {settings.defaultPriority === priority.name && (
              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
            {settings.priorities.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleDeletePriority(priority); }}
                className="ml-auto p-1.5 text-text-secondary hover:text-error hover:bg-error/10 rounded transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </button>
        ))}
      </div>

      {/* Add new priority form */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newPriorityName}
            onChange={(e) => setNewPriorityName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPriority()}
            placeholder="New priority name..."
            className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full sm:w-auto px-4 py-2 border border-border rounded-lg hover:bg-surface-hover transition-all flex justify-center items-center gap-2"
              style={{ backgroundColor: newPriorityColor }}
            >
              <Palette className="w-4 h-4 text-white" />
              <span className={`text-sm font-medium ${isColorDark(newPriorityColor) ? 'text-white' : 'text-gray-900'}`}>
                Color
              </span>
            </button>
            <button
              onClick={handleAddPriority}
              className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all flex justify-center items-center gap-2"
            >
              <Plus className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Add</span>
            </button>
          </div>
        </div>

        {/* Color picker */}
        {showColorPicker && (
          <div className="p-4 bg-surface border border-border rounded-lg">
            <div className="mb-3">
              <label className="text-sm font-medium text-text mb-2 block">Pick a color:</label>
              <div className="grid grid-cols-5 gap-2">
                {defaultColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewPriorityColor(color)}
                    className={`w-10 h-10 rounded-lg transition-all ${newPriorityColor === color
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface scale-110'
                      : 'hover:scale-105'
                      }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-text mb-2 block">Or enter custom color:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPriorityColor}
                  onChange={(e) => setNewPriorityColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
                <input
                  type="color"
                  value={newPriorityColor}
                  onChange={(e) => setNewPriorityColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
