import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DestructiveConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const DestructiveConfirmModal: React.FC<DestructiveConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Delete Permanently',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose
}) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => confirmBtnRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 animate-scaleUp text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 id="confirm-modal-title" className="text-base font-bold text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
          <span className="font-semibold text-rose-300">Warning:</span> This action is irreversible and will permanently wipe corresponding local encryption keys and cached biometric streams.
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/20"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
