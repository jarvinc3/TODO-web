import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Column } from '../services/storage';

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (column: Partial<Column>) => void;
  column?: Column | null;
}

const colorOptions = [
  { name: 'Purple', value: '#e9d5ff' },
  { name: 'Blue', value: '#bfdbfe' },
  { name: 'Yellow', value: '#fef3c7' },
  { name: 'Red', value: '#fecaca' },
  { name: 'Green', value: '#bbf7d0' },
  { name: 'Pink', value: '#fbcfe8' },
  { name: 'Orange', value: '#fed7aa' },
  { name: 'Gray', value: '#e5e7eb' },
];

export default function ColumnModal({ isOpen, onClose, onSave, column }: ColumnModalProps) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(colorOptions[0].value);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (column) {
      setTitle(column.title);
      setColor(column.color);
    } else {
      setTitle('');
      setColor(colorOptions[0].value);
    }
  }, [column]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, color });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div ref={modalRef} className="bg-surface rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text">
            {column ? 'Edit Column' : 'Create New Column'}
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Column Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Column Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`h-12 rounded-lg border-2 transition-all ${
                    color === option.value
                      ? 'border-primary scale-105'
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ backgroundColor: option.value }}
                  title={option.name}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-text hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all hover:scale-105"
            >
              {column ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
