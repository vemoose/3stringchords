import { useEffect, useRef, useState } from 'react';

interface PracticeExportDropdownProps {
  disabled?: boolean;
  isExporting?: boolean;
  onExport: () => void;
  onPrint: () => void;
  onSaveImage: () => void;
}

export function PracticeExportDropdown({
  disabled = false,
  isExporting = false,
  onExport,
  onPrint,
  onSaveImage,
}: PracticeExportDropdownProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

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
    if (isExporting) return;
    setOpen(false);
    onSaveImage();
  };

  if (isMobile) {
    return (
      <button
        type="button"
        className="practice-toolbar__print-btn"
        onClick={onExport}
        disabled={disabled || isExporting}
      >
        {isExporting ? 'Preparing…' : 'Export'}
      </button>
    );
  }

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
            disabled={isExporting}
          >
            Print
          </button>
          <button
            type="button"
            role="menuitem"
            className="practice-export-dropdown__option"
            onClick={handleSaveImage}
            disabled={isExporting}
          >
            {isExporting ? 'Saving…' : 'Save image'}
          </button>
        </div>
      )}
    </div>
  );
}
