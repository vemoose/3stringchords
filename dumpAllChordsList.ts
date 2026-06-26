import { CHORDS } from './src/data/chords';

const ENHARMONIC_MAP: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb'
};

const qualities = ['Major', 'Minor', 'Power (5)', '7', 'm7'];

const result: Record<string, any> = {};

qualities.forEach(q => {
  result[q] = {};
  
  CHORDS.filter(c => c.quality === q).forEach(chord => {
    const name = chord.root + (ENHARMONIC_MAP[chord.root] ? `/${ENHARMONIC_MAP[chord.root]}` : '') + chord.suffix;
    
    const vars = chord.variations.map(v => {
      const frets = [
        v.positions.find((p: any) => p.string === 3)?.fret || 0,
        v.positions.find((p: any) => p.string === 2)?.fret || 0,
        v.positions.find((p: any) => p.string === 1)?.fret || 0
      ];
      return `[${frets.join(', ')}]`;
    });
    
    result[q][name] = vars;
  });
});

console.log(JSON.stringify(result, null, 2));
