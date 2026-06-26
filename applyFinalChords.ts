import fs from 'fs';
import path from 'path';
import { CHORDS, Chord } from './src/data/chords';

const FILE_PATH = path.join(process.cwd(), 'src/data/chords.ts');

const TARGETS = {
  major: {
    "A": [2, 2, 2],
    "A#": [3, 0, 3],
    "B": [4, 4, 4],
    "C": [0, 2, 5],
    "C#": [6, 6, 6],
    "D": [2, 0, 2],
    "D#": [3, 1, 0],
    "E": [4, 2, 1],
    "F": [2, 3, 5],
    "F#": [3, 4, 6],
    "G": [4, 0, 0],
    "G#": [1, 1, 1]
  },

  minor: {
    "A": [5, 2, 2],
    "A#": [6, 3, 3],
    "B": [4, 0, 4],
    "C": [8, 5, 5],
    "C#": [9, 6, 6],
    "D": [10, 7, 7],
    "D#": [11, 8, 8],
    "E": [4, 2, 0],
    "F": [1, 3, 5],
    "F#": [2, 4, 6],
    "G": [3, 0, 0],
    "G#": [4, 1, 1]
  },

  dominant7: {
    "A": [12, 11, 9],
    "A#": [1, 0, 3],
    "B": [2, 1, 4],
    "C": [3, 2, 0],
    "C#": [4, 3, 1],
    "D": [5, 4, 7],
    "D#": [6, 5, 3],
    "E": [7, 6, 9],
    "F": [8, 7, 5],
    "F#": [9, 8, 11],
    "G": [4, 3, 0],
    "G#": [11, 10, 8]
  }
};

function createVar(id: string, frets: number[]) {
  const positions: any[] = [];
  if (frets[0] > 0) positions.push({ string: 3, fret: frets[0], finger: 1 });
  if (frets[1] > 0) positions.push({ string: 2, fret: frets[1], finger: 1 });
  if (frets[2] > 0) positions.push({ string: 1, fret: frets[2], finger: 1 });
  
  if (frets[0] === 0) positions.push({ string: 3, fret: 0, finger: 1 });
  if (frets[1] === 0) positions.push({ string: 2, fret: 0, finger: 1 });
  if (frets[2] === 0) positions.push({ string: 1, fret: 0, finger: 1 });
  
  return {
    id,
    startingFret: Math.max(1, Math.min(...frets.filter(f => f > 0)) || 1),
    positions
  };
}

CHORDS.forEach(chord => {
  let targetMap: any = null;
  if (chord.quality === 'Major') targetMap = TARGETS.major;
  if (chord.quality === 'Minor') targetMap = TARGETS.minor;
  if (chord.quality === '7') targetMap = TARGETS.dominant7;
  
  if (targetMap && targetMap[chord.root]) {
    const frets = targetMap[chord.root];
    
    const newVar = createVar('user_primary', frets);
    
    // check if this variation already exists exactly
    const existingIndex = chord.variations.findIndex(v => {
      const vFrets = [
        v.positions.find((p: any) => p.string === 3)?.fret || 0,
        v.positions.find((p: any) => p.string === 2)?.fret || 0,
        v.positions.find((p: any) => p.string === 1)?.fret || 0
      ];
      return vFrets[0] === frets[0] && vFrets[1] === frets[1] && vFrets[2] === frets[2];
    });

    if (existingIndex > -1) {
      const existing = chord.variations.splice(existingIndex, 1)[0];
      existing.id = 'user_primary';
      chord.variations.unshift(existing);
    } else {
      chord.variations.unshift(newVar);
    }
  }

  // Remove exact duplicates
  const seen = new Set();
  chord.variations = chord.variations.filter(v => {
    const frets = [
      v.positions.find((p: any) => p.string === 3)?.fret || 0,
      v.positions.find((p: any) => p.string === 2)?.fret || 0,
      v.positions.find((p: any) => p.string === 1)?.fret || 0
    ].join(',');
    if (seen.has(frets)) return false;
    seen.add(frets);
    return true;
  });
});

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
console.log("Successfully applied final chords from user payload!");
