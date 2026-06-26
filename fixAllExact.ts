import fs from 'fs';
import path from 'path';
import { CHORDS } from './src/data/chords';

const FILE_PATH = path.join(process.cwd(), 'src/data/chords.ts');

const PDF_MAJORS: Record<string, { frets: number[], fingers: (number|null)[] }> = {
  'A': { frets: [2, 2, 2], fingers: [1, 1, 1] },
  'A#': { frets: [3, 0, 3], fingers: [2, null, 3] },
  'B': { frets: [4, 4, 4], fingers: [1, 1, 1] },
  'C': { frets: [5, 2, 0], fingers: [4, 2, null] },
  'C#': { frets: [6, 6, 6], fingers: [1, 1, 1] },
  'D': { frets: [7, 4, 7], fingers: [3, 1, 4] },
  'D#': { frets: [3, 1, 0], fingers: [3, 1, null] },
  'E': { frets: [9, 6, 9], fingers: [3, 1, 4] },
  'F': { frets: [5, 3, 2], fingers: [4, 2, 1] },
  'F#': { frets: [6, 4, 3], fingers: [4, 2, 1] },
  'G': { frets: [0, 0, 4], fingers: [null, null, 3] },
  'G#': { frets: [1, 1, 1], fingers: [1, 1, 1] },
};

const PDF_MINORS: Record<string, { frets: number[], fingers: (number|null)[] }> = {
  'A': { frets: [2, 2, 5], fingers: [1, 1, 4] },
  'A#': { frets: [3, 3, 6], fingers: [1, 1, 4] },
  'B': { frets: [4, 4, 7], fingers: [1, 1, 4] },
  'C': { frets: [5, 5, 8], fingers: [1, 1, 4] },
  'C#': { frets: [6, 6, 9], fingers: [1, 1, 4] },
  'D': { frets: [7, 7, 10], fingers: [1, 1, 4] },
  'D#': { frets: [8, 8, 11], fingers: [1, 1, 4] },
  'E': { frets: [0, 2, 4], fingers: [null, 1, 3] },
  'F': { frets: [10, 10, 13], fingers: [1, 1, 4] },
  'F#': { frets: [11, 11, 14], fingers: [1, 1, 4] },
  'G': { frets: [0, 3, 0], fingers: [null, 3, null] },
  'G#': { frets: [1, 4, 1], fingers: [1, 3, 1] },
};

function buildPositions(frets: number[], fingers: (number|null)[]) {
  const positions: any[] = [];
  if (frets[0] > 0) positions.push({ string: 3, fret: frets[0], finger: fingers[0] });
  if (frets[1] > 0) positions.push({ string: 2, fret: frets[1], finger: fingers[1] });
  if (frets[2] > 0) positions.push({ string: 1, fret: frets[2], finger: fingers[2] });
  
  if (frets[0] === 0) positions.push({ string: 3, fret: 0, finger: 1 });
  if (frets[1] === 0) positions.push({ string: 2, fret: 0, finger: 1 });
  if (frets[2] === 0) positions.push({ string: 1, fret: 0, finger: 1 });
  
  // fallback for any missing fingers
  positions.forEach(p => {
    if (!p.finger || p.fret === 0) p.finger = 1;
  });
  
  return positions;
}

const updatedChords = CHORDS.map(chord => {
  let targetMap = null;
  if (chord.quality === 'Major') targetMap = PDF_MAJORS;
  if (chord.quality === 'Minor') targetMap = PDF_MINORS;
  
  if (targetMap && targetMap[chord.root]) {
    const { frets, fingers } = targetMap[chord.root];
    
    // Clean up ALL previous 'pdf_major' or 'pdf_minor' variations to prevent duplicates
    chord.variations = chord.variations.filter(v => v.id !== 'pdf_major' && v.id !== 'pdf_minor');
    
    const newVar = {
      id: chord.quality === 'Major' ? 'pdf_major' : 'pdf_minor',
      startingFret: Math.max(1, Math.min(...frets.filter(f => f > 0)) || 1),
      positions: buildPositions(frets, fingers).filter(p => p.fret >= 0)
    };
    
    // check if this exact variation already exists
    const existsIndex = chord.variations.findIndex(v => {
      const vFrets = [
        v.positions.find((p: any) => p.string === 3)?.fret || 0,
        v.positions.find((p: any) => p.string === 2)?.fret || 0,
        v.positions.find((p: any) => p.string === 1)?.fret || 0
      ];
      return vFrets[0] === frets[0] && vFrets[1] === frets[1] && vFrets[2] === frets[2];
    });

    if (existsIndex > -1) {
      const existing = chord.variations.splice(existsIndex, 1)[0];
      // update id to ensure it's marked as pdf
      existing.id = newVar.id;
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
console.log("Successfully fixed ALL Major and Minor chords to match PDF precisely!");
