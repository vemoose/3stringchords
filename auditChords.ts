import { CHORDS } from './src/data/chords';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function noteToNumber(note: string) {
  return NOTES.indexOf(note);
}

function numberToNote(num: number) {
  return NOTES[num % 12];
}

const STRING_ROOTS = [
  noteToNumber('G'), // High G (string 1) - wait, string 3 is low G
  noteToNumber('D'), // Middle D (string 2)
  noteToNumber('G')  // Low G (string 3)
];
// Actually, let's map string number to root directly:
// string 3 (low G) -> G
// string 2 (middle D) -> D
// string 1 (high G) -> G
const getPitchClass = (stringNum: number, fret: number) => {
  const root = stringNum === 2 ? noteToNumber('D') : noteToNumber('G');
  return (root + fret) % 12;
};

// Define expected intervals for each quality (in semitones from root)
const EXPECTED_INTERVALS: Record<string, number[]> = {
  'Major': [0, 4, 7],
  'Minor': [0, 3, 7],
  'Power (5)': [0, 7],
  '7': [0, 4, 7, 10],
  'm7': [0, 3, 7, 10],
  'maj7': [0, 4, 7, 11],
  '6': [0, 4, 7, 9],
  'sus2': [0, 2, 7],
  'sus4': [0, 5, 7],
  'dim': [0, 3, 6],
  'aug': [0, 4, 8]
};

const mistakes: any[] = [];

CHORDS.forEach(chord => {
  const rootNum = noteToNumber(chord.root);
  const allowedIntervals = EXPECTED_INTERVALS[chord.quality];
  
  if (!allowedIntervals) return; // Skip if we don't have intervals defined
  
  const allowedPitchClasses = allowedIntervals.map(interval => (rootNum + interval) % 12);
  
  chord.variations.forEach((variation, index) => {
    // skip the first variation since we just forced them to be correct
    if (index === 0) return;
    
    const frets = [
      variation.positions.find(p => p.string === 3)?.fret || 0,
      variation.positions.find(p => p.string === 2)?.fret || 0,
      variation.positions.find(p => p.string === 1)?.fret || 0
    ];
    
    const producedPcs = frets.map((fret, i) => getPitchClass(3 - i, fret));
    const producedNotes = producedPcs.map(pc => numberToNote(pc));
    
    // Check if any produced note is NOT in the allowed pitch classes
    const wrongNotes = producedPcs.filter(pc => !allowedPitchClasses.includes(pc));
    
    if (wrongNotes.length > 0) {
      mistakes.push({
        chord: `${chord.root} ${chord.quality}`,
        frets,
        producedNotes,
        wrongNotes: wrongNotes.map(n => numberToNote(n)),
        varIndex: index,
        varId: variation.id
      });
    }
  });
});

console.log(`Found ${mistakes.length} mistakes.`);
if (mistakes.length > 0) {
  console.log(JSON.stringify(mistakes.slice(0, 20), null, 2));
  if (mistakes.length > 20) {
    console.log(`...and ${mistakes.length - 20} more.`);
  }
}
