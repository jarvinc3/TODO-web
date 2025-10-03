import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Task } from '../services/storage';
import { getPriorityColor, getTaskTypeColor } from '../utils/helpers';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onClick: (task: Task) => void;
}

export default function TaskCard({ task, onDragStart, onDragEnd, onClick }: TaskCardProps) {
  const { settings } = useSettings();
  const typeColor = getTaskTypeColor(task.type, settings.taskTypes);
  const priorityColor = getPriorityColor(task.priority, settings.priorities);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStarted, setTouchStarted] = useState(false);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const currentTouchPos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);
  const longPressTimer = useRef<number | null>(null);

  // Auto-scroll function for mobile - runs continuously
  const autoScrollLoop = useCallback(() => {
    const container = document.getElementById('kanban-scroll-container');
    if (!container) {
      animationFrameId.current = null;
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const scrollSpeed = 8;
    const edgeThreshold = 80; // Pixels from edge to trigger scroll
    const x = currentTouchPos.current.x;

    // Scroll left
    if (x < containerRect.left + edgeThreshold && container.scrollLeft > 0) {
      const distance = containerRect.left + edgeThreshold - x;
      const speed = Math.min(scrollSpeed, distance / 10);
      container.scrollLeft -= speed;
    }
    // Scroll right
    else if (x > containerRect.right - edgeThreshold) {
      const distance = x - (containerRect.right - edgeThreshold);
      const speed = Math.min(scrollSpeed, distance / 10);
      container.scrollLeft += speed;
    }

    // Continue animation loop - will be stopped by useEffect when isDragging changes
    animationFrameId.current = requestAnimationFrame(autoScrollLoop);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    currentTouchPos.current = { x: touch.clientX, y: touch.clientY };
    setTouchStarted(true);

    // Delay to distinguish between tap and drag
    longPressTimer.current = window.setTimeout(() => {
      if (touchStarted) {
        setIsDragging(true);
        // Simulate drag start for consistency with desktop drag
        const syntheticEvent = {
          dataTransfer: {
            effectAllowed: 'move',
            setData: () => { },
          },
        } as unknown as React.DragEvent;
        onDragStart(syntheticEvent, task);

        // Visual feedback
        if (cardRef.current) {
          cardRef.current.style.opacity = '0.5';
          cardRef.current.style.transform = 'scale(1.05)';
        }
      }
    }, 150);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStarted) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

    // Update current touch position
    currentTouchPos.current = { x: touch.clientX, y: touch.clientY };

    // If moved enough, it's a drag not a tap
    if (isDragging) {
      e.preventDefault();
    } else if (deltaX > 10 || deltaY > 10) {
      // Cancel tap if moved too much
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Cancel animation frame
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    if (!isDragging) {
      // It was a tap, trigger onClick
      onClick(task);
      setTouchStarted(false);
      return;
    }

    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    // Find the drop target column
    let dropTarget = element;
    while (dropTarget && !dropTarget.hasAttribute('data-column-id')) {
      dropTarget = dropTarget.parentElement;
    }

    if (dropTarget) {
      const columnId = dropTarget.getAttribute('data-column-id');
      if (columnId && columnId !== task.column_id) {
        // Trigger drop via custom event
        const dropEvent = new CustomEvent('taskDrop', {
          detail: { task, columnId },
          bubbles: true,
        });
        dropTarget.dispatchEvent(dropEvent);
      }
    }

    // Simulate drag end
    const syntheticEvent = {} as React.DragEvent;
    onDragEnd(syntheticEvent);

    // Reset
    setIsDragging(false);
    setTouchStarted(false);
    if (cardRef.current) {
      cardRef.current.style.opacity = '';
      cardRef.current.style.transform = '';
    }
  };

  // Start/stop auto-scroll based on drag state
  useEffect(() => {
    if (isDragging && animationFrameId.current === null) {
      animationFrameId.current = requestAnimationFrame(autoScrollLoop);
    } else if (!isDragging && animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  }, [isDragging, autoScrollLoop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const handleClick = () => {
    // Only trigger onClick if not dragging
    if (!isDragging) {
      onClick(task);
    }
  };

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        onDragStart(e, task);
      }}
      onDragEnd={(e) => {
        setIsDragging(false);
        onDragEnd(e);
      }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`rounded-2xl shadow-sm border border-secondary cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] animate-fade-in touch-none ${isDragging ? 'opacity-50 scale-105 shadow-lg' : ''
        }`}
      style={{ backgroundColor: typeColor }}
    >
      <p className="text-sm font-semibold text-white/80 text-center">
        {task.type.toUpperCase()}
      </p>

      <div className="bg-surface rounded-xl p-2">
        {/* Title */}
        <div className="bg-background rounded-xl p-2 border-2 border-dashed border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-text mb-2 line-clamp-1">
              {task.title}
            </h2>
            <p className="text-sm text-text-secondary mb-2">
              {format(task.created_at, 'MMMM,dd')}
            </p>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-text-secondary line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Footer: Files count and Priority */}
        <div className="flex items-center justify-between pt-2">
          {/* Files Count */}
          <div className="flex bg-background rounded-lg py-1 px-2 items-center gap-2 text-text-secondary border border-border">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">{task.attachments?.length || 0}</span>
          </div>

          {/* Priority Badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg"
            style={{
              backgroundColor: `${priorityColor}20`,
              color: priorityColor
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: priorityColor }}
            />
            <span className="text-xs font-medium">
              {task.priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
