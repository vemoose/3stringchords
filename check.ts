import { CHORDS } from './src/data/chords';

let found = false;
CHORDS.forEach(chord => {
  chord.variations.forEach(variation => {
    // filter out open strings (fret 0) when calculating span
    const pressedFrets = variation.positions
      .filter(p => p.fret > 0 && typeof p.fret === 'number')
      .map(p => p.fret as number);
      
    if (pressedFrets.length > 0) {
      const minFret = Math.min(...pressedFrets);
      const maxFret = Math.max(...pressedFrets);
      const span = maxFret - minFret;
      
      if (span > 3) {
        console.log(`Chord: ${chord.root}${chord.suffix} (${chord.quality}), Variation: ${variation.id}, Span: ${span} frets (from ${minFret} to ${maxFret})`);
        found = true;
      }
    }
  });
});

if (!found) console.log("All chords are playable!");
