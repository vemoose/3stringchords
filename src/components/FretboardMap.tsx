import React, { useRef, useEffect } from 'react';

interface FretboardMapProps {
  isOpen: boolean;
  onClose: () => void;
}

const STRINGS = [
  { name: 'High G', rootNoteIndex: 7, thickness: 1 }, // index 7 is G
  { name: 'Middle D', rootNoteIndex: 2, thickness: 2 }, // index 2 is D
  { name: 'Low G', rootNoteIndex: 7, thickness: 3 }, // index 7 is G
];

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FRETS = 12;
const FRET_MARKERS = [3, 5, 7, 9];

export const FretboardMap: React.FC<FretboardMapProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (!dialogRef.current?.open) {
        dialogRef.current?.showModal();
      }
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const getNote = (rootIndex: number, fret: number) => {
    return NOTES[(rootIndex + fret) % 12];
  };

  return (
    <dialog 
      ref={dialogRef}
      className="expanded-chord-modal"
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div 
        className="glass" 
        style={{ 
          padding: '2rem', 
          borderRadius: 'var(--radius)', 
          width: '95vw', 
          maxWidth: '1000px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          backgroundColor: 'var(--bg-color)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Fretboard Map</h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>

        <p className="tuning-info">
          Standard Open G Tuning (G-D-G). All notes up to the 12th fret.
        </p>

        <div className="fretboard-wrapper">
          <div className="fretboard">
            
            {/* Fret Columns */}
            {Array.from({ length: FRETS + 1 }).map((_, fretIndex) => (
              <div 
                key={`fret-${fretIndex}`} 
                className={`fret-col ${fretIndex === 0 ? 'nut' : ''}`}
              >
                {/* Fret Markers */}
                {FRET_MARKERS.includes(fretIndex) && (
                  <div className="fret-marker" />
                )}
                {fretIndex === 12 && (
                  <>
                    <div className="fret-marker double-1" />
                    <div className="fret-marker double-2" />
                  </>
                )}

                {/* Strings and Notes */}
                {STRINGS.map((string, stringIndex) => {
                  const topPosition = `${(stringIndex * 33.33) + 16.66}%`;
                  
                  return (
                    <React.Fragment key={`string-${stringIndex}-fret-${fretIndex}`}>
                      {/* String Line */}
                      {fretIndex > 0 && (
                        <div 
                          className="string-line" 
                          style={{ 
                            '--pos': topPosition,
                            '--thick': `${string.thickness}px` 
                          } as React.CSSProperties} 
                        />
                      )}
                      
                      {/* Note Circle */}
                      <div 
                        className={`note-circle ${fretIndex === 0 ? 'open' : ''}`}
                        style={{ '--pos': topPosition } as React.CSSProperties}
                      >
                        {getNote(string.rootNoteIndex, fretIndex)}
                      </div>
                    </React.Fragment>
                  );
                })}
                
                {/* Fret Number Label */}
                {fretIndex > 0 && (
                  <div className="fret-number">{fretIndex}</div>
                )}
                {fretIndex === 0 && (
                  <div className="fret-number open-label">Open</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </dialog>
  );
};
