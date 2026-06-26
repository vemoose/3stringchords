import fs from 'fs';
import path from 'path';
import { CHORDS, Chord } from './src/data/chords';

const FILE_PATH = path.join(process.cwd(), 'src/data/chords.ts');

let removedCount = 0;

CHORDS.forEach(chord => {
  chord.variations = chord.variations.filter(v => {
    const hasNegative = v.positions.some(p => p.fret < 0);
    if (hasNegative) {
      console.log(`Removing negative fret variation in ${chord.root} ${chord.quality}`);
      removedCount++;
      return false;
    }
    return true;
  });
});

console.log(`Removed ${removedCount} variations with negative frets.`);

if (removedCount > 0) {
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
}
