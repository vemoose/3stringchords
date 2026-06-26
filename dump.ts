import { CHORDS } from './src/data/chords';

const notesToCheck = ['A', 'A#', 'B', 'C', 'D'];

CHORDS.forEach(chord => {
  if (notesToCheck.includes(chord.root)) {
    const vars = chord.variations.map(v => {
      const frets = [
        v.positions.find(p => p.string === 3)?.fret ?? 'x',
        v.positions.find(p => p.string === 2)?.fret ?? 'x',
        v.positions.find(p => p.string === 1)?.fret ?? 'x'
      ];
      return `${v.id}: [${frets.join(', ')}]`;
    });
    console.log(`${chord.root} ${chord.quality}: ${vars.join(' | ')}`);
  }
});
