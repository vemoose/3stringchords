import * as fs from 'fs';

const chordsPath = './src/data/chords.ts';
const content = fs.readFileSync(chordsPath, 'utf-8');
const match = content.match(/export const GDG_CHORDS: Chord\[\] = (\[[\s\S]*?\]);\n/);
if (match) {
  const chords = new Function(`return ${match[1]}`)();
  const g = chords.find(c => c.root === 'G' && c.quality === 'Major');
  const gm = chords.find(c => c.root === 'G' && c.quality === 'Minor');
  
  console.log('G Major variations:', JSON.stringify(g?.variations, null, 2));
  console.log('G Minor variations:', JSON.stringify(gm?.variations, null, 2));
}
