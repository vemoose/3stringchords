import React, { useState } from 'react';
import type { Chord, ChordVariation } from '../data/chords';
import { formatChordName } from '../data/chords';
import { ChordChart } from './ChordChart';

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
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  let maxVisible = 5;
  if (showAdvanced) maxVisible = chord.variations.length;

  const actualVariations = chord.variations.slice(0, maxVisible);
  const safeIndex = variationIndex >= actualVariations.length ? 0 : variationIndex;

  const baseVariation: ChordVariation = actualVariations[safeIndex];
  const currentVariation: ChordVariation = isFlipped ? {
    ...baseVariation,
    positions: baseVariation.positions.map(p => {
      if (p.string === 1) return { ...p, string: 3 };
      if (p.string === 3) return { ...p, string: 1 };
      return p;
    })
  } : baseVariation;
  const isCurrentSaved = isSaved(currentVariation.id);

  const handleNextVariation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    setVariationIndex((prev) => (prev >= actualVariations.length - 1 ? 0 : prev + 1));
  };

  const handlePrevVariation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    setVariationIndex((prev) => (prev === 0 || prev >= actualVariations.length ? actualVariations.length - 1 : prev - 1));
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, system-ui, sans-serif' }}>
            {formatChordName(chord.root, chord.suffix)}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginTop: '0.25rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>
              Frets: {[3, 2, 1].map(strNum => {
                const pos = currentVariation.positions.find(p => p.string === strNum);
                return pos ? pos.fret : 'x';
              }).join(' · ')}
            </div>
            {baseVariation.badge && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 600 }}>{baseVariation.badge}</span>
                {baseVariation.helperText && ` · ${baseVariation.helperText}`}
              </div>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {baseVariation.isFlippable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
              }}
              style={{
                padding: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                outline: 'none'
              }}
              title="Flip this chord shape"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m16 3 4 4-4 4"/>
                <path d="M8 3 4 7l4 4"/>
                <path d="M4 7h16"/>
                <path d="m16 21 4-4-4-4"/>
                <path d="M20 17H4"/>
              </svg>
            </button>
          )}
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
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ flexGrow: 1 }}>
        <ChordChart variation={currentVariation} />
      </div>

      {actualVariations.length > 1 && (
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center', 
          gap: '0.75rem', 
          width: '100%',
          marginTop: '0.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <button 
            onClick={handlePrevVariation} 
            style={{ 
              padding: '0.4rem', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer'
            }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '4rem', textAlign: 'center' }}>
            {safeIndex + 1} of {actualVariations.length}
          </span>
          <button 
            onClick={handleNextVariation} 
            style={{ 
              padding: '0.4rem', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer'
            }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      )}

      {chord.variations.length > 5 && (
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          {!showAdvanced ? (
            <button
              onClick={(e) => { e.stopPropagation(); setShowAdvanced(true); }}
              style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              Show advanced shapes
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); setShowAdvanced(false); setVariationIndex(0); }}
              style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              Hide advanced shapes
            </button>
          )}
        </div>
      )}
    </div>
  );
};
