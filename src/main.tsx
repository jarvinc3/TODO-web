import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ProjectProvider } from './contexts/ProjectContext.tsx';
import { SettingsProvider } from './contexts/SettingsContext.tsx';
import { ToastProvider } from './contexts/ToastContext.tsx';
import './index.css';
import KanbanBoard from './pages/KanbanBoard.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <SettingsProvider>
        <ProjectProvider>
          <KanbanBoard />
        </ProjectProvider>
      </SettingsProvider>
    </ToastProvider>
  </StrictMode>
);
