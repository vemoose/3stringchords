import { CHORDS } from './src/data/chords';

let maxSpan = 0;
let maxChord = null;

CHORDS.forEach(c => {
  c.variations.forEach(v => {
    const frets = v.positions.filter(p => p.fret > 0).map(p => p.fret);
    if (frets.length > 0) {
      const minFret = Math.min(...frets);
      const maxFret = Math.max(...frets);
      const span = maxFret - minFret;
      if (span > maxSpan) {
        maxSpan = span;
        maxChord = { chord: c.id, var: v.id, frets, minFret, maxFret };
      }
    }
  });
});

console.log("Max Span:", maxSpan);
console.log("Details:", maxChord);
