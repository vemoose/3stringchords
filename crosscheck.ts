import fs from 'fs';
import { CHORDS } from './src/data/chords';

const pdfMinors: Record<string, number[]> = {
  'A': [2, 2, 5],
  'A#': [3, 3, 6],
  'B': [4, 4, 7],
  'C': [5, 5, 8],
  'C#': [6, 6, 9],
  'D': [7, 7, 10],
  'D#': [8, 8, 11],
  'E': [0, 2, 0],
  'F': [1, 3, 1],
  'F#': [2, 4, 2],
  'G': [3, 5, 3],
  'G#': [4, 6, 4] // based on pattern [root, root+2, root] where root of G#m is fret 4 on low G string? Wait. G# is fret 1. So [1, 3, 1] is Fm. [4, 6, 4] is Bm?
};

console.log("Crosschecking Minor chords...");
CHORDS.filter(c => c.quality === 'Minor').forEach(chord => {
  const pdfFret = pdfMinors[chord.root];
  if (pdfFret) {
    console.log(`PDF ${chord.root}m: [${pdfFret.join(', ')}]`);
    chord.variations.forEach(v => {
      const positions = v.positions.sort((a,b) => b.string - a.string);
      const frets = [
        positions.find(p => p.string===3)?.fret,
        positions.find(p => p.string===2)?.fret,
        positions.find(p => p.string===1)?.fret
      ];
      console.log(`  Our var ${v.id}: [${frets.join(', ')}]`);
    });
  }
});
