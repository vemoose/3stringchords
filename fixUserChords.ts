import fs from 'fs';
import path from 'path';
import { CHORDS, Chord } from './src/data/chords';

const FILE_PATH = path.join(process.cwd(), 'src/data/chords.ts');

function findChord(id: string): Chord {
  const chord = CHORDS.find(c => c.id === id);
  if (!chord) throw new Error(`Chord ${id} not found`);
  return chord;
}

function createVar(id: string, frets: number[], fingers: (number|null)[]) {
  const positions: any[] = [];
  if (frets[0] > 0) positions.push({ string: 3, fret: frets[0], finger: fingers[0] || 1 });
  if (frets[1] > 0) positions.push({ string: 2, fret: frets[1], finger: fingers[1] || 1 });
  if (frets[2] > 0) positions.push({ string: 1, fret: frets[2], finger: fingers[2] || 1 });
  
  if (frets[0] === 0) positions.push({ string: 3, fret: 0, finger: 1 });
  if (frets[1] === 0) positions.push({ string: 2, fret: 0, finger: 1 });
  if (frets[2] === 0) positions.push({ string: 1, fret: 0, finger: 1 });
  
  return {
    id,
    startingFret: Math.max(1, Math.min(...frets.filter(f => f > 0)) || 1),
    positions
  };
}

// 1. D major -> [2,0,2]
const dMaj = findChord('d_major');
dMaj.variations.unshift(createVar('user_default', [2, 0, 2], [1, null, 2]));

// 2. E major -> second variation becomes default
const eMaj = findChord('e_major');
if (eMaj.variations.length > 1) {
  const temp = eMaj.variations[0];
  eMaj.variations[0] = eMaj.variations[1];
  eMaj.variations[1] = temp;
}

// 3. F# major -> [6,4,3]
const fSharpMaj = findChord('fsharp_major');
fSharpMaj.variations.unshift(createVar('user_default', [6, 4, 3], [4, 2, 1]));

// 4. Bbm (A# minor) -> [3,3,6]
const aSharpMin = findChord('asharp_minor');
aSharpMin.variations.unshift(createVar('user_default', [3, 3, 6], [1, 1, 4]));

// 5. Bm -> [4,0,4]
const bMin = findChord('b_minor');
bMin.variations.unshift(createVar('user_default', [4, 0, 4], [1, null, 2]));

// 6. Fm -> variation 3 (index 2) should be default, fix fingers
const fMin = findChord('f_minor');
if (fMin.variations.length >= 3) {
  const var3 = fMin.variations[2];
  // Fix fingers for [5,3,1]
  var3.positions.forEach(p => {
    if (p.string === 3) p.finger = 4;
    if (p.string === 2) p.finger = 2;
    if (p.string === 1) p.finger = 1;
  });
  // Make it default
  fMin.variations.splice(2, 1);
  fMin.variations.unshift(var3);
} else {
  fMin.variations.unshift(createVar('user_default', [5, 3, 1], [4, 2, 1]));
}

// 7. F#m -> [2,4,6]
const fSharpMin = findChord('fsharp_minor');
fSharpMin.variations.unshift(createVar('user_default', [2, 4, 6], [1, 2, 4]));

// 8. Gm -> [3,0,0]
const gMin = findChord('g_minor');
gMin.variations.unshift(createVar('user_default', [3, 0, 0], [3, null, null]));

// 9. G#m -> [4,1,1]
const gSharpMin = findChord('gsharp_minor');
gSharpMin.variations.unshift(createVar('user_default', [4, 1, 1], [4, 1, 1]));

// 10. A7 -> [12,11,9]
const a7 = findChord('a_7');
a7.variations.unshift(createVar('user_default', [12, 11, 9], [4, 3, 1]));

// Now remove exact duplicates in all chords
CHORDS.forEach(chord => {
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
console.log("Successfully fixed requested user chords!");
