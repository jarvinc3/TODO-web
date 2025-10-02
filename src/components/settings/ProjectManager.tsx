import { ArrowUpDown, Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useProjects } from '../../contexts/ProjectContext';
import { useToast } from '../../contexts/ToastContext';
import ConfirmModal from '../ConfirmModal';

export default function ProjectManager() {
   const { projects, currentProjectId, selectProject, createProject, updateProject, deleteProject } = useProjects();
   const { showToast } = useToast();

   const [editingId, setEditingId] = useState<string | null>(null);
   const [editName, setEditName] = useState('');
   const [newProjectName, setNewProjectName] = useState('');
   const [isAddingNew, setIsAddingNew] = useState(false);

   const [confirmModal, setConfirmModal] = useState<{
      isOpen: boolean;
      title: string;
      message: string;
      onConfirm: () => void;
   }>({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: () => { },
   });

   const handleStartEdit = (id: string, name: string) => {
      setEditingId(id);
      setEditName(name);
   };

   const handleSaveEdit = () => {
      if (editingId && editName.trim()) {
         updateProject(editingId, { name: editName.trim() });
         showToast('Project name updated', 'success');
         setEditingId(null);
         setEditName('');
      }
   };

   const handleCancelEdit = () => {
      setEditingId(null);
      setEditName('');
   };

   const handleDeleteClick = (id: string, name: string) => {
      if (projects.length <= 1) {
         showToast('Cannot delete the last project', 'error');
         return;
      }

      setConfirmModal({
         isOpen: true,
         title: 'Delete Project',
         message: `Are you sure you want to delete "${name}"? This action cannot be undone and will delete all tasks associated with this project.`,
         onConfirm: () => {
            deleteProject(id);
            if (currentProjectId === id && projects.length > 1) {
               const remainingProjects = projects.filter(p => p.id !== id);
               selectProject(remainingProjects[0].id);
            }
            showToast('Project deleted', 'success');
         },
      });
   };

   const handleCreateProject = () => {
      if (newProjectName.trim()) {
         createProject(newProjectName.trim());
         showToast(`Project "${newProjectName.trim()}" created`, 'success');
         setNewProjectName('');
         setIsAddingNew(false);
      }
   };

   return (
      <div className="space-y-4">
         <div className="space-y-3">
            {projects.map((project) => (
               <div
                  key={project.id}
                  className={`p-4 rounded-lg border-2 transition-all ${currentProjectId === project.id
                     ? 'border-primary bg-primary/10'
                     : 'border-border bg-surface'
                     }`}
               >
                  <div className="flex items-center gap-3">
                     {editingId === project.id ? (
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                           <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => {
                                 if (e.key === 'Enter') handleSaveEdit();
                                 if (e.key === 'Escape') handleCancelEdit();
                              }}
                              className="flex-1 w-full sm:w-auto px-3 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                              autoFocus
                           />
                           <div className="flex items-center gap-2 w-full sm:w-auto">
                              <button
                                 onClick={handleSaveEdit}
                                 className="px-3 w-full sm:w-auto py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all"
                              >
                                 Save
                              </button>
                              <button
                                 onClick={handleCancelEdit}
                                 className="px-3 w-full sm:w-auto py-2 border border-border rounded-lg hover:bg-surface-hover transition-all text-text"
                              >
                                 Cancel
                              </button>
                           </div>
                        </div>
                     ) : (
                        <>
                           <div className="flex-1 w-full sm:w-auto">
                              <div className="flex items-center gap-2">
                                 <h4 className="text-base font-semibold text-text">{project.name}</h4>

                              </div>
                              <p className="text-xs text-text-secondary mt-1">
                                 Created {new Date(project.created_at).toLocaleDateString()}
                              </p>
                           </div>
                           <div className="flex items-center gap-2">

                              {currentProjectId === project.id ? (
                                 <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                                    Active
                                 </span>
                              ) : (
                                 <button
                                    onClick={() => selectProject(project.id)}
                                    className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded transition-all"
                                 >
                                    <ArrowUpDown />
                                 </button>
                              )}
                              <button
                                 onClick={() => handleStartEdit(project.id, project.name)}
                                 className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded transition-all"
                              >
                                 <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                 onClick={() => handleDeleteClick(project.id, project.name)}
                                 className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded transition-all"
                                 disabled={projects.length <= 1}
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            ))}
         </div>

         {/* Add new project */}
         {isAddingNew ? (
            <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
               <div className="flex flex-col sm:flex-row gap-2">
                  <input
                     type="text"
                     value={newProjectName}
                     onChange={(e) => setNewProjectName(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateProject();
                        if (e.key === 'Escape') {
                           setIsAddingNew(false);
                           setNewProjectName('');
                        }
                     }}
                     placeholder="Project name..."
                     className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                     autoFocus
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                     <button
                        onClick={handleCreateProject}
                        className="px-3 w-full sm:w-auto py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all"
                     >
                        Save
                     </button>
                     <button
                        onClick={() => {
                           setIsAddingNew(false);
                           setNewProjectName('');
                        }}
                        className="px-3 w-full sm:w-auto py-2 border border-border rounded-lg hover:bg-surface-hover transition-all text-text"
                     >
                        Cancel
                     </button>
                  </div>
               </div>
            </div>
         ) : (
            <button
               onClick={() => setIsAddingNew(true)}
               className="w-full p-4 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-text-secondary hover:text-primary"
            >
               <Plus className="w-5 h-5" />
               <span className="font-medium">Add New Project</span>
            </button>
         )}

         <ConfirmModal
            isOpen={confirmModal.isOpen}
            onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            onConfirm={confirmModal.onConfirm}
            title={confirmModal.title}
            message={confirmModal.message}
            type="warning"
         />
      </div>
   );
}

