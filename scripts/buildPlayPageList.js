const { execSync } = require('child_process');
const fs = require('fs');
const output = './src/data/play-files.json';
const fileListBuffer = execSync(
  "grep -rl --exclude-dir=build 'play.onflow.org' ./docs | sed 's|./docs/(.*).[^.]*$|\1|'",
);
const fileListString = fileListBuffer.toString().trim();
const fileList = fileListString.split('\n');

const fileListWithoutPrefixAndExt = fileList.map((filename) =>
  filename.replace(/^\.\/docs/, '').replace(/\.[^/.]+$/, ''),
);

const jsonData = JSON.stringify(fileListWithoutPrefixAndExt, null, 2);
fs.writeFileSync(output, jsonData);

console.log(`File list saved to ${output}`);
