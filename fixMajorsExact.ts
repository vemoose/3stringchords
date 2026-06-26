import fs from 'fs';
import path from 'path';
import { CHORDS } from './src/data/chords';

const FILE_PATH = path.join(process.cwd(), 'src/data/chords.ts');

const CORRECT_PDF_MAJORS: Record<string, number[]> = {
  'A': [2, 2, 2],
  'A#': [3, 0, 3],
  'B': [4, 4, 4],
  'C': [5, 2, 0],
  'C#': [6, 6, 6],
  'D': [2, 0, 2],
  'D#': [3, 1, 0],
  'E': [4, 2, 1],
  'F': [5, 3, 2],
  'F#': [6, 4, 3],
  'G': [0, 0, 0],
  'G#': [1, 1, 1],
};

function fretsToPositions(frets: number[]) {
  const positions = [];
  if (frets[0] > 0) positions.push({ string: 3, fret: frets[0], finger: 1 });
  if (frets[1] > 0) positions.push({ string: 2, fret: frets[1], finger: 2 });
  if (frets[2] > 0) positions.push({ string: 1, fret: frets[2], finger: 3 });
  
  if (frets[0] === 0) positions.push({ string: 3, fret: 0, finger: 1 });
  if (frets[1] === 0) positions.push({ string: 2, fret: 0, finger: 1 });
  if (frets[2] === 0) positions.push({ string: 1, fret: 0, finger: 1 });
  
  // Clean up fingers
  // For barres
  if (frets[0] > 0 && frets[1] === frets[0] && frets[2] === frets[0]) {
    positions.forEach(p => p.finger = 1);
  }
  // Custom fingerings based on the photos
  else if (frets[0] === 3 && frets[1] === 0 && frets[2] === 3) { // A#
    positions.find(p => p.string === 3).finger = 2;
    positions.find(p => p.string === 1).finger = 3;
  }
  else if (frets[0] === 5 && frets[1] === 2 && frets[2] === 0) { // C
    positions.find(p => p.string === 3).finger = 4; // pinky
    positions.find(p => p.string === 2).finger = 1; // index
  }
  else if (frets[0] === 2 && frets[1] === 0 && frets[2] === 2) { // D
    positions.find(p => p.string === 3).finger = 1;
    positions.find(p => p.string === 1).finger = 2;
  }
  else if (frets[0] === 3 && frets[1] === 1 && frets[2] === 0) { // Eb
    positions.find(p => p.string === 3).finger = 3;
    positions.find(p => p.string === 2).finger = 1;
  }
  else if (frets[0] === 4 && frets[1] === 2 && frets[2] === 1) { // E
    positions.find(p => p.string === 3).finger = 4;
    positions.find(p => p.string === 2).finger = 2;
    positions.find(p => p.string === 1).finger = 1;
  }
  else if (frets[0] === 5 && frets[1] === 3 && frets[2] === 2) { // F
    positions.find(p => p.string === 3).finger = 4;
    positions.find(p => p.string === 2).finger = 2;
    positions.find(p => p.string === 1).finger = 1;
  }
  else if (frets[0] === 6 && frets[1] === 4 && frets[2] === 3) { // F#
    positions.find(p => p.string === 3).finger = 4;
    positions.find(p => p.string === 2).finger = 2;
    positions.find(p => p.string === 1).finger = 1;
  }

  return positions;
}

const updatedChords = CHORDS.map(chord => {
  if (chord.quality === 'Major' && CORRECT_PDF_MAJORS[chord.root]) {
    const frets = CORRECT_PDF_MAJORS[chord.root];
    
    // Remove the previous pdf_major if it exists
    const badPdfIndex = chord.variations.findIndex(v => v.id === 'pdf_major');
    if (badPdfIndex > -1) {
      chord.variations.splice(badPdfIndex, 1);
    }
    
    const newVar = {
      id: 'pdf_major',
      startingFret: Math.max(1, Math.min(...frets.filter(f => f > 0)) || 1),
      positions: fretsToPositions(frets).filter(p => p.fret >= 0)
    };
    
    chord.variations.unshift(newVar);
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
console.log("Successfully fixed Major chords to match PDF precisely!");
