import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('chord_database.json', 'utf8'));
let md = '# 3-String Chords Database\n\n';
md += '> [!NOTE]\n> Here is the complete list of all 60 chords in the database along with their playable variations, formatted as `[Low G, Middle D, High G]`.\n\n';

for (const quality in data) {
  md += `## ${quality} Chords\n\n`;
  for (const chord in data[quality]) {
    const vars = data[quality][chord];
    md += `- **${chord}**: ${vars.map((v: string, i: number) => i === 0 ? `**${v}** (Default)` : v).join(', ')}\n`;
  }
  md += '\n';
}

fs.writeFileSync('/Users/aarondeaville/.gemini/antigravity/brain/93340ffe-39af-4568-b6f4-cdc7b4b9a0cb/chord_database.md', md);
