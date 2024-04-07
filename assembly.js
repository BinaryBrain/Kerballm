const fs = require('fs');

const partFolder = 'parts';
const outputFolder = '/Users/a799qw/Library/Application Support/Steam/steamapps/common/Kerbal Space Program/Ships/VAB';

const id = (new Date()).toISOString().replace(/[-:.ZTA-Z]/g, '');
let output = `ship = AAA GEN ${id}
version = 1.12.0
description = AAA GEN ${id}
type = VAB
size = 2.05977368,3.10723305,1.80648184
steamPublishedFileId = 0
persistentId = ${Math.floor(Math.random() * 1000000)}
rot = 0,0,0,1
missionFlag = Squad/Flags/default
vesselType = Debris
`;

const json = JSON.parse(fs.readFileSync('example.json', 'utf8'));

let previousPartUUID = null;

const newParts = [];
for (let i = 0; i < json.parts.length; i++) {
  const partId = Math.floor(Math.random() * 10000);
  const partName = json.parts[i];
  const partPath = `${partFolder}/${partName}`;
  const partUUID = `${partName}_${partId}`;
  const partContent = fs.readFileSync(partPath, 'utf8');

  let lines = partContent.split('\n');
  let newLines = [];

  for (let j = 0; j < lines.length; j++) {
    if (matchStart(lines[j], 'part = ')) {
      newLines.push(`	part = ${partUUID}`);
    } else if (matchStart(lines[j], '}')) {
      // Add lines
      if (previousPartUUID) {
        newLines.push(`	link = ${previousPartUUID}`);
      }
      // ---

      newLines.push(`}`);
    } else {
      newLines.push(lines[j]);
    }
  }

  previousPartUUID = partUUID;

  newParts.push([newLines.join('\n'), '\n']);
}

for (let i = newParts.length - 1; i >= 0; i--) {
  output += newParts[i].join('\n');
}

console.log(output);
console.log(id);
fs.writeFileSync(`${outputFolder}/output${id}.craft`, output);

function matchStart(line, str) {
  return line.trim().startsWith(str);
}
