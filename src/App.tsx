import { useState, useMemo, useEffect, useRef } from 'react';
import { AppHeader, type ViewMode } from './components/AppHeader';
import { FilterBar } from './components/FilterBar';
import { FingerGuideTip } from './components/FingerGuideTip';
import { ChordCard } from './components/ChordCard';
import { Modal } from './components/Modal';
import { PracticeList, matchesTuning, reorderSavedItems, type SavedItem } from './components/PracticeList';
import { Tuner } from './components/Tuner';
import { FretboardMap } from './components/FretboardMap';
import { isChordInScale } from './data/scales';
import type { ScaleType } from './data/scales';
import { GDG_CHORDS, DAD_CHORDS, EBE_CHORDS, AEA_CHORDS, CGC_CHORDS, formatChordName } from './data/chords';
import type { Chord, Tuning } from './data/chords';

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
  'sus2': 'Suspended',
  'sus4': 'Suspended',
  'Diminished': 'Diminished',
  'Augmented': 'Augmented',
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChip, setActiveChip] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const saved = localStorage.getItem('savedChords');
      return saved ? JSON.parse(saved) : [];
    } catch {
      console.error('Failed to parse saved chords');
      return [];
    }
  });
  const [expandedChordInfo, setExpandedChordInfo] = useState<{ chord: Chord, variationId: string } | null>(null);
  const [isTunerOpen, setIsTunerOpen] = useState(false);
  const [isFretboardOpen, setIsFretboardOpen] = useState(false);
  const [activeTuning, setActiveTuning] = useState<Tuning>('GDG');
  const [activeKey, setActiveKey] = useState<string>('Any Key');
  const [activeScaleType, setActiveScaleType] = useState<ScaleType>('Major');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const savedItemsHydrated = useRef(false);

  const currentChords = activeTuning === 'GDG' ? GDG_CHORDS : activeTuning === 'DAD' ? DAD_CHORDS : activeTuning === 'EBE' ? EBE_CHORDS : activeTuning === 'AEA' ? AEA_CHORDS : CGC_CHORDS;

  useEffect(() => {
    if (!savedItemsHydrated.current) {
      savedItemsHydrated.current = true;
      return;
    }
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
        `${chord.root} ${chord.quality}`.toLowerCase().includes(normalizedSearch) ||
        formatChordName(chord.root, chord.suffix).toLowerCase().includes(normalizedSearch);
      
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
      else if (chord.quality === 'sus2' || chord.quality === 'sus4') chips.add('Sus');
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
        `${chord.root} ${chord.quality}`.toLowerCase().includes(normalizedSearch) ||
        formatChordName(chord.root, chord.suffix).toLowerCase().includes(normalizedSearch);
      
      let matchChip = true;
      if (activeChip === 'Essential') {
        const chordName = `${chord.root} ${chord.quality}`;
        matchChip = ESSENTIAL_CHORDS.includes(chordName);
      } else if (activeChip !== 'All') {
        if (activeChip === 'Power') matchChip = chord.quality === 'Power (5)';
        else if (activeChip === '7th') matchChip = ['7', 'm7', 'Major 7'].includes(chord.quality);
        else if (activeChip === 'Extended') matchChip = chord.quality === '6';
        else if (activeChip === 'Sus') matchChip = chord.quality === 'sus2' || chord.quality === 'sus4';
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

  const practiceEntries = useMemo(() => {
    let displayIndex = 0;
    return savedItems.flatMap((item, globalIndex) => {
      if (!matchesTuning(item, activeTuning)) return [];
      const chord = currentChords.find(c => c.id === item.chordId);
      if (!chord) return [];
      const entry = {
        id: `practice-${globalIndex}`,
        item,
        chord,
        displayIndex,
      };
      displayIndex++;
      return [entry];
    });
  }, [savedItems, activeTuning, currentChords]);

  const handleReorder = (fromIndex: number, toIndex: number) => {
    setSavedItems(prev => reorderSavedItems(prev, activeTuning, fromIndex, toIndex));
  };

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

  const handleViewModeChange = (mode: ViewMode) => {
    if (mode === viewMode) return;
    if (!document.startViewTransition) {
      setViewMode(mode);
      return;
    }
    document.startViewTransition(() => {
      setViewMode(mode);
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
        <AppHeader
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          activeTuning={activeTuning}
          onTuningChange={setActiveTuning}
          activeKey={activeKey}
          onKeyChange={setActiveKey}
          activeScaleType={activeScaleType}
          onScaleTypeChange={setActiveScaleType}
          savedCount={savedItems.length}
          onOpenFretboard={() => setIsFretboardOpen(true)}
          onOpenTuner={() => setIsTunerOpen(true)}
        />

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
        ) : viewMode === 'practice' && practiceEntries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p>No chords saved for practice yet. Switch to Library and save some!</p>
          </div>
        ) : viewMode === 'library' ? (
          <div>
            {activeKey !== 'Any Key' ? (
              <>
                <div className="library-section-heading">
                  <FingerGuideTip />
                </div>
                <div className="chord-grid chord-grid-responsive">
                {filteredChords.map((chord, idx) => {
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
              </>
            ) : (
              FAMILY_ORDER.filter(family => groupedChords[family]?.length > 0).map((family, familyIdx) => (
                <div key={family} className="family-section">
                  <h3 className="family-section-header">
                    {family}
                    {familyIdx === 0 && <FingerGuideTip />}
                  </h3>
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
              ))
            )}
          </div>
        ) : (
          <PracticeList
            entries={practiceEntries}
            onReorder={handleReorder}
            isSaved={isSaved}
            onToggleSave={toggleSave}
            onExpand={handleExpand}
            expandedChordId={expandedChordInfo?.chord.id ?? null}
          />
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

      <Modal dialogRef={dialogRef} onClose={handleCloseModal} panelClassName="modal-panel--chord">
        {expandedChordInfo && (
          <ChordCard
            chord={expandedChordInfo.chord}
            initialVariationId={expandedChordInfo.variationId}
            isSaved={(varId) => isSaved(expandedChordInfo.chord.id, varId)}
            onToggleSave={toggleSave}
            isExpanded={true}
          />
        )}
      </Modal>

      <Tuner isOpen={isTunerOpen} onClose={() => setIsTunerOpen(false)} tuning={activeTuning} />
      <FretboardMap isOpen={isFretboardOpen} onClose={() => setIsFretboardOpen(false)} tuning={activeTuning} />
    </>
  );
}

export default App;
