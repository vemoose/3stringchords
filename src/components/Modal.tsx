import { useEffect, type ReactNode, type RefObject } from 'react';

interface ModalProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  onClose: () => void;
  children: ReactNode;
  panelClassName?: string;
  maxWidth?: string;
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function Modal({ dialogRef, onClose, children, panelClassName = '', maxWidth }: ModalProps) {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [dialogRef, onClose]);

  return (
    <dialog ref={dialogRef} className="app-modal">
      <div className="modal-shell" onClick={onClose}>
        <div
          className={`modal-panel ${panelClassName}`.trim()}
          style={maxWidth ? { maxWidth } : undefined}
          onClick={(e) => e.stopPropagation()}
          role="document"
        >
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
          {children}
        </div>
      </div>
    </dialog>
  );
}
