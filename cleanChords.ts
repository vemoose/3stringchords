import fs from 'fs';
import path from 'path';
import { CHORDS, Chord } from './src/data/chords';

const FILE_PATH = path.join(process.cwd(), 'src/data/chords.ts');

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function noteToNumber(note: string) {
  return NOTES.indexOf(note);
}

function numberToNote(num: number) {
  return NOTES[num % 12];
}

const getPitchClass = (stringNum: number, fret: number) => {
  const root = stringNum === 2 ? noteToNumber('D') : noteToNumber('G');
  return (root + fret) % 12;
};

const EXPECTED_INTERVALS: Record<string, number[]> = {
  'Major': [0, 4, 7],
  'Minor': [0, 3, 7],
  'Power (5)': [0, 7],
  '7': [0, 4, 7, 10],
  'm7': [0, 3, 7, 10],
  'maj7': [0, 4, 7, 11],
  '6': [0, 4, 7, 9],
  'sus2': [0, 2, 7],
  'sus4': [0, 5, 7],
  'dim': [0, 3, 6],
  'aug': [0, 4, 8]
};

let removedCount = 0;

CHORDS.forEach(chord => {
  const rootNum = noteToNumber(chord.root);
  const allowedIntervals = EXPECTED_INTERVALS[chord.quality];
  
  if (!allowedIntervals) return; // Skip if we don't have intervals defined
  
  const allowedPitchClasses = allowedIntervals.map(interval => (rootNum + interval) % 12);
  
  const originalCount = chord.variations.length;
  
  chord.variations = chord.variations.filter((variation, index) => {
    // ALWAYS keep the user_primary variation, as it's defined exactly by the user
    if (variation.id === 'user_primary') return true;
    
    const frets = [
      variation.positions.find(p => p.string === 3)?.fret || 0,
      variation.positions.find(p => p.string === 2)?.fret || 0,
      variation.positions.find(p => p.string === 1)?.fret || 0
    ];
    
    const producedPcs = frets.map((fret, i) => getPitchClass(3 - i, fret));
    
    // Check if any produced note is NOT in the allowed pitch classes
    const wrongNotes = producedPcs.filter(pc => !allowedPitchClasses.includes(pc));
    
    if (wrongNotes.length > 0) {
      console.log(`Removing wrong variation in ${chord.root} ${chord.quality}: [${frets.join(',')}]`);
      removedCount++;
      return false; // Remove this variation
    }
    
    return true; // Keep this variation
  });
  
  // Failsafe: if we somehow removed all variations (should never happen), put an empty one back
  if (chord.variations.length === 0) {
     console.error(`ERROR: ${chord.root} ${chord.quality} has no variations left!`);
  }
});

console.log(`Removed ${removedCount} mathematically incorrect variations in total.`);

const fileContent = `export type Finger = 1 | 2 | 3 | 4;

export interface Position {
  string: number;
  fret: number;
  finger: Finger;
}

export interface ChordVariation {
  id: string;
  startingFret: number;
  positions: Position[];
}

export interface Chord {
  id: string;
  root: string;
  quality: string;
  suffix: string;
  variations: ChordVariation[];
}

export const ROOT_NOTES = [
  { value: 'G', label: 'G' },
  { value: 'G#', label: 'G#' },
  { value: 'A', label: 'A' },
  { value: 'A#', label: 'A#' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'C#', label: 'C#' },
  { value: 'D', label: 'D' },
  { value: 'D#', label: 'D#' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
  { value: 'F#', label: 'F#' },
];

export const CHORD_QUALITIES = [
  { value: 'Power (5)', label: 'Power (5)', suffix: '5' },
  { value: 'Major', label: 'Major', suffix: '' },
  { value: 'Minor', label: 'Minor', suffix: 'm' },
  { value: '7', label: 'Dominant 7', suffix: '7' },
  { value: 'm7', label: 'Minor 7', suffix: 'm7' },
];

export const CHORDS: Chord[] = ${JSON.stringify(CHORDS, null, 2)};
`;

fs.writeFileSync(FILE_PATH, fileContent);
