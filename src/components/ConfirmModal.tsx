import { AlertCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ConfirmModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title: string;
   message: string;
   confirmText?: string;
   cancelText?: string;
   type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
   isOpen,
   onClose,
   onConfirm,
   title,
   message,
   confirmText = 'Confirm',
   cancelText = 'Cancel',
   type = 'warning',
}: ConfirmModalProps) {
   const modalRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
         if (e.key === 'Escape') onClose();
      };

      if (isOpen) {
         document.addEventListener('keydown', handleEscape);
      }

      return () => {
         document.removeEventListener('keydown', handleEscape);
      };
   }, [isOpen, onClose]);

   if (!isOpen) return null;

   const colors = {
      danger: {
         bg: 'bg-red-50',
         icon: 'text-red-600',
         button: 'bg-red-600 hover:bg-red-700',
      },
      warning: {
         bg: 'bg-orange-50',
         icon: 'text-orange-600',
         button: 'bg-orange-600 hover:bg-orange-700',
      },
      info: {
         bg: 'bg-blue-50',
         icon: 'text-blue-600',
         button: 'bg-blue-600 hover:bg-blue-700',
      },
   };

   const colorScheme = colors[type];

   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-fade-in">
         <div
            ref={modalRef}
            className="bg-surface rounded-xl shadow-2xl w-full max-w-md animate-fade-in"
         >
            <div className="p-6">
               <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full ${colorScheme.bg} flex items-center justify-center`}>
                     <AlertCircle className={`w-6 h-6 ${colorScheme.icon}`} />
                  </div>
                  <div className="flex-1">
                     <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
                     <p className="text-sm text-text-secondary">{message}</p>
                  </div>
               </div>
            </div>

            <div className="border-t border-border p-4 flex gap-3">
               <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-text hover:bg-surface-hover transition-all"
               >
                  {cancelText}
               </button>
               <button
                  onClick={() => {
                     onConfirm();
                     onClose();
                  }}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-all ${colorScheme.button}`}
               >
                  {confirmText}
               </button>
            </div>
         </div>
      </div>
   );
}

