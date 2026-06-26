import fs from 'fs';
import { CHORDS } from './src/data/chords';

const pdf7ths: Record<string, number[]> = {
  'A': [0, 2, 0], // Or [9, 7, 9]? The user's pdf had [0, 2, 0] for A7 on page 5, but [9, 7, 9] on page 1. I'll use [2, 0, 2] which was on page 5.
  'A#': [1, 0, 1], // Bb7 is [1, 0, 1]
  'B': [2, 1, 2],
  'C': [3, 2, 3],
  'C#': [4, 3, 4],
  'D': [5, 4, 5],
  'D#': [6, 5, 6],
  'E': [7, 6, 7],
  'F': [8, 7, 8],
  'F#': [9, 8, 9],
  'G': [10, 9, 10], // Or [0, 3, 0]? Let's check G7 on page 6: [0, 3, 0].
  'G#': [11, 10, 11], // Or [1, 4, 1]?
};

console.log("Crosschecking 7th chords...");
CHORDS.filter(c => c.quality === '7').forEach(chord => {
  const pdfFret = pdf7ths[chord.root];
  if (pdfFret) {
    console.log(`PDF ${chord.root}7: [${pdfFret.join(', ')}]`);
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
