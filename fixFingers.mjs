import fs from 'fs';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'src/data/chords.ts');
const TUNINGS = ['GDG', 'DAD', 'EBE', 'AEA', 'CGC'];

function assignFingers(frets) {
  const fStr = frets.join(',');
  const specific = {
    '2,0,2': [1, null, 2],
    '4,2,1': [4, 2, 1],
    '6,4,3': [4, 2, 1],
    '3,3,6': [1, 1, 4],
    '4,0,4': [1, null, 2],
    '5,3,1': [4, 2, 1],
    '2,4,6': [1, 2, 4],
    '3,0,0': [3, null, null],
    '4,1,1': [4, 1, 1],
    '12,11,9': [4, 3, 1],
    '0,2,5': [null, 1, 4],
    '1,3,5': [1, 2, 4],
    '2,3,5': [1, 2, 4],
    '3,4,6': [1, 2, 4],
    '4,4,4': [1, 1, 1],
    '6,6,6': [1, 1, 1],
    '5,2,2': [4, 1, 1],
    '6,3,3': [4, 1, 1],
    '8,5,5': [4, 1, 1],
    '9,6,6': [4, 1, 1],
    '10,7,7': [4, 1, 1],
    '11,8,8': [4, 1, 1],
    '1,0,3': [1, null, 3],
    '2,1,4': [2, 1, 4],
    '3,2,0': [2, 1, null],
    '4,3,1': [4, 2, 1],
    '5,4,7': [2, 1, 4],
    '6,5,3': [4, 3, 1],
    '7,6,9': [2, 1, 4],
    '8,7,5': [4, 3, 1],
    '9,8,11': [2, 1, 4],
    '4,3,0': [2, 1, null],
    '11,10,8': [4, 3, 1],
    '5,2,0': [4, 2, null],
    '7,4,7': [3, 1, 4],
    '9,6,9': [3, 1, 4],
    '3,1,0': [3, 1, null],
    '0,0,4': [null, null, 3],
    '0,3,0': [null, 3, null],
    '0,2,4': [null, 1, 3],
    '1,4,1': [1, 3, 1],
  };

  if (specific[fStr]) {
    return specific[fStr];
  }

  const active = frets
    .map((fret, originalIndex) => ({ fret, originalIndex }))
    .filter((note) => note.fret > 0)
    .sort((a, b) => a.fret - b.fret);

  if (active.length === 0) {
    return [null, null, null];
  }

  const minFret = active[0].fret;
  const fingers = [null, null, null];
  let currentFinger = 1;
  let lastFret = minFret;

  active.forEach((note, index) => {
    if (index === 0) {
      fingers[note.originalIndex] = 1;
      return;
    }

    if (note.fret === lastFret) {
      if (note.fret === minFret) {
        fingers[note.originalIndex] = 1;
      } else {
        currentFinger += 1;
        fingers[note.originalIndex] = currentFinger > 4 ? 4 : currentFinger;
      }
      return;
    }

    const dist = note.fret - minFret;
    if (dist === 1) currentFinger = Math.max(currentFinger + 1, 2);
    else if (dist === 2) currentFinger = Math.max(currentFinger + 1, 3);
    else if (dist >= 3) currentFinger = 4;

    currentFinger = Math.min(currentFinger, 4);
    fingers[note.originalIndex] = currentFinger;
    lastFret = note.fret;
  });

  return fingers;
}

function fixVariation(variation) {
  const frets = [3, 2, 1].map(
    (string) => variation.positions.find((position) => position.string === string)?.fret ?? 0,
  );
  const correctFingers = assignFingers(frets);

  variation.positions.forEach((position) => {
    if (position.fret <= 0) return;
    const expectedFinger = correctFingers[3 - position.string];
    if (expectedFinger !== null) {
      position.finger = expectedFinger;
    }
  });
}

function extractChordArray(content, tuning) {
  const marker = `export const ${tuning}_CHORDS: Chord[] = `;
  const start = content.indexOf(marker);
  if (start === -1) {
    throw new Error(`Could not find ${tuning}_CHORDS export`);
  }

  const arrayStart = start + marker.length;
  let depth = 0;
  for (let i = arrayStart; i < content.length; i += 1) {
    const char = content[i];
    if (char === '[') depth += 1;
    if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        return {
          arrayText: content.slice(arrayStart, i + 1),
          endIndex: i + 1,
          startIndex: start,
        };
      }
    }
  }

  throw new Error(`Could not parse ${tuning}_CHORDS array`);
}

function analyze(chords) {
  let impossibleBarre = 0;
  let varied = 0;

  chords.forEach((chord) => {
    chord.variations.forEach((variation) => {
      const active = variation.positions.filter((position) => position.fret > 0);
      const frets = new Set(active.map((position) => position.fret));
      const allOnes = active.length > 1 && active.every((position) => position.finger === 1);
      if (allOnes && frets.size > 1) impossibleBarre += 1;
      if (active.some((position) => position.finger > 1)) varied += 1;
    });
  });

  return { impossibleBarre, varied };
}

const content = fs.readFileSync(FILE_PATH, 'utf8');
const headerEnd = content.indexOf('export const GDG_CHORDS');
const header = content.slice(0, headerEnd);

let output = header;
let totalFixed = 0;

for (const tuning of TUNINGS) {
  const { arrayText } = extractChordArray(content, tuning);
  const chords = eval(arrayText);

  const before = analyze(chords);
  let tuningFixed = 0;
  chords.forEach((chord) => {
    chord.variations.forEach((variation) => {
      fixVariation(variation);
      tuningFixed += 1;
      totalFixed += 1;
    });
  });
  const after = analyze(chords);

  console.log(
    `${tuning}: ${chords.length} chords, ${tuningFixed} variations | ` +
      `impossible barres ${before.impossibleBarre} -> ${after.impossibleBarre}, ` +
      `varied ${before.varied} -> ${after.varied}`,
  );

  output += `export const ${tuning}_CHORDS: Chord[] = ${JSON.stringify(chords, null, 2)};\n\n`;
}

fs.writeFileSync(FILE_PATH, output.trimEnd() + '\n');
console.log(`\nUpdated ${FILE_PATH} (${totalFixed} variations across ${TUNINGS.length} tunings).`);
