import React, { useRef, useEffect } from 'react';

import type { Tuning } from '../data/chords';
import { Modal } from './Modal';

interface FretboardMapProps {
  isOpen: boolean;
  onClose: () => void;
  tuning: Tuning;
}

const TUNINGS = {
  GDG: [
    { name: 'G4', rootNoteIndex: 7, thickness: 1 },
    { name: 'D4', rootNoteIndex: 2, thickness: 2 },
    { name: 'G3', rootNoteIndex: 7, thickness: 3 },
  ],
  DAD: [
    { name: 'D4', rootNoteIndex: 2, thickness: 1 },
    { name: 'A3', rootNoteIndex: 9, thickness: 2 },
    { name: 'D3', rootNoteIndex: 2, thickness: 3 },
  ],
  EBE: [
    { name: 'E4', rootNoteIndex: 4, thickness: 1 },
    { name: 'B3', rootNoteIndex: 11, thickness: 2 },
    { name: 'E3', rootNoteIndex: 4, thickness: 3 },
  ],
  AEA: [
    { name: 'A4', rootNoteIndex: 9, thickness: 1 },
    { name: 'E4', rootNoteIndex: 4, thickness: 2 },
    { name: 'A3', rootNoteIndex: 9, thickness: 3 },
  ],
  CGC: [
    { name: 'C4', rootNoteIndex: 0, thickness: 1 },
    { name: 'G3', rootNoteIndex: 7, thickness: 2 },
    { name: 'C3', rootNoteIndex: 0, thickness: 3 },
  ],
};

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FRETS = 19;
const FRET_MARKERS = [3, 5, 7, 9, 15, 17];

const TUNING_LABELS: Record<Tuning, string> = {
  GDG: 'Standard Open G Tuning (G-D-G).',
  DAD: 'Open D Tuning (D-A-D).',
  EBE: 'Open E Tuning (E-B-E).',
  AEA: 'Open A Tuning (A-E-A).',
  CGC: 'Open C Tuning (C-G-C).',
};

export const FretboardMap: React.FC<FretboardMapProps> = ({ isOpen, onClose, tuning }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const strings = TUNINGS[tuning];

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

  const fretIndices = Array.from({ length: FRETS + 1 }, (_, i) => i);

  return (
    <Modal
      dialogRef={dialogRef}
      onClose={onClose}
      panelClassName="modal-panel--wide fretboard-modal"
    >
      <div className="fretboard-modal-content">
        <h2 className="fretboard-modal-title">Fretboard Map</h2>

        <p className="tuning-info">
          {TUNING_LABELS[tuning]}
        </p>

        {/* Desktop: horizontal scrolling fretboard */}
        <div className="fretboard-desktop">
          <div className="fretboard-wrapper">
            <div className="fretboard">
              {fretIndices.map((fretIndex) => (
                <div
                  key={`fret-${fretIndex}`}
                  className={`fret-col ${fretIndex === 0 ? 'nut' : ''}`}
                >
                  {FRET_MARKERS.includes(fretIndex) && <div className="fret-marker" />}
                  {fretIndex === 12 && (
                    <>
                      <div className="fret-marker double-1" />
                      <div className="fret-marker double-2" />
                    </>
                  )}

                  {strings.map((string, stringIndex) => {
                    const topPosition = `${stringIndex * 33.33 + 16.66}%`;

                    return (
                      <React.Fragment key={`string-${stringIndex}-fret-${fretIndex}`}>
                        {fretIndex > 0 && (
                          <div
                            className="string-line"
                            style={
                              {
                                '--pos': topPosition,
                                '--thick': `${string.thickness}px`,
                              } as React.CSSProperties
                            }
                          />
                        )}

                        <div
                          className={`note-circle ${fretIndex === 0 ? 'open' : ''}`}
                          style={{ '--pos': topPosition } as React.CSSProperties}
                        >
                          {getNote(string.rootNoteIndex, fretIndex)}
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {fretIndex > 0 ? (
                    <div className="fret-number">{fretIndex}</div>
                  ) : (
                    <div className="fret-number open-label">Open</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: scrollable grid — frets 1–19 */}
        <div className="fretboard-mobile">
          <div className="fretboard-mobile-scroll">
            <div className="fretboard-grid">
              {fretIndices.slice(1).map((fretIndex) => (
                <div
                  key={`mobile-fret-${fretIndex}`}
                  className={`fretboard-grid-row ${
                    FRET_MARKERS.includes(fretIndex) ? 'fretboard-grid-row--marker' : ''
                  } ${fretIndex === 12 ? 'fretboard-grid-row--marker-12' : ''}`}
                >
                  <div className="fretboard-grid-label">{fretIndex}</div>
                  {strings.map((string, stringIndex) => (
                    <div key={`${fretIndex}-${stringIndex}`} className="fretboard-grid-cell">
                      <span className="fretboard-grid-note">
                        {getNote(string.rootNoteIndex, fretIndex)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
