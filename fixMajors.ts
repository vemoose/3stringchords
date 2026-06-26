import fs from 'fs';
import path from 'path';
import { CHORDS } from './src/data/chords';

const FILE_PATH = path.join(process.cwd(), 'src/data/chords.ts');

// The exact frets from the PDF for Major chords
const PDF_MAJORS: Record<string, number[]> = {
  'A': [2, 2, 2],
  'A#': [3, 3, 3],
  'B': [4, 4, 4],
  'C': [5, 5, 5],
  'C#': [6, 6, 6],
  'D': [2, 0, 2],   // A-D-A
  'D#': [3, 1, 0],  // Bb-Eb-G
  'E': [4, 2, 1],   // B-E-G#
  'F': [2, 3, 5],   // A-F-C
  'F#': [3, 4, 6],  // Bb-F#-C#
  'G': [0, 0, 0],
  'G#': [1, 1, 1],
};

function fretsToPositions(frets: number[]) {
  const positions = [];
  if (frets[0] > 0) positions.push({ string: 3, fret: frets[0], finger: 1 });
  if (frets[1] > 0) positions.push({ string: 2, fret: frets[1], finger: 2 });
  if (frets[2] > 0) positions.push({ string: 1, fret: frets[2], finger: 3 });
  
  // Basic auto-fingering logic based on standard shapes
  if (frets[0] > 0 && frets[2] > 0 && frets[0] === frets[2] && frets[0] === frets[1]) {
    // Barre all 3 strings
    positions.forEach(p => p.finger = 1);
  } else if (frets[0] === 2 && frets[1] === 0 && frets[2] === 2) {
    const p3 = positions.find(p => p.string === 3);
    const p1 = positions.find(p => p.string === 1);
    if (p3) p3.finger = 2;
    if (p1) p1.finger = 3;
  }
  return positions;
}

const updatedChords = CHORDS.map(chord => {
  if (chord.quality === 'Major' && PDF_MAJORS[chord.root]) {
    const frets = PDF_MAJORS[chord.root];
    
    // First, remove the 'pdf_major' variation we added in the bad script
    const badPdfIndex = chord.variations.findIndex(v => v.id === 'pdf_major');
    if (badPdfIndex > -1) {
      chord.variations.splice(badPdfIndex, 1);
    }
    
    // Find if the *correct* pdf variation already exists
    const existsIndex = chord.variations.findIndex(v => {
      const vFrets = [
        v.positions.find(p => p.string === 3)?.fret || 0,
        v.positions.find(p => p.string === 2)?.fret || 0,
        v.positions.find(p => p.string === 1)?.fret || 0
      ];
      return vFrets[0] === frets[0] && vFrets[1] === frets[1] && vFrets[2] === frets[2];
    });

    const newVar = {
      id: 'pdf_major',
      startingFret: Math.max(1, Math.min(...frets.filter(f => f > 0)) || 1),
      positions: fretsToPositions(frets)
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
console.log("Successfully fixed Major chords to match PDF!");
