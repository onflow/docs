const { execSync } = require('child_process');

const fileListBuffer = execSync(
  "grep -rl --exclude-dir=build 'play.onflow.org' ./docs | sed 's|./docs/(.*).[^.]*$|\1|'",
);
const fileListString = fileListBuffer.toString().trim();
const fileList = fileListString.split('\n');

const fileListWithoutPrefixAndExt = fileList.map((filename) =>
  filename.replace(/^\.\/docs/, '').replace(/\.[^/.]+$/, ''),
);

console.log(fileListWithoutPrefixAndExt);
