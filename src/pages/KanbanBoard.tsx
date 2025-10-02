import { Plus, Search, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import ColumnModal from '../components/ColumnModal';
import KanbanColumn from '../components/KanbanColumn';
import NewProjectModal from '../components/NewProjectModal';
import ProjectSelector from '../components/ProjectSelector';
import TaskModal from '../components/TaskModal';
import { useProjects } from '../contexts/ProjectContext';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../contexts/ToastContext';
import { useColumns } from '../hooks/useColumns';
import { useTasks } from '../hooks/useTasks';
import { Column, Task } from '../services/storage';
import SettingsPage from './SettingsPage';

function KanbanBoard() {
   const { projects, currentProjectId, currentProject, selectProject, createProject } = useProjects();
   const { settings } = useSettings();
   const { showToast } = useToast();
   const { columns, addColumn, updateColumn, deleteColumn } = useColumns(currentProjectId);
   const { addTask, updateTask, deleteTask, getTasksByColumn } = useTasks(currentProjectId);

   const [draggedTask, setDraggedTask] = useState<Task | null>(null);
   const [searchQuery, setSearchQuery] = useState('');
   const [filterPriority, setFilterPriority] = useState<string>('All');
   const [filterType, setFilterType] = useState<string>('All');

   const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
   const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
   const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
   const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
   const [taskColumnId, setTaskColumnId] = useState('');

   // Task Drag & Drop handlers
   const handleTaskDragStart = (e: React.DragEvent, task: Task) => {
      setDraggedTask(task);
      e.dataTransfer.effectAllowed = 'move';
   };

   const handleTaskDragEnd = () => {
      setDraggedTask(null);
   };

   const handleTaskDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
   };

   const handleTaskDrop = (e: React.DragEvent, columnId: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (!draggedTask || draggedTask.column_id === columnId) {
         return;
      }

      updateTask(draggedTask.id, { column_id: columnId });
      showToast('Task moved successfully', 'success');
      setDraggedTask(null);
   };

   // Task Modal handlers
   const handleAddTask = (columnId: string) => {
      setTaskColumnId(columnId);
      setSelectedTask(null);
      setIsTaskModalOpen(true);
   };

   const handleTaskClick = (task: Task) => {
      setSelectedTask(task);
      setTaskColumnId(task.column_id);
      setIsTaskModalOpen(true);
   };

   const handleSaveTask = (taskData: Partial<Task>) => {
      if (selectedTask) {
         updateTask(selectedTask.id, taskData);
      } else {
         const tasksInColumn = getTasksByColumn(taskColumnId);
         const maxPosition = tasksInColumn.length > 0
            ? Math.max(...tasksInColumn.map(t => t.position))
            : -1;

         addTask({
            title: taskData.title || '',
            description: taskData.description || '',
            priority: taskData.priority || settings.defaultPriority,
            type: taskData.type || settings.defaultType,
            comments_count: 0,
            attachments: taskData.attachments || [],
            column_id: taskColumnId,
            position: maxPosition + 1,
            project_id: currentProjectId,
         });
      }
   };

   const handleDeleteTask = (taskId: string) => {
      deleteTask(taskId);
   };

   // Column Modal handlers
   const handleAddColumn = () => {
      setSelectedColumn(null);
      setIsColumnModalOpen(true);
   };

   const handleColumnEdit = (column: Column) => {
      setSelectedColumn(column);
      setIsColumnModalOpen(true);
   };

   const handleSaveColumn = (columnData: Partial<Column>) => {
      if (selectedColumn) {
         updateColumn(selectedColumn.id, columnData);
         showToast('Column updated', 'success');
      } else {
         addColumn({
            title: columnData.title || '',
            color: columnData.color || '#bfdbfe',
            position: columns.length,
         });
         showToast('Column created', 'success');
      }
   };

   const handleColumnDelete = (columnId: string) => {
      if (confirm('Are you sure you want to delete this column? All tasks in it will be deleted.')) {
         deleteColumn(columnId);
         showToast('Column deleted', 'success');
      }
   };

   // Project handlers
   const handleSelectProject = (projectId: string) => {
      selectProject(projectId);
      showToast('Project switched', 'info');
   };

   const handleCreateProject = (name: string) => {
      const newProject = createProject(name);
      handleSelectProject(newProject.id);
   };

   const getFilteredTasks = (columnId: string) => {
      const filtered = getTasksByColumn(columnId, searchQuery, filterPriority !== 'All' ? filterPriority : undefined);
      return filtered.filter(task => {
         if (filterType !== 'All' && task.type !== filterType) {
            return false;
         }
         return true;
      });
   };

   // Don't render until we have a valid project
   if (!currentProject && projects.length === 0) {
      return <div className="min-h-screen bg-background flex items-center justify-center">
         <div className="text-text">Loading...</div>
      </div>;
   }

   // Show settings page if open
   if (isSettingsOpen) {
      return <SettingsPage onClose={() => setIsSettingsOpen(false)} />;
   }

   return (
      <div className="h-screen w-screen bg-background flex flex-col">
         {/* Header */}
         <div className="mx-auto p-4 md:p-8 w-full">
            <div className="bg-surface rounded-2xl shadow-sm p-4 md:p-6">
               <div className="flex items-center justify-between mb-6">
                  <ProjectSelector
                     projects={projects}
                     currentProject={currentProject || projects[0]}
                     onSelectProject={handleSelectProject}
                     onCreateProject={() => setIsNewProjectModalOpen(true)}
                  />

                  <button
                     onClick={() => setIsSettingsOpen(true)}
                     className="p-2 text-text-secondary hover:text-primary transition-all hover:scale-110"
                  >
                     <SettingsIcon className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex flex-col gap-3 sm:flex-row items-center w-full">
                  <div className="flex justify-between items-center gap-3 w-full">
                     <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                        <input
                           type="text"
                           placeholder="Search tasks..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="pl-10 pr-4 py-2 w-full bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                     </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
                     <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-all"
                     >
                        <option value="All">All types</option>
                        {settings.taskTypes?.map(type => (
                           <option key={type.name} value={type.name}>{type.name}</option>
                        ))}
                     </select>

                     <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-all"
                     >
                        <option value="All">All priorities</option>
                        {settings.priorities?.map(priority => (
                           <option key={priority.name} value={priority.name}>{priority.name}</option>
                        ))}
                     </select>
                  </div>
               </div>
            </div>
         </div>

         {/* Kanban Board */}
         <div className="flex-1 mx-auto px-4 md:px-8 w-full">
            <div id="kanban-scroll-container" className="flex gap-4 overflow-x-auto pb-4 h-full scroll-smooth">
               {columns.map((column) => (
                  <KanbanColumn
                     key={column.id}
                     column={column}
                     tasks={getFilteredTasks(column.id)}
                     onDragStart={handleTaskDragStart}
                     onDragEnd={handleTaskDragEnd}
                     onDragOver={handleTaskDragOver}
                     onDrop={handleTaskDrop}
                     onAddTask={handleAddTask}
                     onTaskClick={handleTaskClick}
                     onColumnEdit={handleColumnEdit}
                     onColumnDelete={handleColumnDelete}
                     isDragging={!!draggedTask}
                  />
               ))}

               <button
                  onClick={handleAddColumn}
                  className="flex-shrink-0 w-80 h-32 border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-2 text-text-secondary hover:border-primary hover:text-primary transition-all hover:scale-105"
               >
                  <Plus className="w-5 h-5" />
                  Add new state
               </button>
            </div>
         </div>

         {/* Modals */}
         <TaskModal
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
            onSave={handleSaveTask}
            onDelete={handleDeleteTask}
            task={selectedTask}
            columnId={taskColumnId}
         />

         <ColumnModal
            isOpen={isColumnModalOpen}
            onClose={() => setIsColumnModalOpen(false)}
            onSave={handleSaveColumn}
            column={selectedColumn}
         />

         <NewProjectModal
            isOpen={isNewProjectModalOpen}
            onClose={() => setIsNewProjectModalOpen(false)}
            onSave={handleCreateProject}
         />
      </div>
   );
}

export default KanbanBoard;
