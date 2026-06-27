export const SCALE_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const SCALE_TYPES = [
  'Major',
  'Natural Minor',
  'Minor Pentatonic',
  'Blues',
  'Major Pentatonic'
] as const;

export type ScaleType = typeof SCALE_TYPES[number];

// Maps semitone interval from root to an array of allowed chord qualities
const MAJOR_SCALE_CHORDS: Record<number, string[]> = {
  0: ['Major', 'Major 7', '6', 'Suspended', 'Power (5)'], // I
  2: ['Minor', 'm7', 'Suspended', 'Power (5)'], // ii
  4: ['Minor', 'm7', 'Power (5)'], // iii
  5: ['Major', 'Major 7', '6', 'Suspended', 'Power (5)'], // IV
  7: ['Major', '7', 'Suspended', 'Power (5)'], // V
  9: ['Minor', 'm7', 'Power (5)'], // vi
  11: ['Diminished', 'Power (5)'] // vii°
};

const NATURAL_MINOR_SCALE_CHORDS: Record<number, string[]> = {
  0: ['Minor', 'm7', 'Suspended', 'Power (5)'], // i
  2: ['Diminished', 'Power (5)'], // ii°
  3: ['Major', 'Major 7', '6', 'Suspended', 'Power (5)'], // III
  5: ['Minor', 'm7', 'Suspended', 'Power (5)'], // iv
  7: ['Minor', 'm7', 'Power (5)'], // v
  8: ['Major', 'Major 7', '6', 'Suspended', 'Power (5)'], // VI
  10: ['Major', '7', 'Suspended', 'Power (5)'] // VII
};

const MINOR_PENTATONIC_CHORDS: Record<number, string[]> = {
  0: ['Minor', 'm7', '7', 'Power (5)'], // i or I7 for bluesy stuff
  3: ['Major', 'Power (5)'], // bIII
  5: ['Minor', 'm7', 'Major', '7', 'Power (5)'], // iv or IV7
  7: ['Minor', 'm7', 'Major', '7', 'Power (5)'], // v or V7
  10: ['Major', 'Power (5)'] // bVII
};

const BLUES_SCALE_CHORDS: Record<number, string[]> = {
  0: ['Major', 'Minor', '7', 'm7', 'Power (5)'], // I
  3: ['Major', 'Power (5)'], // bIII
  5: ['Major', '7', 'Minor', 'Power (5)'], // IV
  6: ['Diminished', 'Power (5)'], // bV passing
  7: ['Major', '7', 'Minor', 'Power (5)'], // V
  10: ['Major', 'Power (5)'] // bVII
};

const MAJOR_PENTATONIC_CHORDS: Record<number, string[]> = {
  0: ['Major', 'Major 7', '6', 'Power (5)'], // I
  2: ['Minor', 'm7', 'Power (5)'], // ii
  4: ['Minor', 'm7', 'Power (5)'], // iii
  7: ['Major', '7', 'Power (5)'], // V
  9: ['Minor', 'm7', 'Power (5)'] // vi
};

export const SCALE_MAPPINGS: Record<ScaleType, Record<number, string[]>> = {
  'Major': MAJOR_SCALE_CHORDS,
  'Natural Minor': NATURAL_MINOR_SCALE_CHORDS,
  'Minor Pentatonic': MINOR_PENTATONIC_CHORDS,
  'Blues': BLUES_SCALE_CHORDS,
  'Major Pentatonic': MAJOR_PENTATONIC_CHORDS,
};

export function getChordsInScale(rootNote: string, scaleType: ScaleType): { root: string, allowedQualities: string[] }[] {
  const rootIndex = SCALE_NOTES.indexOf(rootNote);
  if (rootIndex === -1) return [];

  const mapping = SCALE_MAPPINGS[scaleType];
  const allowedChords = [];

  for (const intervalStr in mapping) {
    const interval = parseInt(intervalStr, 10);
    const noteIndex = (rootIndex + interval) % 12;
    allowedChords.push({
      root: SCALE_NOTES[noteIndex],
      allowedQualities: mapping[interval]
    });
  }

  return allowedChords;
}

export function isChordInScale(chordRoot: string, chordQuality: string, scaleRoot: string, scaleType: ScaleType): boolean {
  const allowedChords = getChordsInScale(scaleRoot, scaleType);
  const matchedRoot = allowedChords.find(c => c.root === chordRoot);
  
  if (!matchedRoot) return false;
  return matchedRoot.allowedQualities.includes(chordQuality);
}

// Generate all possible scale options for the dropdown
export const ALL_SCALES = SCALE_NOTES.flatMap(note => 
  SCALE_TYPES.map(type => `${note} ${type}`)
);
