export interface Column {
  id: string;
  title: string;
  color: string;
  position: number;
  created_at: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string;
  created_at: string;
}

export interface TaskType {
  name: string;
  color: string;
}

export interface Priority {
  name: string;
  color: string;
}

export interface Task {
  id: string;
  column_id: string;
  title: string;
  description: string;
  priority: string;
  type: string;
  comments_count: number;
  attachments: FileAttachment[];
  position: number;
  created_at: string;
  project_id: string;
}

export interface Project {
  id: string;
  name: string;
  created_at: string;
}

export interface Settings {
  theme: string;
  defaultPriority: string;
  defaultType: string;
  autoSave: boolean;
  taskTypes: TaskType[];
  priorities: Priority[];
  defaultColumns: Omit<Column, 'id' | 'created_at'>[];
  compactMode: boolean;
  animationsEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const COLUMNS_KEY = 'kanban_columns';
const TASKS_KEY = 'kanban_tasks';
const PROJECTS_KEY = 'kanban_projects';
const SETTINGS_KEY = 'kanban_settings';
const CURRENT_PROJECT_KEY = 'kanban_current_project';

const defaultColumnsTemplate: Omit<Column, 'id' | 'created_at'>[] = [
  { title: 'TODO', color: '#e9d5ff', position: 0 },
  { title: 'In Progress', color: '#bfdbfe', position: 1 },
  { title: 'In Review', color: '#fef3c7', position: 2 },
  { title: 'Completed', color: '#bbf7d0', position: 3 },
];

const defaultSettings: Settings = {
  theme: 'light',
  defaultPriority: 'Medium',
  defaultType: 'Front-End',
  autoSave: true,
  taskTypes: [
    { name: 'Front-End', color: '#3B82F6' },
    { name: 'Back-end', color: '#F59E0B' },
    { name: 'Design', color: '#EC4899' },
    { name: 'Testing', color: '#10B981' },
  ],
  priorities: [
    { name: 'High', color: '#EF4444' },
    { name: 'Medium', color: '#F59E0B' },
    { name: 'Low', color: '#10B981' },
  ],
  defaultColumns: defaultColumnsTemplate,
  compactMode: false,
  animationsEnabled: true,
  fontSize: 'medium',
};

const defaultColumns: Column[] = [
  {
    id: 'col-todo',
    title: 'TODO',
    color: '#e9d5ff',
    position: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'col-in-progress',
    title: 'In Progress',
    color: '#bfdbfe',
    position: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'col-in-review',
    title: 'In Review',
    color: '#fef3c7',
    position: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'col-completed',
    title: 'Completed',
    color: '#bbf7d0',
    position: 3,
    created_at: new Date().toISOString(),
  },
];

const defaultProject: Project = {
  id: 'project-default',
  name: 'Default Project',
  created_at: new Date().toISOString(),
};

export const storage = {
  getCurrentProject: (): string => {
    const stored = localStorage.getItem(CURRENT_PROJECT_KEY);
    if (!stored) {
      localStorage.setItem(CURRENT_PROJECT_KEY, defaultProject.id);
      return defaultProject.id;
    }
    return stored;
  },

  setCurrentProject: (projectId: string): void => {
    localStorage.setItem(CURRENT_PROJECT_KEY, projectId);
  },

  getProjects: (): Project[] => {
    const stored = localStorage.getItem(PROJECTS_KEY);
    if (!stored) {
      const projects = [defaultProject];
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      return projects;
    }
    return JSON.parse(stored);
  },

  addProject: (name: string): Project => {
    const projects = storage.getProjects();
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name,
      created_at: new Date().toISOString(),
    };
    projects.push(newProject);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    return newProject;
  },

  updateProject: (id: string, updates: Partial<Project>): void => {
    const projects = storage.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }
  },

  deleteProject: (id: string): void => {
    const projects = storage.getProjects().filter(p => p.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));

    const tasks = storage.getTasks().filter(t => t.project_id !== id);
    storage.saveTasks(tasks);
  },

  getSettings: (): Settings => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    const settings = JSON.parse(stored);
    
    // Migrate old string-based types/priorities to new object-based structure
    let taskTypes = settings.taskTypes || defaultSettings.taskTypes;
    if (taskTypes.length > 0 && typeof taskTypes[0] === 'string') {
      taskTypes = taskTypes.map((name: string) => {
        const defaultType = defaultSettings.taskTypes.find(t => t.name === name);
        return defaultType || { name, color: '#6B7280' };
      });
    }
    
    let priorities = settings.priorities || defaultSettings.priorities;
    if (priorities.length > 0 && typeof priorities[0] === 'string') {
      priorities = priorities.map((name: string) => {
        const defaultPriority = defaultSettings.priorities.find(p => p.name === name);
        return defaultPriority || { name, color: '#6B7280' };
      });
    }
    
    // Migrate old settings to new structure
    const migratedSettings: Settings = {
      theme: settings.theme || defaultSettings.theme,
      defaultPriority: settings.defaultPriority || defaultSettings.defaultPriority,
      defaultType: settings.defaultType || defaultSettings.defaultType,
      autoSave: settings.autoSave !== undefined ? settings.autoSave : defaultSettings.autoSave,
      taskTypes: taskTypes,
      priorities: priorities,
      defaultColumns: settings.defaultColumns || defaultSettings.defaultColumns,
      compactMode: settings.compactMode !== undefined ? settings.compactMode : defaultSettings.compactMode,
      animationsEnabled: settings.animationsEnabled !== undefined ? settings.animationsEnabled : defaultSettings.animationsEnabled,
      fontSize: settings.fontSize || defaultSettings.fontSize,
    };
    
    // Save migrated settings
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(migratedSettings));
    
    return migratedSettings;
  },

  saveSettings: (settings: Settings): void => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  getColumns: (projectId?: string): Column[] => {
    const currentProject = projectId || storage.getCurrentProject();
    const key = `${COLUMNS_KEY}_${currentProject}`;
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(defaultColumns));
      return defaultColumns;
    }
    return JSON.parse(stored);
  },

  saveColumns: (columns: Column[], projectId?: string): void => {
    const currentProject = projectId || storage.getCurrentProject();
    const key = `${COLUMNS_KEY}_${currentProject}`;
    localStorage.setItem(key, JSON.stringify(columns));
  },

  getTasks: (projectId?: string): Task[] => {
    const currentProject = projectId || storage.getCurrentProject();
    const stored = localStorage.getItem(TASKS_KEY);
    const allTasks = stored ? JSON.parse(stored) : [];
    return allTasks.filter((t: Task) => t.project_id === currentProject);
  },

  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  addColumn: (column: Omit<Column, 'id' | 'created_at'>, projectId?: string): Column => {
    const columns = storage.getColumns(projectId);
    const newColumn: Column = {
      ...column,
      id: `col-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    columns.push(newColumn);
    storage.saveColumns(columns, projectId);
    return newColumn;
  },

  updateColumn: (id: string, updates: Partial<Column>, projectId?: string): void => {
    const columns = storage.getColumns(projectId);
    const index = columns.findIndex(c => c.id === id);
    if (index !== -1) {
      columns[index] = { ...columns[index], ...updates };
      storage.saveColumns(columns, projectId);
    }
  },

  deleteColumn: (id: string, projectId?: string): void => {
    const columns = storage.getColumns(projectId).filter(c => c.id !== id);
    storage.saveColumns(columns, projectId);

    const currentProject = projectId || storage.getCurrentProject();
    const allTasks = localStorage.getItem(TASKS_KEY);
    const tasks = allTasks ? JSON.parse(allTasks) : [];
    const filtered = tasks.filter((t: Task) => !(t.column_id === id && t.project_id === currentProject));
    storage.saveTasks(filtered);
  },

  addTask: (task: Omit<Task, 'id' | 'created_at'>): Task => {
    const allTasks = localStorage.getItem(TASKS_KEY);
    const tasks = allTasks ? JSON.parse(allTasks) : [];
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    tasks.push(newTask);
    storage.saveTasks(tasks);
    return newTask;
  },

  updateTask: (id: string, updates: Partial<Task>): void => {
    const allTasks = localStorage.getItem(TASKS_KEY);
    const tasks = allTasks ? JSON.parse(allTasks) : [];
    const index = tasks.findIndex((t: Task) => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      storage.saveTasks(tasks);
    }
  },

  deleteTask: (id: string): void => {
    const allTasks = localStorage.getItem(TASKS_KEY);
    const tasks = allTasks ? JSON.parse(allTasks) : [];
    const filtered = tasks.filter((t: Task) => t.id !== id);
    storage.saveTasks(filtered);
  },
};
