import React, { useState } from 'react';
import type { Chord, ChordVariation } from '../data/chords';
import { ChordChart } from './ChordChart';

const ENHARMONIC_MAP: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb'
};

interface ChordCardProps {
  chord: Chord;
  isSaved: (variationId: string) => boolean;
  onToggleSave: (chordId: string, variationId: string) => void;
  initialVariationId?: string;
  onExpand?: (chord: Chord, variationId: string) => void;
  isExpanded?: boolean;
}

export const ChordCard: React.FC<ChordCardProps> = ({ chord, isSaved, onToggleSave, initialVariationId, onExpand, isExpanded }) => {
  const [variationIndex, setVariationIndex] = useState(() => {
    if (initialVariationId) {
      const idx = chord.variations.findIndex(v => v.id === initialVariationId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const currentVariation: ChordVariation = chord.variations[variationIndex];
  const isCurrentSaved = isSaved(currentVariation.id);

  const handleNextVariation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVariationIndex((prev) => (prev + 1) % chord.variations.length);
  };

  const handlePrevVariation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVariationIndex((prev) => (prev === 0 ? chord.variations.length - 1 : prev - 1));
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    onToggleSave(chord.id, currentVariation.id);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleCardClick = () => {
    if (onExpand) {
      onExpand(chord, currentVariation.id);
    }
  };

  return (
    <div 
      className={`chord-card glass animate-in ${isExpanded ? 'vt-expanded-card' : ''}`} 
      onClick={handleCardClick}
      style={{ 
      padding: '1.5rem', 
      borderRadius: 'var(--radius)', 
      display: 'flex', 
      flexDirection: 'column',
      gap: '1rem',
      position: 'relative',
      backgroundColor: isExpanded ? 'var(--bg-color)' : undefined,
      cursor: onExpand ? 'pointer' : 'default',
      transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease'
    }}
    onMouseEnter={(e) => {
      if (onExpand) {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }
    }}
    onMouseLeave={(e) => {
      if (onExpand) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
          {chord.root}{ENHARMONIC_MAP[chord.root] ? ` / ${ENHARMONIC_MAP[chord.root]}` : ''}{chord.suffix} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({chord.root}{ENHARMONIC_MAP[chord.root] ? ` / ${ENHARMONIC_MAP[chord.root]}` : ''} {chord.quality})</span>
        </h3>
        <button 
          onClick={handleSaveClick}
          className={isAnimating ? 'icon-pop-active' : ''}
          style={{
            padding: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            color: isCurrentSaved ? 'var(--accent-color)' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
            outline: 'none'
          }}
          title={isCurrentSaved ? "Remove from saved" : "Save to group"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={isCurrentSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      <div style={{ flexGrow: 1 }}>
        <ChordChart variation={currentVariation} />
      </div>

      {chord.variations.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={handlePrevVariation} style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
            &larr; Prev
          </button>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Var {variationIndex + 1}/{chord.variations.length}
          </span>
          <button onClick={handleNextVariation} style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
