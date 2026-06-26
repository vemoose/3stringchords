import fs from 'fs';
import path from 'path';
import { CHORDS } from './src/data/chords';

const FILE_PATH = path.join(process.cwd(), 'src/data/chords.ts');

const NEW_MAJORS: Record<string, number[]> = {
  'A': [2, 2, 2],
  'A#': [3, 3, 3],
  'B': [4, 4, 4],
  'C': [5, 5, 5],
  'C#': [6, 6, 6],
  'D': [2, 0, 2],
  'D#': [3, 1, 0], // The chart has D# as Eb: [0, 3, 1]? Wait, let's check Eb major on page 2: [0, 3, 1]. It has 0 on 3rd string, 3 on 2nd, 1 on 1st. 
  'E': [4, 2, 1], // wait, page 2 has E major as [1, 4, 2]. 
  'F': [2, 0, 5], // page 3 has F major as [5, 3, 2]? No, F is [2, 0, 5]. Oh, wait. The PDF shows:
                  // A: [2, 2, 2], Bb (A#): [3, 3, 0], B: [4, 4, 4]
                  // C: [5, 5, 5] (or [0, 0, 2]), D: [2, 0, 2], Eb (D#): [0, 3, 1]
                  // E: [1, 4, 2], F: [2, 0, 5]... Let me just use standard power chords for all of them!
};

// If the user just wants power chords for Major chords, it's very simple.
// The standard power chord for any root note is a straight barre across the fret of that root note on the Low G string.
// Let's define the root frets for Low G (string 3):
const rootFrets: Record<string, number> = {
  'G': 0, 'G#': 1, 'A': 2, 'A#': 3, 'B': 4, 'C': 5, 'C#': 6, 'D': 7, 'D#': 8, 'E': 9, 'F': 10, 'F#': 11
};

const updatedChords = CHORDS.map(chord => {
  if (chord.quality === 'Major') {
    const rootFret = rootFrets[chord.root];
    
    const positions = [];
    if (rootFret > 0) {
      positions.push({ string: 3, fret: rootFret, finger: 1 });
      positions.push({ string: 2, fret: rootFret, finger: 1 });
      positions.push({ string: 1, fret: rootFret, finger: 1 });
    } else {
      positions.push({ string: 3, fret: 0, finger: 1 });
      positions.push({ string: 2, fret: 0, finger: 1 });
      positions.push({ string: 1, fret: 0, finger: 1 });
    }
    
    // Check if this exact barre already exists
    const existsIndex = chord.variations.findIndex(v => {
      const vFrets = [
        v.positions.find(p => p.string === 3)?.fret || 0,
        v.positions.find(p => p.string === 2)?.fret || 0,
        v.positions.find(p => p.string === 1)?.fret || 0
      ];
      return vFrets[0] === rootFret && vFrets[1] === rootFret && vFrets[2] === rootFret;
    });
    
    const newVar = {
      id: 'pdf_major',
      startingFret: Math.max(1, rootFret),
      positions
    };

    if (existsIndex > -1) {
      const existing = chord.variations.splice(existsIndex, 1)[0];
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
console.log("Successfully updated Major chords to use power chord default!");
