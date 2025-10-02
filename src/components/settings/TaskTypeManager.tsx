import { Palette, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { TaskType } from '../../services/storage';
import { isColorDark } from '../../utils/helpers';

const defaultColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
];

export default function TaskTypeManager() {
  const { settings, updateSettings } = useSettings();
  const { showToast } = useToast();
  const [newTaskTypeName, setNewTaskTypeName] = useState('');
  const [newTaskTypeColor, setNewTaskTypeColor] = useState(defaultColors[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSetDefaultType = (typeName: string) => {
    updateSettings({ ...settings, defaultType: typeName });
    showToast(`Default task type set to "${typeName}"`, 'success');
  };

  const handleAddTaskType = () => {
    if (newTaskTypeName.trim() && !settings.taskTypes.some(t => t.name === newTaskTypeName.trim())) {
      const newType: TaskType = { name: newTaskTypeName.trim(), color: newTaskTypeColor };
      const updatedTypes = [...settings.taskTypes, newType];
      updateSettings({ ...settings, taskTypes: updatedTypes });
      setNewTaskTypeName('');
      setNewTaskTypeColor(defaultColors[0]);
      setShowColorPicker(false);
      showToast(`Task type "${newTaskTypeName.trim()}" added`, 'success');
    } else if (settings.taskTypes.some(t => t.name === newTaskTypeName.trim())) {
      showToast('Task type already exists', 'warning');
    }
  };

  const handleDeleteTaskType = (typeToDelete: TaskType) => {
    if (settings.taskTypes.length <= 1) {
      showToast('Cannot delete the last task type', 'error');
      return;
    }
    const updatedTypes = settings.taskTypes.filter(t => t.name !== typeToDelete.name);
    updateSettings({ ...settings, taskTypes: updatedTypes });
    if (settings.defaultType === typeToDelete.name) {
      updateSettings({ ...settings, defaultType: updatedTypes[0].name });
    }
    showToast(`Task type "${typeToDelete.name}" removed`, 'success');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {settings.taskTypes?.map((type) => (
          <button
            key={type.name}
            onClick={() => handleSetDefaultType(type.name)}
            className={`relative flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${settings.defaultType === type.name
              ? 'border-primary bg-primary/10 shadow-sm'
              : 'border-border hover:border-primary/50 hover:bg-surface-hover'
              }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: type.color }}
              />
              <span className="text-sm font-medium text-text">{type.name}</span>
            </div>
            {settings.defaultType === type.name && (
              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
            {settings.taskTypes.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteTaskType(type); }}
                className="ml-auto p-1.5 text-text-secondary hover:text-error hover:bg-error/10 rounded transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </button>
        ))}
      </div>

      {/* Add new task type form */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newTaskTypeName}
            onChange={(e) => setNewTaskTypeName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTaskType()}
            placeholder="New priority name..."
            className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full sm:w-auto px-4 py-2 border border-border rounded-lg hover:bg-surface-hover transition-all flex justify-center items-center gap-2"
              style={{ backgroundColor: newTaskTypeColor }}
            >
              <Palette className="w-4 h-4 text-white" />
              <span className={`text-sm font-medium ${isColorDark(newTaskTypeColor) ? 'text-white' : 'text-gray-900'}`}>
                Color
              </span>
            </button>
            <button
              onClick={handleAddTaskType}
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
                    onClick={() => setNewTaskTypeColor(color)}
                    className={`w-10 h-10 rounded-lg transition-all ${newTaskTypeColor === color
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
                  value={newTaskTypeColor}
                  onChange={(e) => setNewTaskTypeColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
                <input
                  type="color"
                  value={newTaskTypeColor}
                  onChange={(e) => setNewTaskTypeColor(e.target.value)}
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
