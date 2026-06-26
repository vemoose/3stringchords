import fs from 'fs';
import path from 'path';
import { CHORDS, Chord } from './src/data/chords';

const FILE_PATH = path.join(process.cwd(), 'src/data/chords.ts');

function assignFingers(frets: number[]): (number | null)[] {
  const fStr = frets.join(',');
  const specific: Record<string, (number | null)[]> = {
    '2,0,2': [1, null, 2], // D
    '4,2,1': [4, 2, 1], // E
    '6,4,3': [4, 2, 1], // F#
    '3,3,6': [1, 1, 4], // Bbm
    '4,0,4': [1, null, 2], // Bm
    '5,3,1': [4, 2, 1], // Fm
    '2,4,6': [1, 2, 4], // F#m
    '3,0,0': [3, null, null], // Gm
    '4,1,1': [4, 1, 1], // G#m
    '12,11,9': [4, 3, 1], // A7
    '0,2,5': [null, 1, 4], // C
    '1,3,5': [1, 2, 4], // Fm
    '2,3,5': [1, 2, 4], // F
    '3,4,6': [1, 2, 4], // F#
    '4,4,4': [1, 1, 1], // B
    '6,6,6': [1, 1, 1], // C#
    '5,2,2': [4, 1, 1], // Am
    '6,3,3': [4, 1, 1], // A#m
    '8,5,5': [4, 1, 1], // Cm
    '9,6,6': [4, 1, 1], // C#m
    '10,7,7': [4, 1, 1], // Dm
    '11,8,8': [4, 1, 1], // D#m
    '1,0,3': [1, null, 3], // A#7
    '2,1,4': [2, 1, 4], // B7
    '3,2,0': [2, 1, null], // C7
    '4,3,1': [4, 2, 1], // C#7
    '5,4,7': [2, 1, 4], // D7
    '6,5,3': [4, 3, 1], // D#7
    '7,6,9': [2, 1, 4], // E7
    '8,7,5': [4, 3, 1], // F7
    '9,8,11': [2, 1, 4], // F#7
    '4,3,0': [2, 1, null], // G7
    '11,10,8': [4, 3, 1] // G#7
  };

  if (specific[fStr]) {
    return specific[fStr];
  }

  // Algorithmic assignment
  const active = frets.map((f, i) => ({ fret: f, string: 3 - i, originalIndex: i }))
                      .filter(x => x.fret > 0)
                      .sort((a, b) => a.fret - b.fret);
                      
  if (active.length === 0) return [null, null, null];
  
  const minFret = active[0].fret;
  const fingers = [null, null, null] as (number | null)[];
  
  let currentFinger = 1;
  let lastFret = minFret;
  
  active.forEach((note, i) => {
    if (i === 0) {
      fingers[note.originalIndex] = 1;
    } else {
      if (note.fret === lastFret) {
        if (note.fret === minFret) {
           fingers[note.originalIndex] = 1;
        } else {
           currentFinger++;
           fingers[note.originalIndex] = currentFinger > 4 ? 4 : currentFinger;
        }
      } else {
        const dist = note.fret - minFret;
        if (dist === 1) currentFinger = Math.max(currentFinger + 1, 2);
        else if (dist === 2) currentFinger = Math.max(currentFinger + 1, 3);
        else if (dist >= 3) currentFinger = 4;
        
        if (currentFinger > 4) currentFinger = 4;
        
        fingers[note.originalIndex] = currentFinger;
        lastFret = note.fret;
      }
    }
  });
  
  return fingers;
}

let fixedCount = 0;

CHORDS.forEach(chord => {
  chord.variations.forEach(v => {
    const frets = [
      v.positions.find((p: any) => p.string === 3)?.fret || 0,
      v.positions.find((p: any) => p.string === 2)?.fret || 0,
      v.positions.find((p: any) => p.string === 1)?.fret || 0
    ];
    
    // Check if it looks suspiciously like default 1s
    const activePositions = v.positions.filter(p => p.fret > 0);
    const allOnes = activePositions.length > 1 && activePositions.every(p => p.finger === 1);
    
    // If they are not on the same fret, they CANNOT all be 1
    const fretsSet = new Set(activePositions.map(p => p.fret));
    const isImpossibleBarre = allOnes && fretsSet.size > 1;

    // We can also just recalculate it for the user_primary since we know we messed those up
    if (v.id === 'user_primary' || isImpossibleBarre) {
      const correctFingers = assignFingers(frets);
      v.positions.forEach(p => {
        if (p.fret > 0) {
          const expectedFinger = correctFingers[3 - p.string];
          if (expectedFinger !== null) {
             p.finger = expectedFinger as any;
          }
        }
      });
      fixedCount++;
    }
  });
});

console.log(`Fixed fingerings for ${fixedCount} variations.`);

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
