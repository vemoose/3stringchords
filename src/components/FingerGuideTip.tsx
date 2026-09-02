import React, { useState, useRef, useEffect } from 'react';

export const FingerGuideTip: React.FC = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  return (
    <div className="finger-guide-tip" ref={containerRef}>
      <button
        type="button"
        className="finger-guide-tip__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="finger-guide-tip__icon" aria-hidden="true">ⓘ</span>
        Finger numbers
      </button>
      {open && (
        <div className="finger-guide-tip__popover" role="tooltip">
          <span><span className="finger-guide__dot">1</span> Index</span>
          <span><span className="finger-guide__dot">2</span> Middle</span>
          <span><span className="finger-guide__dot">3</span> Ring</span>
          <span><span className="finger-guide__dot">4</span> Pinky</span>
        </div>
      )}
    </div>
  );
};
