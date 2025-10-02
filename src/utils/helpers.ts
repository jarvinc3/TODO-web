import { Priority, TaskType } from '../services/storage';

export const formatFileSize = (bytes: number): string => {
   if (bytes < 1024) return bytes + ' B';
   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
   return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const getFileIcon = (type: string): string => {
   if (type.startsWith('image/')) return '🖼️';
   if (type.includes('pdf')) return '📄';
   if (type.includes('word') || type.includes('document')) return '📝';
   if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
   if (type.includes('text')) return '📃';
   return '📎';
};

export const getTaskTypeColor = (typeName: string, taskTypes: TaskType[]): string => {
   const taskType = taskTypes.find(t => t.name === typeName);
   return taskType?.color || '#6B7280';
};

export const getPriorityColor = (priorityName: string, priorities: Priority[]): string => {
   const priority = priorities.find(p => p.name === priorityName);
   return priority?.color || '#6B7280';
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
   } : { r: 107, g: 114, b: 128 };
};

export const isColorDark = (hex: string): boolean => {
   const { r, g, b } = hexToRgb(hex);
   const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
   return luminance < 0.5;
};
