import * as fs from 'fs';
import * as path from 'path';

const chordsPath = path.resolve('./src/data/chords.ts');
let content = fs.readFileSync(chordsPath, 'utf-8');

const regex = /export const GDG_CHORDS: Chord\[\] = (\[[\s\S]*?\]);\n\nexport const DAD_CHORDS/;
const match = content.match(regex);
const gdgString = match ? match[1] : '[]';
const gdg = new Function(`return ${gdgString}`)();

const dPower = gdg.find((c: any) => c.root === 'D' && c.quality === 'Power (5)');
console.log('D Power (GDG):', JSON.stringify(dPower?.variations, null, 2));
