const fs = require('fs');

// Read chords.ts, clean up the export, and parse JSON
const code = fs.readFileSync('src/data/chords.ts', 'utf8');
const match = code.match(/export const CHORDS: Chord\[\] = (\[[\s\S]*\]);/);
if (!match) {
  console.log("Could not find CHORDS array");
  process.exit(1);
}

const chords = JSON.parse(match[1]);

chords.forEach(chord => {
  chord.variations.forEach(variation => {
    // filter out open strings (fret 0) when calculating span? 
    // Actually open strings don't require stretching fingers!
    const pressedFrets = variation.positions
      .filter(p => p.fret > 0 && typeof p.fret === 'number')
      .map(p => p.fret);
      
    if (pressedFrets.length > 0) {
      const minFret = Math.min(...pressedFrets);
      const maxFret = Math.max(...pressedFrets);
      const span = maxFret - minFret;
      
      if (span > 4) {
        console.log(`Chord: ${chord.root}${chord.suffix} (${chord.quality}), Variation: ${variation.id}, Span: ${span} frets (from ${minFret} to ${maxFret})`);
      }
    }
  });
});
