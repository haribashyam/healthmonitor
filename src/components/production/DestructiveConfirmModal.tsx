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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn font-mono"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="w-full max-w-md bg-[var(--bg-card)] border-2 border-[var(--border-edge)] p-6 space-y-4 text-[var(--text-main)] transition-colors shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-rose-500/15 text-rose-500 border border-rose-500/30 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 id="confirm-modal-title" className="text-base font-serif font-black uppercase tracking-tight text-[var(--text-main)]">
              {title}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-sans leading-relaxed">
              {description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-[var(--bg-card-alt)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] font-mono">
          <span className="font-bold text-rose-500 uppercase">Warning:</span> This action is irreversible and will permanently wipe corresponding local encryption keys and cached biometric streams.
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[var(--border-edge)] bg-[var(--bg-card-alt)] hover:bg-[var(--bg-card-contrast)] text-[var(--text-main)] text-xs font-bold uppercase transition-all"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase transition-all border border-[#CC0000]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
