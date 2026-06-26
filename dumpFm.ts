import { CHORDS } from './src/data/chords';

const fm = CHORDS.find(c => c.id === 'f_minor');
console.log(JSON.stringify(fm?.variations, null, 2));
