import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Project, storage } from '../services/storage';

interface ProjectContextType {
  projects: Project[];
  currentProjectId: string;
  currentProject: Project | undefined;
  selectProject: (projectId: string) => void;
  createProject: (name: string) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState('');

  useEffect(() => {
    const projectId = storage.getCurrentProject();
    setCurrentProjectId(projectId);
    setProjects(storage.getProjects());
  }, []);

  const selectProject = (projectId: string) => {
    setCurrentProjectId(projectId);
    storage.setCurrentProject(projectId);
  };

  const createProject = (name: string): Project => {
    const newProject = storage.addProject(name);
    setProjects(storage.getProjects());
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    storage.updateProject(id, updates);
    setProjects(storage.getProjects());
  };

  const deleteProject = (id: string) => {
    storage.deleteProject(id);
    setProjects(storage.getProjects());
    
    // If we deleted the current project, switch to another one
    if (id === currentProjectId) {
      const remainingProjects = storage.getProjects();
      if (remainingProjects.length > 0) {
        selectProject(remainingProjects[0].id);
      }
    }
  };

  const currentProject = projects.find(p => p.id === currentProjectId);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProjectId,
        currentProject,
        selectProject,
        createProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}

