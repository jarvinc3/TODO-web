import { Download, FileText, Minimize2, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../contexts/ToastContext';
import { FileAttachment, Task } from '../services/storage';
import { formatFileSize, getPriorityColor, getTaskTypeColor } from '../utils/helpers';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
  task?: Task | null;
  columnId: string;
}

export default function TaskModal({ isOpen, onClose, onSave, onDelete, task, columnId }: TaskModalProps) {
  const { settings } = useSettings();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<string>(settings.defaultPriority);
  const [type, setType] = useState<string>(settings.defaultType);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [expandedAttachment, setExpandedAttachment] = useState<FileAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setType(task.type);
      setAttachments(task.attachments || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority(settings.defaultPriority);
      setType(settings.defaultType);
      setAttachments([]);
    }
  }, [task, settings]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAttachment: FileAttachment = {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          data: event.target?.result as string,
          created_at: new Date().toISOString(),
        };
        setAttachments(prev => [...prev, newAttachment]);
        showToast('File uploaded successfully', 'success');
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
    showToast('Attachment removed', 'info');
  };

  const handleDownload = (attachment: FileAttachment) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    link.click();
    showToast('Downloading file', 'info');
  };

  const handleAttachmentClick = (attachment: FileAttachment) => {
    if (attachment.type.startsWith('image/') || attachment.type.includes('pdf')) {
      setExpandedAttachment(attachment);
    } else {
      handleDownload(attachment);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      priority,
      type,
      column_id: columnId,
      attachments,
    });
    showToast(task ? 'Task updated successfully' : 'Task created successfully', 'success');
    onClose();
  };

  const handleDelete = () => {
    if (task && onDelete && confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      showToast('Task deleted', 'success');
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div ref={modalRef} className="bg-surface rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header with Update button */}
          <div className="sticky top-0 bg-surface border-b border-border p-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <div className="flex items-center gap-2">
              {task && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-error text-white rounded-lg hover:opacity-90 transition-all hover:scale-105"
                >
                  Delete
                </button>
              )}
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form content - scrollable */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Task Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Type
                </label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 pr-10 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer transition-all"
                  >
                    {settings.taskTypes?.map((taskType) => (
                      <option key={taskType.name} value={taskType.name}>
                        {taskType.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getTaskTypeColor(type, settings.taskTypes) }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Priority
                </label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 pr-10 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer transition-all"
                  >
                    {settings.priorities?.map((priorityOption) => (
                      <option key={priorityOption.name} value={priorityOption.name}>
                        {priorityOption.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getPriorityColor(priority, settings.priorities) }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Attachments
              </label>
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 border-2 border-dashed border-border rounded-lg text-text-secondary hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Files</span>
                </button>

                {attachments.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        onClick={() => handleAttachmentClick(attachment)}
                        className="flex items-center gap-3 p-3 bg-surface border border-border rounded-lg cursor-pointer hover:border-primary transition-all hover:scale-[1.02]"
                      >
                        {attachment.type.startsWith('image/') ? (
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <img
                              src={attachment.data}
                              alt={attachment.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-surface-hover rounded">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text truncate">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(attachment);
                          }}
                          className="p-2 text-text-secondary hover:text-primary transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAttachment(attachment.id);
                          }}
                          className="p-2 text-text-secondary hover:text-error transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Footer with action buttons */}
          <div className="sticky bottom-0 bg-surface border-t border-border p-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-text hover:bg-surface-hover transition-all"
              >
                Cancel
              </button>
              {task && onDelete && (
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all hover:scale-105"
                >
                  Update
                </button>
              )}
              {!task && (
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all hover:scale-105"
                >
                  Create
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attachment Viewer Modal */}
      {expandedAttachment && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 animate-fade-in"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setExpandedAttachment(null);
          }}
        >
          <div 
            className="relative max-w-6xl"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandedAttachment(null);
              }}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors z-50"
            >
              <Minimize2 className="w-6 h-6" />
            </button>
            {expandedAttachment.type.startsWith('image/') ? (
              <img
                src={expandedAttachment.data}
                alt={expandedAttachment.name}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : expandedAttachment.type.includes('pdf') ? (
              <iframe
                src={expandedAttachment.data}
                className="w-full h-[90vh] rounded-lg bg-white"
                title={expandedAttachment.name}
              />
            ) : null}
            <div className="mt-4 text-center text-white">
              <p className="font-medium">{expandedAttachment.name}</p>
              <p className="text-sm text-white/70">{formatFileSize(expandedAttachment.size)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
