import { ChevronDown, FolderOpen, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Project } from '../services/storage';

interface ProjectSelectorProps {
  projects: Project[];
  currentProject: Project;
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
}

export default function ProjectSelector({
  projects,
  currentProject,
  onSelectProject,
  onCreateProject,
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Safety check
  if (!currentProject) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:opacity-80 transition-all hover:scale-105"
      >
        <h1 className="text-2xl font-semibold text-text">{currentProject.name}</h1>
        <ChevronDown className="w-5 h-5 text-text-secondary" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-surface rounded-lg shadow-lg border border-border py-2 z-50 animate-fade-in">
          <div className="px-3 py-2 text-xs font-medium text-text-secondary uppercase">
            Projects
          </div>
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => {
                onSelectProject(project.id);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-surface-hover transition-colors ${
                project.id === currentProject.id ? 'bg-surface-hover' : ''
              }`}
            >
              <FolderOpen className="w-4 h-4 text-primary" />
              <span className="text-sm text-text">{project.name}</span>
            </button>
          ))}
          <div className="border-t border-border my-2"></div>
          <button
            onClick={() => {
              onCreateProject();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-surface-hover transition-colors text-primary"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New Project</span>
          </button>
        </div>
      )}
    </div>
  );
}
