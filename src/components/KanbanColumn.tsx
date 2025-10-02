import { MoreHorizontal, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Column, Task } from '../services/storage';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onAddTask: (columnId: string) => void;
  onTaskClick: (task: Task) => void;
  onColumnEdit?: (column: Column) => void;
  onColumnDelete?: (columnId: string) => void;
  isDragging?: boolean;
}

export default function KanbanColumn({
  column,
  tasks,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onAddTask,
  onTaskClick,
  onColumnEdit,
  onColumnDelete,
  isDragging,
}: KanbanColumnProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Handle custom touch drop event
  useEffect(() => {
    const handleTaskDrop = (event: Event) => {
      const customEvent = event as CustomEvent<{ task: Task; columnId: string }>;
      if (customEvent.detail && customEvent.detail.columnId === column.id) {
        // Create a synthetic drag event
        const syntheticEvent = {
          preventDefault: () => {},
          stopPropagation: () => {},
          dataTransfer: {
            getData: () => JSON.stringify(customEvent.detail.task),
          },
        } as unknown as React.DragEvent;
        onDrop(syntheticEvent, column.id);
      }
    };

    const currentRef = columnRef.current;
    if (currentRef) {
      currentRef.addEventListener('taskDrop', handleTaskDrop);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('taskDrop', handleTaskDrop);
      }
    };
  }, [column.id, onDrop]);

  return (
    <div
      ref={columnRef}
      data-column-id={column.id}
      className={`flex-shrink-0 w-[93%] sm:w-80 rounded-xl flex flex-col h-full transition-all overflow-hidden ${
        isDragging ? 'ring-2 ring-primary ring-opacity-50' : ''
      }`}
      style={{ backgroundColor: column.color }}
    >
      {/* Column Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-sm font-semibold">
            {tasks.length}
          </span>
          <h2 className="font-semibold text-gray-800">{column.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddTask(column.id)}
            className="w-6 h-6 flex items-center justify-center hover:bg-white/50 rounded transition-all hover:scale-110"
          >
            <Plus className="w-4 h-4 text-gray-700" />
          </button>
          {(onColumnEdit || onColumnDelete) && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-6 h-6 flex items-center justify-center hover:bg-white/50 rounded transition-all hover:scale-110"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-700" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-surface rounded-lg shadow-lg border border-border py-1 z-10 animate-fade-in">
            {onColumnEdit && (
              <button
                onClick={() => {
                  onColumnEdit(column);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-text hover:bg-surface-hover transition-colors"
              >
                Edit column
              </button>
            )}
            {onColumnDelete && (
              <button
                onClick={() => {
                  onColumnDelete(column.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-error hover:bg-surface-hover transition-colors"
              >
                Delete column
              </button>
            )}
              </div>
            )}
            </div>
          )}
        </div>
      </div>

      {/* Tasks Container with scroll */}
      <div 
        data-column-id={column.id}
        className="flex-1 px-4 pb-4 space-y-3 h-full scroll-hidden"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, column.id)}
        style={{
          maxHeight: 'calc(65vh)',
        }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onTaskClick}
          />
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No tasks yet
          </div>
        )}

        <button
          onClick={() => onAddTask(column.id)}
          className="w-full border-2 border-dashed border-gray-400 rounded-lg py-3 text-sm text-gray-600 hover:border-gray-600 hover:text-gray-800 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add new task
        </button>
      </div>
    </div>
  );
}
