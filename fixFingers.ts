import fs from 'fs';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'src/data/chords.ts');

let content = fs.readFileSync(FILE_PATH, 'utf-8');

// The file exports CHORDS which is an array of objects.
// Wait, since I already wrote it as JSON, I can just require it! No, it has TS types.
// I will just use regex to add finger: 1 to any position missing it.
// Or better, I can just parse it by stripping the exports.

content = content.replace(/\{(\s*)"string": (\d+),(\s*)"fret": (\d+)(\s*)\}/g, '{\n            "string": $2,\n            "fret": $4,\n            "finger": 1\n          }');

fs.writeFileSync(FILE_PATH, content);
console.log("Fixed missing fingers!");
