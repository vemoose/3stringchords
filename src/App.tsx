import { useState, useMemo, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { ChordCard } from './components/ChordCard';
import { Tuner } from './components/Tuner';
import { FretboardMap } from './components/FretboardMap';
import { CustomDropdown } from './components/CustomDropdown';
import { isChordInScale, SCALE_TYPES } from './data/scales';
import type { ScaleType } from './data/scales';
import { GDG_CHORDS, DAD_CHORDS } from './data/chords';
import type { Chord, Tuning } from './data/chords';

type ViewMode = 'library' | 'practice';

const ESSENTIAL_CHORDS = [
  'G Major', 'C Major', 'D Major', 'E Minor', 'A Minor', 
  'A Major', 'E Major', 'F Major', 'A# Major', 
  'B Minor', 'D Minor', 'G 7', 'D 7', 'A 7', 'C 7'
];

const FAMILY_ORDER = [
  'Major', 'Minor', 'Power / 5', '7th', 'Major 7', 'Minor 7', 
  '6th', 'Suspended', 'Diminished', 'Augmented', 'Other'
];

const QUALITY_TO_FAMILY: Record<string, string> = {
  'Major': 'Major',
  'Minor': 'Minor',
  'Power (5)': 'Power / 5',
  '7': '7th',
  'm7': 'Minor 7',
  'Suspended': 'Suspended',
};

const KEY_OPTIONS = [
  { value: 'Any Key', label: 'Any Key' },
  { value: 'C', label: 'C' },
  { value: 'C# / Db', label: 'C# / Db' },
  { value: 'D', label: 'D' },
  { value: 'D# / Eb', label: 'D# / Eb' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
  { value: 'F# / Gb', label: 'F# / Gb' },
  { value: 'G', label: 'G' },
  { value: 'G# / Ab', label: 'G# / Ab' },
  { value: 'A', label: 'A' },
  { value: 'A# / Bb', label: 'A# / Bb' },
  { value: 'B', label: 'B' }
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChip, setActiveChip] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [savedItems, setSavedItems] = useState<{ chordId: string; variationId: string; tuning?: string }[]>([]);
  const [expandedChordInfo, setExpandedChordInfo] = useState<{ chord: Chord, variationId: string } | null>(null);
  const [isTunerOpen, setIsTunerOpen] = useState(false);
  const [isFretboardOpen, setIsFretboardOpen] = useState(false);
  const [activeTuning, setActiveTuning] = useState<Tuning>('GDG');
  const [activeKey, setActiveKey] = useState<string>('Any Key');
  const [activeScaleType, setActiveScaleType] = useState<ScaleType>('Major');
  const dialogRef = useRef<HTMLDialogElement>(null);
  
  const currentChords = activeTuning === 'GDG' ? GDG_CHORDS : DAD_CHORDS;

  // Load saved chords on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedChords');
    if (saved) {
      try {
        setSavedItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved chords");
      }
    }
  }, []);

  // Save to localstorage when changes
  useEffect(() => {
    localStorage.setItem('savedChords', JSON.stringify(savedItems));
  }, [savedItems]);

  const availableChips = useMemo(() => {
    const searchStr = searchTerm.toLowerCase();
    const normalizedSearch = searchStr
      .replace(/db/g, 'c#')
      .replace(/eb/g, 'd#')
      .replace(/gb/g, 'f#')
      .replace(/ab/g, 'g#')
      .replace(/bb/g, 'a#');

    const baseFiltered = currentChords.filter(chord => {
      const matchSearch = searchTerm === '' || 
        `${chord.root} ${chord.quality}`.toLowerCase().includes(normalizedSearch);
      
      let matchScale = true;
      if (activeKey !== 'Any Key') {
        const root = activeKey.split(' ')[0];
        matchScale = isChordInScale(chord.root, chord.quality, root, activeScaleType);
      }
      return matchSearch && matchScale;
    });

    const chips = new Set<string>(['All']);
    const hasEssential = baseFiltered.some(chord => 
      ESSENTIAL_CHORDS.includes(`${chord.root} ${chord.quality}`)
    );
    if (hasEssential) chips.add('Essential');

    baseFiltered.forEach(chord => {
      if (chord.quality === 'Power (5)') chips.add('Power');
      else if (chord.quality === '7' || chord.quality === 'm7' || chord.quality === 'Major 7') chips.add('7th');
      else if (chord.quality === '6') chips.add('Extended');
      else if (chord.quality === 'Suspended') chips.add('Sus');
      else if (chord.quality === 'Diminished') chips.add('Dim');
      else if (chord.quality === 'Augmented') chips.add('Aug');
      else if (chord.quality === 'Major') chips.add('Major');
      else if (chord.quality === 'Minor') chips.add('Minor');
    });
    return chips;
  }, [currentChords, searchTerm, activeKey, activeScaleType]);

  useEffect(() => {
    if (!availableChips.has(activeChip)) {
      setActiveChip('All');
    }
  }, [availableChips, activeChip]);

  const filteredChords = useMemo(() => {
    return currentChords.filter(chord => {
      const searchStr = searchTerm.toLowerCase();
      const normalizedSearch = searchStr
        .replace(/db/g, 'c#')
        .replace(/eb/g, 'd#')
        .replace(/gb/g, 'f#')
        .replace(/ab/g, 'g#')
        .replace(/bb/g, 'a#');
        
      const matchSearch = searchTerm === '' || 
        `${chord.root} ${chord.quality}`.toLowerCase().includes(normalizedSearch);
      
      let matchChip = true;
      if (activeChip === 'Essential') {
        const chordName = `${chord.root} ${chord.quality}`;
        matchChip = ESSENTIAL_CHORDS.includes(chordName);
      } else if (activeChip !== 'All') {
        if (activeChip === 'Power') matchChip = chord.quality === 'Power (5)';
        else if (activeChip === '7th') matchChip = ['7', 'm7', 'Major 7'].includes(chord.quality);
        else if (activeChip === 'Extended') matchChip = chord.quality === '6';
        else if (activeChip === 'Sus') matchChip = chord.quality === 'Suspended';
        else if (activeChip === 'Dim') matchChip = chord.quality === 'Diminished';
        else if (activeChip === 'Aug') matchChip = chord.quality === 'Augmented';
        else matchChip = chord.quality === activeChip;
      }

      let matchScale = true;
      if (activeKey !== 'Any Key') {
        const root = activeKey.split(' ')[0]; // extracts C# from "C# / Db"
        matchScale = isChordInScale(chord.root, chord.quality, root, activeScaleType);
      }

      return matchSearch && matchChip && matchScale;
    });
  }, [searchTerm, activeChip, currentChords, activeKey, activeScaleType]);

  const toggleSave = (chordId: string, variationId: string) => {
    setSavedItems(prev => {
      const exists = prev.find(item => item.chordId === chordId && item.variationId === variationId && (item.tuning === activeTuning || (!item.tuning && activeTuning === 'GDG')));
      if (exists) {
        return prev.filter(item => !(item.chordId === chordId && item.variationId === variationId && (item.tuning === activeTuning || (!item.tuning && activeTuning === 'GDG'))));
      } else {
        return [...prev, { chordId, variationId, tuning: activeTuning }];
      }
    });
  };

  const isSaved = (chordId: string, variationId: string) => {
    return savedItems.some(item => item.chordId === chordId && item.variationId === variationId && (item.tuning === activeTuning || (!item.tuning && activeTuning === 'GDG')));
  };



  const legendDotStyle = {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-color)',
    color: 'white',
    textAlign: 'center',
    lineHeight: '18px',
    fontSize: '0.7rem',
    marginRight: '4px'
  } as const;

  const groupedChords = useMemo(() => {
    const groups: Record<string, Chord[]> = {};
    const chordsList = viewMode === 'library' 
      ? filteredChords
      : Array.from(new Set(savedItems.map(item => item.chordId)))
          .map(id => currentChords.find(c => c.id === id)!)
          .filter(c => c !== undefined);

    chordsList.forEach(chord => {
      const family = QUALITY_TO_FAMILY[chord.quality] || 'Other';
      if (!groups[family]) groups[family] = [];
      groups[family].push(chord);
    });
    return groups;
  }, [filteredChords, viewMode, savedItems]);

  const handleToggleMode = () => {
    const nextMode = viewMode === 'library' ? 'practice' : 'library';
    if (!document.startViewTransition) {
      setViewMode(nextMode);
      return;
    }
    document.startViewTransition(() => {
      setViewMode(nextMode);
    });
  };

  const handleExpand = (chord: Chord, variationId: string) => {
    if (!document.startViewTransition) {
      setExpandedChordInfo({ chord, variationId });
      setTimeout(() => dialogRef.current?.showModal(), 0);
      return;
    }
    document.startViewTransition(() => {
      setExpandedChordInfo({ chord, variationId });
      setTimeout(() => dialogRef.current?.showModal(), 0);
    });
  };

  const handleCloseModal = () => {
    if (!document.startViewTransition) {
      dialogRef.current?.close();
      setExpandedChordInfo(null);
      return;
    }
    document.startViewTransition(() => {
      dialogRef.current?.close();
      setExpandedChordInfo(null);
    });
  };

  return (
    <>
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <Navbar>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="primary"
              onClick={() => setIsFretboardOpen(true)}
              style={{ 
                background: 'transparent', 
                color: 'var(--text-main)', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1rem'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="3" x2="18" y2="21"></line><line x1="14" y1="3" x2="14" y2="21"></line><line x1="10" y1="3" x2="10" y2="21"></line><line x1="6" y1="3" x2="6" y2="21"></line><line x1="2" y1="6" x2="22" y2="6"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="18" x2="22" y2="18"></line></svg>
              Fretboard
            </button>
            <button 
              className="primary"
              onClick={() => setIsTunerOpen(true)}
            style={{ 
              background: 'transparent', 
              color: 'var(--text-main)', 
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
            Tuner
          </button>
          </div>
          <button 
            className="primary" 
            onClick={handleToggleMode}
            style={{ position: 'relative' }}
          >
            {viewMode === 'library' ? 'Practice Mode' : 'Back to Library'}
            {savedItems.length > 0 && viewMode === 'library' && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {savedItems.length}
              </span>
            )}
          </button>
        </Navbar>

        {/* Legend and Tuning Selector */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          {/* Settings Group */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Tuning Selector */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              backgroundColor: 'var(--surface-color)',
              padding: '0.75rem 1.2rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border-color)',
            }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tuning:</span>
              <CustomDropdown 
                value={activeTuning}
                onChange={(val) => setActiveTuning(val as Tuning)}
                options={[
                  { value: 'GDG', label: 'G-D-G' },
                  { value: 'DAD', label: 'D-A-D' }
                ]}
              />
            </div>
            
            {/* Key Selector */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              backgroundColor: 'var(--surface-color)',
              padding: '0.75rem 1.2rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border-color)',
            }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Key:</span>
              <CustomDropdown 
                value={activeKey}
                onChange={(val) => {
                  if (activeKey === 'Any Key' && val !== 'Any Key') {
                    setActiveScaleType('Major');
                  }
                  setActiveKey(val);
                }}
                options={KEY_OPTIONS}
              />
            </div>

            {/* Scale Selector */}
            {activeKey !== 'Any Key' && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                backgroundColor: 'var(--surface-color)',
                padding: '0.75rem 1.2rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border-color)',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Scale:</span>
                <CustomDropdown 
                  value={activeScaleType}
                  onChange={(val) => setActiveScaleType(val as ScaleType)}
                  options={SCALE_TYPES.map(type => ({ value: type, label: type }))}
                />
              </div>
            )}
          </div>

          {/* Finger Guide */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            alignItems: 'center',
            backgroundColor: 'var(--surface-color)',
            padding: '0.75rem 1.2rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
          }}>
            <span style={{ fontWeight: 'bold' }}>Finger Guide:</span>
            <span><span style={legendDotStyle}>1</span> Index</span>
            <span><span style={legendDotStyle}>2</span> Middle</span>
            <span><span style={legendDotStyle}>3</span> Ring</span>
            <span><span style={legendDotStyle}>4</span> Pinky</span>
          </div>
        </div>

        {viewMode === 'library' ? (
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeChip={activeChip}
            onChipChange={setActiveChip}
            availableChips={availableChips}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            marginBottom: '1rem' 
          }}>
            <button 
              onClick={() => setSavedItems([])}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius)',
                cursor: 'pointer'
              }}
            >
              Clear All Saved
            </button>
          </div>
        )}



        {viewMode === 'library' && Object.keys(groupedChords).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p>No chords found.</p>
          </div>
        ) : viewMode === 'practice' && Object.values(groupedChords).flat().length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p>No chords saved for practice yet. Go back to the library and save some!</p>
          </div>
        ) : viewMode === 'library' ? (
          <div>
            {FAMILY_ORDER.filter(family => groupedChords[family]?.length > 0).map(family => (
              <div key={family} className="family-section">
                <h3 className="family-section-header">{family}</h3>
                <div className="chord-grid chord-grid-responsive">
                  {groupedChords[family].map((chord, idx) => {
                    const isExpanded = expandedChordInfo?.chord.id === chord.id;
                    
                    return (
                      <ChordCard
                        key={`${chord.id}-${idx}`}
                        chord={chord}
                        initialVariationId={undefined}
                        isSaved={(varId) => isSaved(chord.id, varId)}
                        onToggleSave={toggleSave}
                        onExpand={handleExpand}
                        isExpanded={isExpanded}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="chord-grid chord-grid-responsive">
            {Object.values(groupedChords).flat().map((chord, idx) => {
              const initialVar = savedItems.find(item => item.chordId === chord.id)?.variationId;
              const isExpanded = expandedChordInfo?.chord.id === chord.id;
              
              return (
                <ChordCard
                  key={`${chord.id}-${idx}`}
                  chord={chord}
                  initialVariationId={initialVar}
                  isSaved={(varId) => isSaved(chord.id, varId)}
                  onToggleSave={toggleSave}
                  onExpand={handleExpand}
                  isExpanded={isExpanded}
                />
              );
            })}
          </div>
        )}
      </div>

      <footer style={{
        marginTop: '4rem',
        padding: '3rem 1rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        textAlign: 'center'
      }}>
        <a href="https://ko-fi.com/vemoose" target="_blank" rel="noopener noreferrer" className="primary" style={{
          padding: '0.6rem 1.2rem',
          borderRadius: '9999px',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
          Buy me a coffee
        </a>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, marginTop: '0.5rem', maxWidth: '400px' }}>
          This chord library is free. A small tip helps me keep improving it.
        </p>
      </footer>

      <dialog 
        ref={dialogRef} 
        className="expanded-chord-modal"
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            handleCloseModal();
          }
        }}
      >
        {expandedChordInfo && (
          <div style={{ transform: 'scale(1.6)', transformOrigin: 'center' }}>
            <ChordCard
              chord={expandedChordInfo.chord}
              initialVariationId={expandedChordInfo.variationId}
              isSaved={(varId) => isSaved(expandedChordInfo.chord.id, varId)}
              onToggleSave={toggleSave}
              isExpanded={true}
            />
          </div>
        )}
      </dialog>

      <Tuner isOpen={isTunerOpen} onClose={() => setIsTunerOpen(false)} tuning={activeTuning} />
      <FretboardMap isOpen={isFretboardOpen} onClose={() => setIsFretboardOpen(false)} tuning={activeTuning} />
    </>
  );
}

export default App;
