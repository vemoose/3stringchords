const fs = require('fs');

const ROOT_NOTES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
// Note to semitone offset from G (G=0)
const offsets = {
  "G": 0, "G#": 1, "A": 2, "A#": 3, "B": 4, "C": 5, "C#": 6, "D": 7, "D#": 8, "E": 9, "F": 10, "F#": 11
};

const chords = [];

function addVariation(chord, id, positions) {
  let minFret = 999;
  for (const pos of positions) {
    if (pos.fret !== 'x' && pos.fret > 0 && pos.fret < minFret) {
      minFret = pos.fret;
    }
  }
  let startingFret = 1;
  if (minFret > 3 && minFret !== 999) {
    startingFret = minFret;
  }
  
  chord.variations.push({
    id,
    startingFret,
    positions
  });
}

function normalizeFret(f) {
  while (f < 0) f += 12;
  while (f > 15) f -= 12; // keep it playable
  return f;
}

ROOT_NOTES.forEach(root => {
  const rootFret = offsets[root]; // Root on low G string

  const powerChord = {
    id: `${root.replace('#', 'sharp').toLowerCase()}_power`,
    root: root,
    suffix: "5",
    quality: "Power (5)",
    variations: []
  };

  addVariation(powerChord, "barre", [
    { string: 3, fret: rootFret, finger: 1 },
    { string: 2, fret: rootFret, finger: 1 },
    { string: 1, fret: rootFret, finger: 1 }
  ]);
  if (rootFret < 4) {
    addVariation(powerChord, "barre_high", [
      { string: 3, fret: rootFret + 12, finger: 1 },
      { string: 2, fret: rootFret + 12, finger: 1 },
      { string: 1, fret: rootFret + 12, finger: 1 }
    ]);
  }
  chords.push(powerChord);

  // MAJOR CHORDS
  const majorChord = {
    id: `${root.replace('#', 'sharp').toLowerCase()}_major`,
    root: root,
    suffix: "",
    quality: "Major",
    variations: []
  };

  // Root position (1-5-3)
  addVariation(majorChord, "root_pos", [
    { string: 3, fret: rootFret, finger: 1 },
    { string: 2, fret: rootFret, finger: 1 },
    { string: 1, fret: rootFret + 4, finger: 4 }
  ]);
  // 2nd Inversion (5-1-3) 
  // Root is on D string => fret = (rootFret - 7 + 12) % 12
  const midRoot = (rootFret + 5) % 12; // +12-7 = +5
  const midRootFret = midRoot === 0 ? 12 : midRoot;
  addVariation(majorChord, "2nd_inv", [
    { string: 3, fret: normalizeFret(midRootFret + 2), finger: 3 },
    { string: 2, fret: midRootFret, finger: 1 },
    { string: 1, fret: normalizeFret(midRootFret - 1), finger: 2 }
  ]);
  chords.push(majorChord);

  // MINOR CHORDS
  const minorChord = {
    id: `${root.replace('#', 'sharp').toLowerCase()}_minor`,
    root: root,
    suffix: "m",
    quality: "Minor",
    variations: []
  };

  // Root position (1-5-b3)
  addVariation(minorChord, "root_pos", [
    { string: 3, fret: rootFret, finger: 1 },
    { string: 2, fret: rootFret, finger: 1 },
    { string: 1, fret: rootFret + 3, finger: 3 }
  ]);
  // 2nd Inversion (5-1-b3)
  addVariation(minorChord, "2nd_inv", [
    { string: 3, fret: normalizeFret(midRootFret + 2), finger: 3 },
    { string: 2, fret: midRootFret, finger: 1 },
    { string: 1, fret: normalizeFret(midRootFret - 2), finger: 2 }
  ]);
  chords.push(minorChord);

  // 7TH CHORDS
  const dom7Chord = {
    id: `${root.replace('#', 'sharp').toLowerCase()}_7`,
    root: root,
    suffix: "7",
    quality: "7",
    variations: []
  };
  const d7RootFret = rootFret < 3 ? rootFret + 12 : rootFret; 
  addVariation(dom7Chord, "root_7", [
    { string: 3, fret: d7RootFret, finger: 3 },
    { string: 2, fret: d7RootFret - 3, finger: 1 },
    { string: 1, fret: d7RootFret - 2, finger: 2 }
  ]);
  chords.push(dom7Chord);

  // MINOR 7TH CHORDS
  const m7Chord = {
    id: `${root.replace('#', 'sharp').toLowerCase()}_m7`,
    root: root,
    suffix: "m7",
    quality: "m7",
    variations: []
  };
  addVariation(m7Chord, "root_m7", [
    { string: 3, fret: d7RootFret, finger: 4 },
    { string: 2, fret: d7RootFret - 4, finger: 1 },
    { string: 1, fret: d7RootFret - 2, finger: 2 }
  ]);
  chords.push(m7Chord);

});

// Clean up some open strings (e.g. fret 12 on open G power chord can just be open, but we already have both)
// Let's refine the fingering and open string representation (change 0 fret to not have finger)
for (const chord of chords) {
  for (const v of chord.variations) {
    for (const p of v.positions) {
      if (p.fret === 0) {
        delete p.finger;
      }
    }
  }
}

const fileContent = `export type Fret = number | 'x';

export interface Position {
  string: number;
  fret: Fret;
  finger?: number;
}

export interface ChordVariation {
  id: string;
  positions: Position[];
  startingFret: number;
}

export interface Chord {
  id: string; 
  root: string;
  suffix: string;
  quality: string;
  variations: ChordVariation[];
}

export const CHORDS: Chord[] = ${JSON.stringify(chords, null, 2)};

export const ROOT_NOTES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
export const CHORD_QUALITIES = ["Power (5)", "Major", "Minor", "7", "m7"];
`;

fs.writeFileSync('src/data/chords.ts', fileContent);
console.log("Generated chords.ts");
