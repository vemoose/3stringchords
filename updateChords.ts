import fs from 'fs';
import path from 'path';
import { CHORDS } from './src/data/chords';

const FILE_PATH = path.join(process.cwd(), 'src/data/chords.ts');

const NEW_MINORS: Record<string, number[]> = {
  'E': [0, 2, 0],
  'F': [1, 3, 1],
  'F#': [2, 4, 2],
  'G': [3, 5, 3]
};

const NEW_7THS: Record<string, number[]> = {
  'A': [2, 0, 2], // 2, 0, 2 on page 5 tab
  'A#': [1, 0, 1],
  'B': [2, 1, 2],
  'C': [3, 2, 3],
  'C#': [4, 3, 4],
  'D': [5, 4, 5],
  'D#': [6, 5, 6],
  'E': [7, 6, 7],
  'F': [8, 7, 8],
  'F#': [9, 8, 9],
  'G': [0, 3, 0], // using 0, 3, 0 from page 6 tab for G7
  'G#': [1, 4, 1] // 1, 4, 1 for G#7 on page 6 tab
};

function fretsToPositions(frets: number[]) {
  const positions = [];
  if (frets[0] > 0) positions.push({ string: 3, fret: frets[0], finger: 1 });
  if (frets[1] > 0) positions.push({ string: 2, fret: frets[1], finger: 2 });
  if (frets[2] > 0) positions.push({ string: 1, fret: frets[2], finger: 3 });
  
  // Basic auto-fingering logic based on standard shapes
  if (frets[0] > 0 && frets[2] > 0 && frets[0] === frets[2]) {
    // Usually barre with index (finger 1) or ring (finger 3)
    const p3 = positions.find(p => p.string === 3);
    const p1 = positions.find(p => p.string === 1);
    if (p3 && p1) {
      if (frets[1] === 0 || frets[1] < frets[0]) {
         p3.finger = 2; p1.finger = 3;
         if (positions.find(p => p.string === 2)) positions.find(p => p.string === 2)!.finger = 1;
      }
    }
  }

  return positions;
}

const updatedChords = CHORDS.map(chord => {
  let toUpdate = null;
  if (chord.quality === 'Minor' && NEW_MINORS[chord.root]) {
    toUpdate = NEW_MINORS[chord.root];
  } else if (chord.quality === '7' && NEW_7THS[chord.root]) {
    toUpdate = NEW_7THS[chord.root];
  }

  if (toUpdate) {
    const frets = toUpdate;
    const newVar = {
      id: 'pdf_primary',
      startingFret: Math.max(1, Math.min(...frets.filter(f => f > 0)) || 1),
      positions: fretsToPositions(frets)
    };
    
    // Check if this exact variation already exists
    const existsIndex = chord.variations.findIndex(v => {
      const vFrets = [
        v.positions.find(p => p.string === 3)?.fret || 0,
        v.positions.find(p => p.string === 2)?.fret || 0,
        v.positions.find(p => p.string === 1)?.fret || 0
      ];
      return vFrets[0] === frets[0] && vFrets[1] === frets[1] && vFrets[2] === frets[2];
    });

    if (existsIndex > -1) {
      // Remove it from current spot
      const existing = chord.variations.splice(existsIndex, 1)[0];
      // Put at front
      chord.variations.unshift(existing);
    } else {
      chord.variations.unshift(newVar);
    }
  }
  return chord;
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

export const CHORDS: Chord[] = ${JSON.stringify(updatedChords, null, 2)};
`;

fs.writeFileSync(FILE_PATH, fileContent);
console.log("Successfully updated chords.ts!");
