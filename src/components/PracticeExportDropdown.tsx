import { useEffect, useRef, useState } from 'react';

interface PracticeExportDropdownProps {
  disabled?: boolean;
  isSaving?: boolean;
  onPrint: () => void;
  onSaveImage: () => void;
}

export function PracticeExportDropdown({
  disabled = false,
  isSaving = false,
  onPrint,
  onSaveImage,
}: PracticeExportDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [open]);

  const handlePrint = () => {
    setOpen(false);
    onPrint();
  };

  const handleSaveImage = () => {
    if (isSaving) return;
    setOpen(false);
    onSaveImage();
  };

  return (
    <div className="practice-export-dropdown" ref={ref}>
      <button
        type="button"
        className="practice-toolbar__print-btn practice-export-dropdown__trigger"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Export
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`practice-export-dropdown__chevron${open ? ' practice-export-dropdown__chevron--open' : ''}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && !disabled && (
        <div className="practice-export-dropdown__menu" role="menu">
          <button
            type="button"
            role="menuitem"
            className="practice-export-dropdown__option"
            onClick={handlePrint}
          >
            Print
          </button>
          <button
            type="button"
            role="menuitem"
            className="practice-export-dropdown__option"
            onClick={handleSaveImage}
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : 'Save image'}
          </button>
        </div>
      )}
    </div>
  );
}
