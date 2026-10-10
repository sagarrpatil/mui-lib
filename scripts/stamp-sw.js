// Runs after `react-scripts build`: stamps build/service-worker.js with a
// unique version so browsers detect each deploy as a service worker update.
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'build', 'service-worker.js');
const version = String(Date.now());
const src = fs.readFileSync(file, 'utf8');

if (!src.includes('__BUILD_VERSION__')) {
  console.error('stamp-sw: __BUILD_VERSION__ placeholder not found');
  process.exit(1);
}
fs.writeFileSync(file, src.replace(/__BUILD_VERSION__/g, version));
console.log(`stamp-sw: service worker version ${version}`);
