import * as fs from 'fs';

const chordsPath = './src/data/chords.ts';
const content = fs.readFileSync(chordsPath, 'utf-8');
const match = content.match(/export const GDG_CHORDS: Chord\[\] = (\[[\s\S]*?\]);\n/);
if (match) {
  const chords = new Function(`return ${match[1]}`)();
  const g7 = chords.find(c => c.root === 'G' && c.quality === '7');
  const gm7 = chords.find(c => c.root === 'G' && c.quality === 'm7');
  
  console.log('G 7 variations:', JSON.stringify(g7?.variations, null, 2));
  console.log('G m7 variations:', JSON.stringify(gm7?.variations, null, 2));
}
